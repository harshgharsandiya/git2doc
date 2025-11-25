import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import {
    getRepoMetaData,
    getRepoTree,
    getImportantFileContents,
    getSpecificFilesContent,
} from '../services/githubService.js'
import {
    generateReadme as generateReadmeLLM,
    generateCustomReadme as generateCustomReadmeLLM,
} from '../services/llmService.js'
import { validateUrl } from '../utils/validateUrl.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * fetch repository metadata
 * @route /api/github/metadata
 */
export async function fetchRepoMetaData(req, res) {
    const parsed = validateUrl(req.body.url, res)
    if (!parsed) return

    try {
        const metadata = await getRepoMetaData(parsed.owner, parsed.repo)
        return res.json({ success: true, data: metadata })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

/**
 * fetch repository file structure (tree)
 * @route /api/github/tree
 */
export async function fetchRepoTree(req, res) {
    const parsed = validateUrl(req.body.url, res)
    if (!parsed) return

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
    const parsed = validateUrl(req.body.url, res)
    if (!parsed) return
    const { owner, repo } = parsed

    try {
        const [metadata, tree] = await Promise.all([
            getRepoMetaData(owner, repo),
            getRepoTree(owner, repo),
        ])

        const importantFiles = await getImportantFileContents(owner, repo, tree)

        const updatedTree = tree.map((item) => {
            const foundFile = importantFiles.find((f) => f.path === item.path)
            return foundFile ? { ...item, content: foundFile.content } : item
        })

        const readmeContent = await generateReadmeLLM(metadata, updatedTree)

        //Log README
        const saveFileTask = (async () => {
            const generatedDir = path.join(__dirname, '../generated')
            try {
                await fs.mkdir(generatedDir, { recursive: true })
                const fileName = `${metadata.name}_README_${Date.now()}.md`
                await fs.writeFile(
                    path.join(generatedDir, fileName),
                    readmeContent,
                    'utf-8'
                )
            } catch (ioErr) {
                console.error('Failed to save generated README:', ioErr)
            }
        })()

        return res.json({
            success: true,
            readme: readmeContent,
            metadata,
            tree: tree.slice(0, 50),
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
}

/**
 * Generate README based on User Selected Files
 * @route /api/github/generate-readme-custom
 */
export async function generateCustomReadme(req, res) {
    const { url, selectedFiles } = req.body

    const parsed = validateUrl(url, res)
    if (!parsed) return
    if (!selectedFiles?.length)
        return res.status(400).json({ error: 'Select at least one file.' })

    const { owner, repo } = parsed

    try {
        const [metadata, tree] = await Promise.all([
            getRepoMetaData(owner, repo),
            getRepoTree(owner, repo),
        ])

        const fileContents = await getSpecificFilesContent(
            owner,
            repo,
            tree,
            selectedFiles
        )

        if (!fileContents.length) {
            return res
                .status(400)
                .json({ error: 'Could not fetch content for selected files.' })
        }

        const treeContext = fileContents.map((f) => ({
            path: f.path,
            content: f.content,
            type: 'blob',
        }))
        const readmeContent = await generateCustomReadmeLLM(
            metadata,
            treeContext
        )

        //Log README
        const saveFileTask = (async () => {
            const generatedDir = path.join(__dirname, '../generated')
            try {
                await fs.mkdir(generatedDir, { recursive: true })
                const fileName = `${metadata.name}_README_${Date.now()}.md`
                await fs.writeFile(
                    path.join(generatedDir, fileName),
                    readmeContent,
                    'utf-8'
                )
            } catch (ioErr) {
                console.error('Failed to save generated README:', ioErr)
            }
        })()

        return res.json({
            success: true,
            readme: readmeContent,
            metadata,
            usedFiles: selectedFiles,
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
}
