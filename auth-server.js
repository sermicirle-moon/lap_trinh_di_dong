const express = require('express')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const server = jsonServer.create()
const router = jsonServer.router('authendb.json')
const middlewares = jsonServer.defaults()

const SECRET_KEY = 'your-secret-key-change-in-production'

server.use(middlewares)
server.use(jsonServer.bodyParser)
server.use(express.json())
// Đăng ký
server.post('/register', (req, res) => {
  console.log('📥 Received body:', req.body)
  const { email, password, name } = req.body
  const db = router.db
  const users = db.get('users').value()
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already exists' })
  }
  const hashedPassword = bcrypt.hashSync(password, 8)
  const newUser = { id: Date.now(), email, password: hashedPassword, name }
  db.get('users').push(newUser).write()
  const token = jwt.sign({ id: newUser.id, email }, SECRET_KEY, { expiresIn: '7d' })
  res.json({ accessToken: token, user: { id: newUser.id, email, name } })
})

// Đăng nhập
server.post('/login', (req, res) => {
  const { email, password } = req.body
  const db = router.db
  const user = db.get('users').find({ email }).value()
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  const token = jwt.sign({ id: user.id, email }, SECRET_KEY, { expiresIn: '7d' })
  res.json({ accessToken: token, user: { id: user.id, email, name: user.name } })
})

// Middleware xác thực cho các route khác (trừ login/register)
server.use(/^(?!\/login|\/register).*$/, (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'No token provided' })
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
})

// Tự động thêm userId vào body khi POST
server.use(/^(?!\/login|\/register).*$/, (req, res, next) => {
  if (req.method === 'POST' && req.user?.id) {
    req.body.userId = req.user.id
  }
  next()
})

// Lọc dữ liệu GET theo userId
router.render = (req, res) => {
  const userId = req.user?.id
  let data = res.locals.data
  if (userId && req.method === 'GET') {
    if (Array.isArray(data)) {
      data = data.filter(item => item.userId === userId)
    } else if (data && data.userId !== undefined && data.userId !== userId) {
      data = {}
    }
  }
  res.json(data)
}

server.use(router)
server.listen(3000, () => {
  console.log('Auth server running on port 3000')
})