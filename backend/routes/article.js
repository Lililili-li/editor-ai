const express = require('express');
const router = express.Router();
const { result } = require('../utils/results');
const articleService = require('../service/Article')

router.get('/', async function(req, res) {
  try {
    const articles = await articleService.getArticles(req.user)
    res.status(200).json(result('获取成功', 200, articles));
  } catch (error) {
    res.status(400).json(result('获取失败:'+error.message, 400, null))
  }
})

router.post('/', async function(req, res) {
  try {
    const article = await articleService.createArticle(req.user, req.body)
    res.status(200).json(result('创建成功', 200, article));
  } catch (error) {
    res.status(400).json(result('创建失败:'+error.message, 400, null));
  }
})

router.put('/:id', async function(req, res) {
  try {
    
    await articleService.updateArticle(req.body, req.params.id)
    res.status(200).json(result('更新成功', 200, null));
  } catch (error) {
    res.status(400).json(result('更新失败:'+error.message, 400, null));
  }
})



module.exports = router;
