const Post = require('../models/Post');

// Helper: check ownership or admin
function canModify(user, resourceAuthorId) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return resourceAuthorId.toString() === user.id.toString();
}

exports.createPost = async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    if (!title || !body) return res.status(400).json({ message: 'Title and body are required' });

    const cleanTags = Array.isArray(tags) ? tags.map(t => String(t).trim()).filter(Boolean) : [];

    const post = new Post({ title: String(title).trim(), body: String(body).trim(), tags: cleanTags, author: req.user.id });
    await post.save();

    return res.status(201).json({ message: 'Post created', post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text required' });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ author: req.user.id, text: String(text).trim() });
    await post.save();

    return res.status(201).json({ message: 'Comment added', comment: post.comments[post.comments.length - 1] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.listPosts = async (req, res) => {
  try {
    // Pagination and filtering
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.author) filter.author = req.query.author;
    if (req.query.tag) filter.tags = req.query.tag;
    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
    }

    const [posts, total] = await Promise.all([
      Post.find(filter).populate('author', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(filter)
    ]);

    return res.json({ page, limit, total, posts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email').populate('comments.author', 'name email');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    return res.json({ post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (!canModify(req.user, post.author)) return res.status(403).json({ message: 'Forbidden' });

    const { title, body, tags } = req.body;
    if (title) post.title = String(title).trim();
    if (body) post.body = String(body).trim();
    if (tags) post.tags = Array.isArray(tags) ? tags.map(t => String(t).trim()).filter(Boolean) : post.tags;

    await post.save();
    return res.json({ message: 'Post updated', post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (!canModify(req.user, post.author)) return res.status(403).json({ message: 'Forbidden' });

    await post.remove();
    return res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.listComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate('comments.author', 'name email');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    return res.json({ comments: post.comments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (!(req.user.role === 'admin' || comment.author.toString() === req.user.id)) return res.status(403).json({ message: 'Forbidden' });

    comment.remove();
    await post.save();
    return res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
