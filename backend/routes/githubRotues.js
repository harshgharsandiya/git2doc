import express from 'express'

import {
    fetchRepoMetaData,
    fetchRepoTree,
} from '../controllers/githubController.js'

const router = express.Router()

router.post('/metadata', fetchRepoMetaData)
router.post('/tree', fetchRepoTree)

export default router
