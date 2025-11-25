// lib/fileUtils.ts

export interface TreeNode {
    name: string
    path: string
    type: 'blob' | 'tree' // 'blob' = file, 'tree' = folder
    children?: TreeNode[]
}

/**
 * Converts flat GitHub tree array into a nested structure
 */
export function buildFileTree(flatList: any[]): TreeNode[] {
    const root: TreeNode[] = []
    const map: Record<string, TreeNode> = {}

    // Sort: Folders first, then files (alphabetical)
    const sortedList = [...flatList].sort((a, b) => {
        if (a.type === b.type) return a.path.localeCompare(b.path)
        return a.type === 'tree' ? -1 : 1
    })

    sortedList.forEach((item) => {
        const parts = item.path.split('/') // ['src', 'components', 'Button.tsx']
        let currentLevel = root
        let currentPath = ''

        parts.forEach((part: string, index: number) => {
            currentPath = currentPath ? `${currentPath}/${part}` : part

            // Check if node exists at this level
            let existingNode = currentLevel.find((n) => n.name === part)

            if (!existingNode) {
                const isFile =
                    index === parts.length - 1 && item.type === 'blob'

                const newNode: TreeNode = {
                    name: part,
                    path: currentPath,
                    type: isFile ? 'blob' : 'tree',
                    children: isFile ? undefined : [],
                }

                currentLevel.push(newNode)
                existingNode = newNode
            }

            if (existingNode.type === 'tree') {
                currentLevel = existingNode.children!
            }
        })
    })

    return root
}

/**
 * Get all file paths (blobs) recursively from a node
 */
export function getAllFiles(node: TreeNode): string[] {
    if (node.type === 'blob') return [node.path]
    if (!node.children) return []
    return node.children.flatMap(getAllFiles)
}
