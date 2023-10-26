const db = require('../db');

exports.register = (req, res) => {
  // 打印请求携带的参数
  const username = req.query.username;
  const password = req.query.password;
  console.log(req.query);
  // 定义 SQL 语句, 查询用户名是否存在
  const sqlStr = 'select * from user where username = ?';
  db.query(sqlStr, username, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.json({ status: 500, msg: err.message });
    // 判断用户名是否被占用
    if (results.length > 0)
      return res.json({
        status: 409,
        message: '用户名被占用，请更换其他用户名！',
        data: null,
      });
    // 用户名可用，继续注册流程
    // 定义插入新用户的 SQL 语句, 需要同时插入用户名和密码

    const sql = 'insert into user set ?';
    // 不对密码加密，直接把明文密码存入数据库
    db.query(sql, { username, password }, (err, results) => {
      // 执行 SQL 语句失败
      if (err) return res.json({ status: 500, msg: err.message });
      // SQL 语句执行成功，但影响行数不为 1
      if (results.affectedRows !== 1)
        return res.json({
          status: 500,
          message: '注册用户失败，请稍后再试！',
          data: null,
        });
      // 注册成功
      res.json({
        status: 200,
        message: '注册成功',
        data: {
          userId: results.insertId,
          username: username,
        },
      });
    });
  });
};

exports.login = (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  // 首先根据用户名查询用户是否存在
  // 定义 SQL 语句
  const sqlStr = 'select * from user where username = ?';
  // 执行 SQL 语句查询对应用户
  db.query(sqlStr, username, (err, results) => {
    if (err) return res.json({ status: 500, msg: err.message });
    // 判断结果是否为空
    if (results.length === 0)
      return res.json({
        status: 404,
        message: '登录失败，用户不存在！',
        data: null,
      });
    // 用户存在，继续判断密码是否正确
    if (results[0].password !== password)
      return res.json({
        status: 401,
        message: '登录失败，密码错误！',
        data: null,
      });
    // 用户存在且密码正确
    return res.json({
      status: 200,
      message: '登录成功',
      data: {
        userId: results[0].id,
        username: results[0].username,
      },
    });
  });
};
