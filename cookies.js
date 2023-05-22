const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const {expressjwt} = require('express-jwt')

const app = express()
const port = 3000

app.use(cookieParser())
app.use(express.static('public'))
app.use(express.json)

const secret = 'havinfun'
const users = [{
  username: 'ytreyer',
  password: 'fdsafasd'
}]
const auth = expressjwt({secret: secret, algorithms: ["HS256"]})

app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`)
  res.cookie('allrequest', 'receiveEverything')
  next()
})

app.post('/login', (res, req) => {
  const {username, password} = req.body
  const user = users.find(currentUser => currentUser.username === username)
  if(!user || user.password !== password) {
    return res.status(401).json({errorMessage: "Invalid Password"})
  }
  
  const token = jwt.sign({username: user.username}, secret, {
    algorithms: ['HS256'], 
    expiresIn: 10000
  })

  return res.json({token: token})
})

app.get('/protectedRoute', auth, (req, res) => {
  console.log(req.auth.username);

})

app.use(session({
  secret: 'super secret fun string',
  resave: false,
  saveUninitialized: false,
  cookie: {httpOnly: true, maxAge: 10000}
}))

app.get('/', (req, res) => {
  res.cookie('mycookie', 'myvalue', {httpOnly: true})
  res.cookie('anothercookie', 'fjsaldkjfasl', {httpOnly: true})
  console.log(res.getHeaders())
  console.group(req.cookies)
  res.send("Hello World")
})

app.get('/views', (req, res) => {
  if(req.session.views) {
      req.session.views++
      res.write(`Views: ${req.session.views}\n`)
      res.write(`Expires: ${req.session.cookie.maxAge}`)
      res.end()
  }
  else {
    req.session.views = 1;
    res.end("Welcome to the session demo, refresh")
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})