const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
const Post = require('../posts/posts-model')
const Users = require('../users/users-model')
const {
  validateUserId,
  validateUser,
  validatePost,
 } = require('../middleware/middleware');

const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
    .then(user => {
      res.json(user)
    })
    .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  Users.insert({ name: req.name })
    .then(userName => {
      res.status(201).json(userName)
    })
    .catch(next)
  console.log(req.name)
});

router.put('/:id', validateUser, validateUserId, (req, res, next) => {
  Users.update(req.params.id, { name: req.name })
    .then(updatedUser => {
      res.json(updatedUser)
    })
    .catch(next)
});

router.delete('/:id', validateUserId, (req, res, next) => {
  Users.remove(req.params.id)
    .then(() => {
      res.status(200).json(req.user)
    })
    .catch(next)
  console.log(req.user)
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  Users.getUserPosts(req.params.id)
    .then(getPosts => {
      res.json(getPosts)
    })
    .catch(next)
});

router.post('/:id/posts', validatePost, validateUserId, async (req, res, next) => {
  try{
    const newPost = await Post.insert({
      user_id: req.params.id,
      text: req.text
    })
    res.status(201).json(newPost)
  }catch(err) {
    next(err)
  }
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: 'Something wrong inside routers',
    err: err.message,
    stack: err.stack,
  })
})

// do not forget to export the router
module.exports = router
