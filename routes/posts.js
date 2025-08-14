const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

router.get('/', postController.listPosts);
router.get('/:id', postController.getPost);
router.post('/', auth, postController.createPost);
router.put('/:id', auth, postController.updatePost);
router.delete('/:id', auth, postController.deletePost);

// comments
router.get('/:postId/comments', postController.listComments);
router.post('/:postId/comments', auth, postController.addComment);
router.delete('/:postId/comments/:commentId', auth, postController.deleteComment);

module.exports = router;
