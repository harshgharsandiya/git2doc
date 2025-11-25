import express from 'express'

import {
    fetchRepoMetaData,
    fetchRepoTree,
    generateReadme,
} from '../controllers/githubController.js'

const router = express.Router()

router.post('/metadata', fetchRepoMetaData)
router.post('/tree', fetchRepoTree)
router.post('/generate-readme', generateReadme)

export default router
