const express = require('express');
const router = express.Router();
const userHandler = require('../router_handler/user');

// 注册 /register 接口,使用 post 请求
router.post('/register', userHandler.register);

// 注册 /login 接口,使用 post 请求
router.post('/login', userHandler.login);

// 注册 /login/status 接口,使用 get 请求
router.get('/login/status', userHandler.loginStatus);

module.exports = router;
