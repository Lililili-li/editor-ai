var express = require('express');
var router = express.Router();
const userService = require('../service/User.js');
const { result } = require('../utils/results.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    hello: 'world'
  });
});

// 创建用户
router.post('/register', async function(req, res) {
  try {
    const userRes = await userService.createUser(req.body);
    res.status(200).json(userRes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 登录
router.post('/login', async function(req, res) {
  try {
    const loginRes = await userService.login(req.body);
    res.status(200).json(loginRes);
  } catch (error) {
    res.status(500).json(result(error.message, 500, null));
  }
});

module.exports = router;
