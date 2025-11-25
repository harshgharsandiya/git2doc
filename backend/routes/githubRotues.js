import express from 'express'

import {
    fetchRepoMetaData,
    fetchRepoTree,
    generateCustomReadme,
    generateReadme,
} from '../controllers/githubController.js'

const router = express.Router()

router.post('/metadata', fetchRepoMetaData)
router.post('/tree', fetchRepoTree)
router.post('/generate-readme', generateReadme)
router.post('/generate-readme-custom', generateCustomReadme)

export default router
