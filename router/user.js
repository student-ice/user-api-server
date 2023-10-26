const express = require('express');
const router = express.Router();
const userHandler = require('../router_handler/user');

// 注册 /register 接口,使用 post 请求
router.post('/register', userHandler.register);

// 注册 /login 接口,使用 post 请求
router.post('/login', userHandler.login);

module.exports = router;
