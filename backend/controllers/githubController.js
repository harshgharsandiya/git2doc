import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { parseGithubUrl } from '../utils/parseGithubUrl.js'
import {
    getRepoMetaData,
    getRepoTree,
    getImportantFileContents,
} from '../services/githubService.js'
import { generateReadme as generateReadmeLLM } from '../services/llmService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * fetch repository metadata
 * @route /api/github/metadata
 */
export async function fetchRepoMetaData(req, res) {
    const { url } = req.body
    if (!url) {
        res.status(400).json({
            error: 'github url is required',
        })
    }

    const parsed = parseGithubUrl(url)
    if (!parsed) {
        return res.status(400).json({
            error: 'Invalid github url format',
        })
    }

    try {
        const metadata = await getRepoMetaData(parsed.owner, parsed.repo)
        return res.json({
            success: true,
            data: metadata,
        })
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        })
    }
}

/**
 * fetch repository file structure (tree)
 * @route /api/github/tree
 */
export async function fetchRepoTree(req, res) {
    const { url } = req.body
    if (!url) {
        res.status(400).json({
            error: 'github url is required',
        })
    }

    const parsed = parseGithubUrl(url)
    if (!parsed) {
        return res.status(400).json({
            error: 'Invalid github url format',
        })
    }

    try {
        const tree = await getRepoTree(parsed.owner, parsed.repo)
        return res.json({ success: true, tree })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

/**
 * Generate README using metadata + file tree + LLM
 * @route /api/github/generate-readme
 */
export async function generateReadme(req, res) {
    const { url } = req.body
    if (!url) {
        res.status(400).json({
            error: 'github url is required',
        })
    }

    const parsed = parseGithubUrl(url)
    if (!parsed) {
        return res.status(400).json({
            error: 'Invalid github url format',
        })
    }

    const owner = parsed.owner
    const repo = parsed.repo

    try {
        const metadata = await getRepoMetaData(owner, repo)

        const tree = await getRepoTree(owner, repo)

        const importantFiles = await getImportantFileContents(owner, repo, tree)

        const updatedTree = tree.map((item) => {
            const foundFile = importantFiles.find((f) => f.path === item.path)

            return foundFile ? { ...item, content: foundFile.content } : item
        })

        const readmeContent = await generateReadmeLLM(metadata, updatedTree)

        const generatedDir = path.join(__dirname, '../generated')
        if (!fs.existsSync(generatedDir)) {
            fs.mkdirSync(generatedDir, { recursive: true })
        }

        const fileName = `${metadata.name}_README_${Date.now()}.md`
        const filePath = path.join(__dirname, '../generated', fileName)
        fs.writeFileSync(filePath, readmeContent, 'utf-8')

        return res.json({
            success: true,
            readme: readmeContent,
            metadata,
            tree: tree.slice(0, 50),
        })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}
