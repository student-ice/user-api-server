const express = require('express');
const router = express.Router();
const userHandler = require('../router_handler/user');

// 注册 /register 接口
router.get('/register', userHandler.register);

// 注册 /login 接口
router.get('/login', userHandler.login);

module.exports = router;
