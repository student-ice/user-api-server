const express = require('express');
const userRouter = require('./router/user');
const cors = require('cors');
const app = express();
const port = 4980;

// 配置 cors 中间件, 解决跨域问题
app.use(cors());

app.get('/', (req, res) => {
  // 访问 http://localhost:4980/ 时, 显示static文件夹下的index.html
  res.sendFile(__dirname + '/static/index.html');
});
// 注册路由模块
app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`server runs on http://localhost:${port}`);
});
