import { parseGithubUrl } from '../utils/parseGithubUrl.js'

export const validateUrl = (url, res) => {
    if (!url) {
        res.status(400).json({ error: 'GitHub URL is required' })
        return null
    }
    const parsed = parseGithubUrl(url)
    if (!parsed) {
        res.status(400).json({ error: 'Invalid GitHub URL format' })
        return null
    }
    return parsed
}
