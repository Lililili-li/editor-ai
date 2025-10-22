var express = require('express');
var router = express.Router();
const userService = require('../service/User.js');
const { result } = require('../utils/results.js');



// 获取用户列表
router.get('/', async function(req, res) {
  try {
    const data = await userService.listUsers(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取用户详情
router.get('/:id', async function(req, res) {
  try {
    const item = await userService.getUserById(req.params.id);
    if (!item) return res.json(result('用户不存在', 404, null));
    res.json(result('获取成功', 200, item));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 更新用户
router.put('/:id', async function(req, res) {
  try {
    const item = await userService.updateUser(req.params.id, req.body);
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 删除用户
router.delete('/:id', async function(req, res) {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
