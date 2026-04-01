import express from 'express'
const airoute = express.Router()
import { GenAi, aiRateLimiter } from '../controllers/aicontroller.js'

// Apply rate limiter to the AI route - 100 requests per minute
// airoute.post('/aicall', aiRateLimiter, GenAi)

// Temporarily removed rate limiter to debug 429 errors from Google API
airoute.post('/aicall', GenAi)

export default airoute
