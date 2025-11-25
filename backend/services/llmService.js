import Groq from 'groq-sdk'

import { generateReadmePrompt } from '../prompts/generateReadme.js'
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

/**
 * Generate README.md using Groq LLM
 * @params {Object} metadata
 * @params {Array} tree
 */
export async function generateReadme(metadata, tree) {
    const prompt = generateReadmePrompt(metadata, tree)

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
            max_tokens: 2048,
            temperature: 0.2,
        })

        return completion.choices[0].message.content
    } catch (err) {
        console.log(err)
        throw new Error('LLM failed to generate README')
    }
}
