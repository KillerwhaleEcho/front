const express = require('express');
const app = express();
const port = 5173;

app.use(express.json());

// 一个简单的 GET 请求 API 示例：获取所有用户
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ];
  res.json(users);  // 返回 JSON 格式的用户列表
});

// 一个简单的 POST 请求 API 示例：创建新用户
app.post('/api/users', (req, res) => {
  const { name } = req.body;  // 从请求体中提取数据
  const newUser = { id: Date.now(), name };
  res.status(201).json(newUser);  // 返回新创建的用户
});


// 启动服务器
app.listen(port, () => {
    console.log(`API server is running at http://192.168.142.166:${port}`);
  });