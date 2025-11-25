/**
 * Extract owner and repo name from github url
 * https://github.com/harshgharsandiya/NextAuth
 * { owner: 'harshgharsandiya', repo: 'NextAuth' }
 */

export function parseGithubUrl(url) {
    try {
        const parts = url.split('github.com/')[1].split('/')
        return {
            owner: parts[0],
            repo: parts[1],
        }
    } catch (err) {
        return null
    }
}
