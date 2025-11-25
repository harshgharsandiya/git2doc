'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import FileExplorer from '@/components/FileExplorer'
import ReadmePreview from '@/components/ReadmePreview'
import { Github, Loader2, ArrowRight } from 'lucide-react'

export default function Home() {
    // --- State ---
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Data
    const [tree, setTree] = useState<any[]>([])
    const [metadata, setMetadata] = useState<any>(null)
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const [readme, setReadme] = useState('')

    // --- Handlers ---

    // Step 1: Analyze Repo
    const handleAnalyze = async () => {
        if (!url) return
        setLoading(true)
        setError('')

        try {
            // Parallel fetch for speed
            const [metaRes, treeRes] = await Promise.all([
                api.getMetadata(url),
                api.getTree(url),
            ])

            setMetadata(metaRes.data)
            setTree(treeRes.tree)
            setStep(2)
        } catch (err: any) {
            setError(
                err.response?.data?.error || 'Failed to analyze repository'
            )
        } finally {
            setLoading(false)
        }
    }

    // Step 2: Toggle File Selection
    const toggleFile = (path: string) => {
        setSelectedFiles((prev) =>
            prev.includes(path)
                ? prev.filter((p) => p !== path)
                : [...prev, path]
        )
    }

    const handleSelectFolder = (paths: string[], shouldSelect: boolean) => {
        setSelectedFiles((prev) => {
            if (shouldSelect) {
                // Add all folder paths, avoid duplicates
                const unique = new Set([...prev, ...paths])
                return Array.from(unique)
            } else {
                // Remove all folder paths
                return prev.filter((p) => !paths.includes(p))
            }
        })
    }

    // Step 3: Generate Readme
    const handleGenerate = async () => {
        if (selectedFiles.length === 0) {
            setError('Please select at least one file')
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await api.generateCustomReadme(url, selectedFiles)
            setReadme(res.readme)
            setStep(3)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to generate README')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                <div className="bg-black text-white p-1 rounded">
                    <Github size={20} />
                </div>
                <h1 className="font-bold text-lg tracking-tight">Git2Doc</h1>
            </nav>

            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                        🚨 {error}
                    </div>
                )}

                {/* STEP 1: Input */}
                {step === 1 && (
                    <div className="max-w-xl mx-auto text-center space-y-6">
                        <h2 className="text-3xl font-bold">
                            Turn Code into Documentation
                        </h2>
                        <p className="text-slate-500">
                            Paste a GitHub repository URL to get started.
                        </p>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://github.com/owner/repo"
                                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    'Analyze'
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Selection */}
                {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Sidebar info */}
                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-lg border shadow-sm">
                                <h3 className="font-bold text-lg">
                                    {metadata?.name}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    {metadata?.description}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                                        ⭐ {metadata?.forks} forks
                                    </span>
                                    <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                                        Default: {metadata?.default_branch}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                                <strong>Tip:</strong> Select important files
                                like package.json, main entry points, and routes
                                for the best result.
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={loading || selectedFiles.length === 0}
                                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>
                                        Generate Docs <ArrowRight size={16} />
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setStep(1)}
                                className="w-full text-sm text-slate-500 hover:text-black"
                            >
                                Change Repository
                            </button>
                        </div>

                        {/* File Tree */}
                        <div className="md:col-span-2">
                            <h3 className="font-bold mb-3">
                                Select Files to Analyze
                            </h3>
                            <FileExplorer
                                files={tree}
                                selectedFiles={selectedFiles}
                                onToggle={toggleFile}
                                onSelectFolder={handleSelectFolder}
                            />
                        </div>
                    </div>
                )}

                {/* STEP 3: Result */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">
                                Generated README
                            </h2>
                            <button
                                onClick={() => setStep(2)}
                                className="text-sm text-slate-500 hover:underline"
                            >
                                Back to file selection
                            </button>
                        </div>

                        <ReadmePreview content={readme} />
                    </div>
                )}
            </div>
        </main>
    )
}
