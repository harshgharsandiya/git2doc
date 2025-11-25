import Groq from 'groq-sdk'

import {
    generateReadmePrompt,
    generateCustomReadmePrompt,
} from '../prompts/generateReadme.js'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// callLLM helper
async function callLLM(prompt) {
    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a Senior Developer and Technical Writer. You excel at inferring project functionality from file structures and metadata.',
                },
                { role: 'user', content: prompt },
            ],
            max_tokens: 3000,
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
