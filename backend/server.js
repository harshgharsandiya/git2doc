import './config/env.js'

import express from 'express'
import cors from 'cors'
import githubRoutes from './routes/githubRotues.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.end('git2doc backend running...')
})

app.use('/api/github', githubRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
