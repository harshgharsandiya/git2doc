import axios from 'axios'

const github_api_url = 'https://api.github.com/repos'

const TARGET_FILES = [
    'yarn.lock', // Node
    'requirements.txt',
    'Pipfile',
    'pyproject.toml', // Python
    'Cargo.toml', // Rust
    'go.mod', // Go
    'composer.json', // PHP
    'Gemfile', // Ruby
    'pom.xml',
    'build.gradle', // Java
    'Dockerfile',
    'docker-compose.yml', // DevOps
    'Makefile',
    'next.config.js',
    'vite.config.js',
    'webpack.config.js', // Web Configs
]

const ENTRY_POINTS = [
    'index.js',
    'server.js',
    'app.js',
    'main.py',
    'app.py',
    'index.html',
]

const ENTRY_FOLDERS = [
    '', // root
    'backend/',
    'frontend/',
    'src/',
    'apps/',
    'packages/',
    'server/',
    'client/',
]

const IGNORE_FILES = [
    'package.json',
    'README.md',
    'LICENSE',
    '.env',
    '.gitignore',
    '.dockerignore',
    'package-lock.json',
]

const IGNORE_FOLDERS = [
    'node_modules/',
    'backend/node_modules/',
    'frontend/node_modules/',

    '.next/',
    'dist/',
    'build/',
    'out/',
    'coverage/',
    'logs/',
    'tmp/',
    'cache/',
    '.cache/',

    '.git/',
    '.github/',
    '.vscode/',
    '.idea/',
]

const IGNORE_EXTENSIONS = [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.pdf',
    '.zip',
    '.rar',
    '.exe',
    '.dll',
    '.map', // sourcemaps
    '.lock', // lock files
]

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const getHeaders = () => ({
    'User-Agent': 'git2doc',
    Authorization: `token ${GITHUB_TOKEN}`,
})

/**
 * Fetch metadata of github repository
 * @params {string} owner, repo
 */
export async function getRepoMetaData(owner, repo) {
    const url = `${github_api_url}/${owner}/${repo}`

    try {
        const res = await axios.get(url, {
            headers: getHeaders(),
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
            headers: getHeaders(),
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

/**
 * Fetch content of specific important files from the tree.
 * Filters the tree for config/entry files, fetches them, and decodes Base64.
 * @params {string} owner, repo
 * @params {Array} tree
 */
export async function getImportantFileContents(owner, repo, tree) {
    const importantFiles = tree.filter((item) => {
        if (item.type !== 'blob') return false

        const fileName = item.path.split('/').pop()

        //1. IGNORE garbage folders
        if (IGNORE_FOLDERS.some((dir) => item.path.startsWith(dir)))
            return false

        //2. IGNORE specific files
        if (IGNORE_FILES.includes(fileName)) return false

        // 3. IGNORE file extensions
        if (IGNORE_EXTENSIONS.some((ext) => fileName.endsWith(ext)))
            return false

        // 4. TARGET important files anywhere
        const isTarget = TARGET_FILES.includes(fileName)

        //5. ENTRY POINTS inside allowed folders
        const isEntryPoint =
            ENTRY_POINTS.includes(fileName) &&
            ENTRY_FOLDERS.some((prefix) => item.path.startsWith(prefix))

        return isTarget || isEntryPoint
    })

    // prevent token overflow
    const limitedFiles = importantFiles.slice(0, 8)

    // create promise for each file fetch
    const fetchPromise = limitedFiles.map(async (file) => {
        const url = `${github_api_url}/${owner}/${repo}/contents/${file.path}`

        try {
            const res = await axios.get(url, {
                headers: getHeaders(),
            })

            const content = Buffer.from(res.data.content, 'base64').toString(
                'utf-8'
            )

            return {
                path: file.path,
                content,
            }
        } catch (err) {
            console.warn(`Failed to fetch content for ${file.path}`)
            return null
        }
    })

    //Execute all requests in parallel
    const results = await Promise.all(fetchPromise)

    return results.filter((r) => r !== null)
}
