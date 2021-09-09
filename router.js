import express from 'express'
export const router = express.Router()
import { PORT } from './server.js'

router.get('/', (req, res) => {
  res.send(`Server is up and running on ${PORT}`)
})
