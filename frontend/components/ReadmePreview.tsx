'use client'

import ReactMarkdown from 'react-markdown'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function ReadmePreview({ content }: { content: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="relative border rounded-lg bg-white shadow-sm">
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-md hover:bg-slate-700 transition-colors"
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy Markdown'}
                </button>
            </div>

            <div className="prose prose-slate max-w-none p-8 overflow-auto max-h-[700px]">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </div>
    )
}
