const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');

// @route  GET /api/posts
// @desc   Get all posts
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.json(posts);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Internal Server Error');
  }
});

// @route  GET /api/posts/:id
// @desc   Get post by ID
// @access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    return res.json(post);
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    return res.status(500).send('Internal Server Error');
  }
});

// @route  POST /api/posts
// @desc   Add post
// @access Private
router.post(
  '/',
  [auth, [check('text', 'Post text is required').notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;

    try {
      const user = await User.findById(req.user.id).select('-password -date');
      const newPost = new Post({
        user: req.user.id,
        text,
        name: user.name,
        avatar: user.avatar,
      });
      const post = await newPost.save();
      return res.json(post);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Internal Server Error');
    }
  }
);

// @route  DELETE /api/posts/:id
// @desc   Delete post by ID
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await post.remove();
    return res.json({ msg: 'Post deleted' });
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    return res.status(500).send('Internal Server Error');
  }
});

// @route  PUT /api/posts/like/:id
// @desc   Like a post
// @access Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    return res.status(500).send('Internal Server Error');
  }
});

// @route  PUT /api/posts/unlike/:id
// @desc   Unlike a post
// @access Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post not been liked' });
    }

    post.likes = post.likes.filter(
      (like) => like.user.toString() !== req.user.id
    );
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    return res.status(500).send('Internal Server Error');
  }
});

// @route  POST /api/posts/comment/:id
// @desc   Add comment to a post
// @access Private
router.post(
  '/comment/:id',
  [auth, [check('text', 'Comment text is required').notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;

    try {
      const user = await User.findById(req.user.id).select('-password -date');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);
      await post.save();
      return res.json(post.comments);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Internal Server Error');
    }
  }
);

// @route  PUT /api/posts/comment/:id/:comment_id
// @desc   Delete comment to a post
// @access Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
  
      const comment = post.comments.find(com => com.id === req.params.comment_id);
      if (!comment) {
        return res.status(404).json({ msg: 'Comment does not exist' });
      }

      if(comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
  
      post.comments = post.comments.filter(
        (comment) => comment.id !== req.params.comment_id
      );
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.log(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found' });
      }
      return res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;
