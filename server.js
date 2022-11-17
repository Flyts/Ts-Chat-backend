const http = require('http')
const app = require('./app')
const {Server} = require("socket.io")
const { join_or_create_conversation } = require('./socketControllers/conversationSocket')
const { send_message } = require('./socketControllers/messageSocket')

function normalizePort(val) 
{
  const port = parseInt(val, 10)

  if(isNaN(port)) 
  {
    return val
  }
  if (port >= 0) 
  {
    return port
  }

  return false
}

const port = normalizePort(process.env.PORT || '5000')
app.set('port', port)

function errorHandler(error)
{
  if(error.syscall !== 'listen') 
  {
    throw error
  }

  const address = server.address()
  const bind    = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
  switch (error.code) 
  {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.')
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.')
      process.exit(1)
      break;
    default:
      throw error
  }
}

const server = http.createServer(app)

server.on('error', errorHandler)
server.on('listening', () => 
{
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
  console.log('Listening on ' + bind)
})


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) =>
{
  join_or_create_conversation(socket)
  send_message(socket)
})


server.listen(port)
