const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

router.get('/', postController.listPosts);
router.post('/', auth, postController.createPost);
router.post('/:postId/comments', auth, postController.addComment);

module.exports = router;
