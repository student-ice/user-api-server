const express = require('express');
const userRouter = require('./router/user');
const expressJWT = require('express-jwt');
const cors = require('cors');
const app = express();
const port = 4980;
const secretKey = 'ice No1 ^_^';

// 配置 cors 中间件, 解决跨域问题
app.use(cors());

// 配置解析表单数据的中间件
app.use(require('body-parser').urlencoded({ extended: false }));

app.use(
  expressJWT
    .expressjwt({ secret: secretKey, algorithms: ['HS256'] })
    .unless({ path: [/^(?!\/user\/login\/status$).*$/] })
);

app.get('/', (req, res) => {
  // 访问 http://localhost:4980/ 时, 显示static文件夹下的index.html
  res.sendFile(__dirname + '/static/index.html');
});

// 注册路由模块
app.use('/user', userRouter);

// 配置一个处理 404 的中间件
app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + '/static/404.html');
});

app.use((err, req, res, next) => {
  // 这次错误是由 token 解析失败导致的
  if (err.name === 'UnauthorizedError') {
    return res.send({
      status: 401,
      message: '无效的token',
    });
  }
});

app.listen(port, () => {
  console.log(`server runs on http://localhost:${port}`);
});
