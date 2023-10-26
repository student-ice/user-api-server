const query = require('../db');
const jwt = require('jsonwebtoken');
const secretKey = "ice No1 ^_^";

exports.register = async (req, res) => {
  if (!req.body.username || !req.body.password)
    return res.json({ status: 400, msg: '请求参数不合法' });

  const username = req.body.username;
  const password = req.body.password;
  const sqlStr = 'select * from user where username = ?';

  try {
    const results = await query(sqlStr, username);

    if (results.length > 0) {
      return res.json({
        status: 409,
        message: '用户名被占用，请更换其他用户名！',
        data: null,
      });
    }

    const sql = 'insert into user set ?';
    const insertResult = await query(sql, { username, password });

    if (insertResult.affectedRows !== 1) {
      return res.json({
        status: 500,
        message: '注册用户失败，请稍后再试！',
        data: null,
      });
    }

    res.send({
      status: 200,
      message: '注册成功',
      data: {
        userId: insertResult.insertId,
        username: username,
      },
    });
  } catch (err) {
    return res.json({ status: 500, msg: err.message });
  }
};

exports.login = async (req, res) => {
  if (!req.body.username || !req.body.password)
    return res.json({ status: 400, msg: '请求参数不合法' });

  const username = req.body.username;
  const password = req.body.password;
  const sqlStr = 'select * from user where username = ?';

  try {
    const results = await query(sqlStr, username);

    if (results.length === 0) {
      return res.send({
        status: 404,
        message: '登录失败，用户不存在！',
        data: null,
      });
    }

    if (results[0].password !== password) {
      return res.send({
        status: 401,
        message: '登录失败，密码错误！',
        data: null,
      });
    }
    // 生成 token 字符串
    const tokenStr = jwt.sign(
      { username: username, id: results[0].id },
      secretKey,
      { expiresIn: '24h' }
    );

    return res.send({
      status: 200,
      message: '登录成功',
      data: {
        userId: results[0].id,
        username: results[0].username,
        token: tokenStr
      },
    });
  } catch (err) {
    return res.json({ status: 500, msg: err.message });
  }
};

// 登录状态
exports.loginStatus = async (req, res) => {
  // 拿到token解析出来的用户id和用户名,直接返回给客户端
  return res.send({
    status: 200,
    message: '成功',
    data: {
      userId: req.auth.id,
      username: req.auth.username,
    },
  });
}
