const User = require('../users/users-model')

function logger(req, res, next) {
  const time = new Date().toLocaleString()
  const method = req.method
  const url = req.originalUrl
  console.log(`Request method - ${method}, Request url - ${url}, Request time ${time} `)
  next()
}

async function validateUserId(req, res, next) {
  try {
    const user = await User.getById(req.params.id)
    if(!user){
      res.status(404).json({
        message: 'User not found'
      })
    }else{
      req.user = user
      next()
    }
  }catch (err){
    res.status(500).json({
      message: 'Problem finding user'
    })
  }
}

function validateUser(req, res, next) {
  const { name } = req.body
  if(!name || !name.trim()){
    res.status(400).json({
      message: 'missing required name'
    })
  }else{
    req.name = name.trim()
    next()
  }
}

function validatePost(req, res, next) {
  const { text } = req.body
  if(!text || !text.trim()){
    res.status(400).json({
      message: "missing required text field"
    })
  }else{
    req.text = text.trim()
    next()
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
}
