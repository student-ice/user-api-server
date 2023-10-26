const mysql = require('mysql');

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'user_api_server',
});

// 封装一个执行 sql 语句的方法,要返回一个 Promise 对象
// sql 是要执行的 sql 语句,
// params 是 sql 语句中的参数, 是一个对象, 可以为空
let query = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) return reject(err);
      connection.query(sql, params, (err, results) => {
        if (err) return reject(err);
        resolve(results);
        connection.release();
      });
    });
  });
};

module.exports = query;
