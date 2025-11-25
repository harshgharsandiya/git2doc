import Groq from 'groq-sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

import {
    generateReadmePrompt,
    generateCustomReadmePrompt,
} from '../prompts/generateReadme.js'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const googleModel = genAI.getGenerativeModel({
    model: 'gemini-flash-latest',
})

// callLLM helper
async function callLLM(prompt) {
    const provider = process.env.LLM_PROVIDER || 'groq'
    try {
        if (provider === 'gemini') {
            // --- GOOGLE GEMINI CALL ---
            const fullPrompt = `You are a Senior Developer. Return only raw Markdown.\n\n${prompt}`

            const result = await googleModel.generateContent({
                systemInstruction: {
                    role: 'system',
                    parts: [
                        {
                            text: 'You are a Senior Developer. Return only raw Markdown.',
                        },
                    ],
                },
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: prompt }],
                    },
                ],
                generationConfig: {
                    maxOutputTokens: 10000,
                    temperature: 0.2,
                },
            })
            return result.response.text()
        }

        // --- GROQ CALL ---
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a Senior Developer. Return only raw Markdown.',
                },
                { role: 'user', content: prompt },
            ],
            max_tokens: 8000,
            temperature: 0.2,
        })
        return completion.choices[0].message.content
    } catch (err) {
        console.error('LLM Service Error:', err)
        throw new Error('LLM failed to generate content')
    }
}

/**
 * Generate README.md using Groq LLM
 * @params {Object} metadata
 * @params {Array} tree
 */
export async function generateReadme(metadata, tree) {
    const prompt = generateReadmePrompt(metadata, tree)
    return await callLLM(prompt)
}

export async function generateCustomReadme(metadata, tree) {
    const prompt = generateCustomReadmePrompt(metadata, tree)
    return await callLLM(prompt)
}
