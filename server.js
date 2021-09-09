import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
import { router } from './router.js'

const app = express()
app.use(router)
const server = http.createServer(app)
const corsOptions = {
  cors: true,
  origins: ['http://localhost:3000'],
}
const io = new Server(server, corsOptions)

const PORT = process.env.PORT || 5000

app.use(router)

io.on('connect', (socket) => {
  const id = socket.handshake.query.id
  socket.join(id)

  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach((recipient) => {
      //in order to prevent the sender receive the message as recipient
      const newRecipients = recipients.filter((r) => r !== recipient)
      newRecipients.push(id)
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients,
        sender: id,
        text,
      })
    })
  })
})

server.listen(PORT, () => console.log(`Server is running on the port ${PORT}`))
