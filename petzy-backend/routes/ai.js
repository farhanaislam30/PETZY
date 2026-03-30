import express from 'express'
const airoute = express.Router()
import { GenAi } from '../controllers/aicontroller.js'

airoute.post('/aicall', GenAi)

export default airoute
