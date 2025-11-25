/**
 * Extract owner and repo name from github url
 * https://github.com/harshgharsandiya/NextAuth
 * { owner: 'harshgharsandiya', repo: 'NextAuth' }
 */

export function parseGithubUrl(url) {
    try {
        const urlOjb = new URL(url)
        const parts = urlOjb.pathname.split('/').filter(Boolean)

        if (parts.length < 2) return null
        return {
            owner: parts[0],
            repo: parts[1],
        }
    } catch (err) {
        return null
    }
}
