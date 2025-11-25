'use client'

import { useState, useMemo } from 'react'
import {
    FileCode,
    Folder,
    FolderOpen,
    ChevronRight,
    ChevronDown,
    CheckSquare,
    Square,
    MinusSquare, // Optional: for partial selection if you want to add it later
} from 'lucide-react'
import { clsx } from 'clsx'
import { buildFileTree, getAllFiles, TreeNode } from '@/lib/fileUtils'

interface FileExplorerProps {
    files: any[] // Raw flat list from API
    selectedFiles: string[]
    onToggle: (path: string) => void
    onSelectFolder: (paths: string[], select: boolean) => void
}

export default function FileExplorer({
    files,
    selectedFiles,
    onToggle,
    onSelectFolder,
}: FileExplorerProps) {
    // Memoize the tree build so it doesn't recalculate on every click
    const fileTree = useMemo(() => buildFileTree(files), [files])

    return (
        <div className="border border-slate-200 rounded-lg bg-white shadow-sm flex flex-col h-[600px]">
            <div className="p-3 border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
                <span>File Explorer</span>
                <span>{selectedFiles.length} selected</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {fileTree.map((node) => (
                    <FileTreeNode
                        key={node.path}
                        node={node}
                        selectedFiles={selectedFiles}
                        onToggle={onToggle}
                        onSelectFolder={onSelectFolder}
                        depth={0}
                    />
                ))}
            </div>
        </div>
    )
}

// --- Recursive Sub-Component ---

interface TreeNodeProps {
    node: TreeNode
    selectedFiles: string[]
    onToggle: (path: string) => void
    onSelectFolder: (paths: string[], select: boolean) => void
    depth: number
}

function FileTreeNode({
    node,
    selectedFiles,
    onToggle,
    onSelectFolder,
    depth,
}: TreeNodeProps) {
    const [isOpen, setIsOpen] = useState(depth === 0) // Open top level by default

    const isFile = node.type === 'blob'

    // Calculate folder state
    const folderFiles = useMemo(
        () => (isFile ? [] : getAllFiles(node)),
        [node, isFile]
    )
    const allSelected =
        !isFile &&
        folderFiles.length > 0 &&
        folderFiles.every((p) => selectedFiles.includes(p))
    const someSelected =
        !isFile &&
        !allSelected &&
        folderFiles.some((p) => selectedFiles.includes(p))

    const isSelected = isFile ? selectedFiles.includes(node.path) : allSelected

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isFile) {
            onToggle(node.path)
        } else {
            // Toggle Folder Selection
            // If all selected -> Deselect all. Otherwise -> Select all.
            onSelectFolder(folderFiles, !allSelected)
        }
    }

    return (
        <div>
            <div
                className={clsx(
                    'flex items-center gap-2 py-1 px-2 rounded-md cursor-pointer text-sm select-none transition-colors',
                    isSelected
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-slate-50 text-slate-700'
                )}
                style={{ paddingLeft: `${depth * 16 + 8}px` }} // Indentation
                onClick={() => !isFile && setIsOpen(!isOpen)}
            >
                {/* Expand/Collapse Arrow (Folders only) */}
                {!isFile ? (
                    <span className="text-slate-400 hover:text-slate-600">
                        {isOpen ? (
                            <ChevronDown size={14} />
                        ) : (
                            <ChevronRight size={14} />
                        )}
                    </span>
                ) : (
                    <span className="w-3.5" /> // Spacer
                )}

                {/* Checkbox (For both files and folders) */}
                <div onClick={handleToggle} className="z-10">
                    {isSelected ? (
                        <CheckSquare size={16} className="text-blue-600" />
                    ) : someSelected ? (
                        <MinusSquare size={16} className="text-blue-400" /> // Partial state
                    ) : (
                        <Square
                            size={16}
                            className="text-slate-300 hover:text-slate-400"
                        />
                    )}
                </div>

                {/* Icon */}
                {isFile ? (
                    <FileCode size={16} className="text-slate-400" />
                ) : isOpen ? (
                    <FolderOpen size={16} className="text-yellow-500" />
                ) : (
                    <Folder size={16} className="text-yellow-500" />
                )}

                <span className="truncate font-mono">{node.name}</span>
            </div>

            {/* Children (Recursive render) */}
            {!isFile && isOpen && node.children && (
                <div>
                    {node.children.map((child) => (
                        <FileTreeNode
                            key={child.path}
                            node={child}
                            selectedFiles={selectedFiles}
                            onToggle={onToggle}
                            onSelectFolder={onSelectFolder}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
