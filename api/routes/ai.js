import express from 'express'
const airoute = express.Router()
import { GenAi, aiRateLimiter } from '../controllers/aicontroller.js'

// Apply rate limiter to the AI route - 10 requests per minute
airoute.post('/aicall', aiRateLimiter, GenAi)

export default airoute
