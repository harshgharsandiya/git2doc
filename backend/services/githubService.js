import axios from 'axios'

const github_api_url = 'https://api.github.com/repos'

/**
 * Fetch metadata of github repository
 * @params {string} owner, repo
 */
export async function getRepoMetaData(owner, repo) {
    const url = `${github_api_url}/${owner}/${repo}`

    try {
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'git2doc',
            },
        })

        return {
            name: res.data.name,
            full_name: res.data.full_name,
            description: res.data.description,
            forks: res.data.forks,
            default_branch: res.data.default_branch,
            updated_at: res.data.updated_at,
            license: res.data.license?.name || 'No license',
            owner: {
                username: res.data.owner.login,
                avatar: res.data.owner.avatar_url,
                url: res.data.owner.html_url,
            },
        }
    } catch (err) {
        throw new Error('Failed to fetch github repository metadata')
    }
}

/**
 * Fetch full repository file tree (recursive)
 * @params {string} owner, repo, branch
 */
export async function getRepoTree(owner, repo, branch = 'main') {
    const url = `${github_api_url}/${owner}/${repo}/git/trees/${branch}?recursive=1`

    try {
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'git2doc' },
        })

        return res.data.tree.map((item) => ({
            path: item.path,
            type: item.type, // "tree" = folder, "blob" = file
        }))
    } catch (err) {
        console.log(err.response?.data)
        throw new Error('Failed to fetch repository file tree')
    }
}
