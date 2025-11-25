import { parseGithubUrl } from '../utils/parseGithubUrl.js'
import { getRepoMetaData, getRepoTree } from '../services/githubService.js'

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
