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

const MAX_FILES = 20

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
        const { data } = await axios.get(url, {
            headers: getHeaders(),
        })

        return {
            name: data.name,
            full_name: data.full_name,
            description: data.description,
            forks: data.forks,
            default_branch: data.default_branch,
            updated_at: data.updated_at,
            license: data.license?.name || 'No license',
            owner: {
                username: data.owner.login,
                avatar: data.owner.avatar_url,
                url: data.owner.html_url,
            },
        }
    } catch (err) {
        throw new Error(
            `GitHub Metadata Error: ${err.response?.statusText || err.message}`
        )
    }
}

/**
 * Fetch full repository file tree (recursive)
 * @params {string} owner, repo, branch
 */
export async function getRepoTree(owner, repo, branch = 'main') {
    const url = `${github_api_url}/${owner}/${repo}/git/trees/${branch}?recursive=1`

    try {
        const { data } = await axios.get(url, {
            headers: getHeaders(),
        })

        return data.tree.map((item) => ({
            path: item.path,
            type: item.type, // "tree" = folder, "blob" = file
        }))
    } catch (err) {
        // Fallback: If branch 'main' fails, try to fetch default branch from metadata logic via caller
        throw new Error(
            `GitHub Tree Error: ${err.response?.statusText || err.message}`
        )
    }
}

/**
 * Fetch content of important files from the tree.
 * Filters the tree for config/entry files, fetches them, and decodes Base64.
 * @params {string} owner, repo
 * @params {Array} tree
 */
export async function getImportantFileContents(owner, repo, tree) {
    const importantFiles = tree
        .filter((item) => {
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
        .slice(0, 10)

    return fetchFilesParallel(owner, repo, importantFiles)
}

/**
 * Fetch content of specific file content for specific list
 * @params {string} owner, repo
 * @params {Array<string>} filePaths - Array of strings ['src/index.js', 'package.json']
 */
export async function getSpecificFilesContent(owner, repo, tree, filePaths) {
    const treePaths = new Set(tree.map((item) => item.path))
    const validPaths = filePaths
        .filter((path) => treePaths.has(path))
        .slice(0, MAX_FILES)

    const fileObjects = validPaths.map((path) => ({ path }))
    return fetchFilesParallel(owner, repo, fileObjects)
}

async function fetchFilesParallel(owner, repo, files) {
    const promises = files.map(async (file) => {
        try {
            const { data } = await axios.get(
                `${github_api_url}/${owner}/${repo}/contents/${file.path}`,
                {
                    headers: getHeaders(),
                }
            )
            const content = Buffer.from(data.content, 'base64').toString(
                'utf-8'
            )
            return { path: file.path, content }
        } catch (err) {
            console.warn(`Failed to fetch ${file.path}: ${err.message}`)
            return null
        }
    })

    const results = await Promise.all(promises)
    return results.filter((r) => r !== null)
}
