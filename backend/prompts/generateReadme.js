export function generateReadmePrompt(metadata, tree) {
    //metadata
    const compactMetadata = {
        name: metadata.name,
        description: metadata.description || 'No description provided.',
        language: metadata.language,
    }

    //tree
    const compactTree = tree
        .slice(0, 300)
        .map((item) => `${item.type === 'tree' ? '📂' : '📄'} ${item.path}`)
        .join('\n')

    //important file content
    const importantFiles = tree
        .filter((item) => item.content)
        .map((item) => {
            const safeContent =
                item.content.length > 5000
                    ? item.content.substring(0, 5000) +
                      '\n...[Content Truncated]'
                    : item.content
            return `### File: ${item.path}\n\`\`\`\n${safeContent}\n\`\`\``
        })
        .join('\n\n')

    return `
    You are generating a production-quality README.md for the project "${
        metadata.name
    }".

    ### Repository Metadata
    ${JSON.stringify(compactMetadata, null, 2)}

    ### File Structure (Top 300 files)
    ${compactTree}

    ### Critical File Contents
    ${importantFiles}

   ### Instructions:
    1. **Overview**: Summarize what the project does based on the file contents.
    2. **Features**: List key technical features (e.g., "Authentication via NextAuth", "Database schema with Prisma").
    3. **Installation**: Provide strictly **shell commands** (e.g., \`npm install\`, \`npm run dev\`). **DO NOT** provide instructions to create files or copy-paste code.
    4. **Tech Stack**: List frameworks and libraries used.
    
    ### Constraints:
    - **NO** code blocks containing full source files.
    - **NO** "Step 1: Create file..." tutorials. 
    - Output raw Markdown only.
    `
}

export function generateCustomReadmePrompt(metadata, tree) {
    const filesContext = tree.map((f) => ({
        path: f.path,
        content: f.content ? f.content.substring(0, 8000) : 'No content',
    }))

    return `
    You are a Senior Developer. Write a documentation README for this existing repository.
    
    ### Goal
    Document the **features and usage** of the selected files. Do NOT write a tutorial on how to recreate the files.

    ### Metadata
    ${JSON.stringify(metadata, null, 2)}

    ### Source Code Context
    ${JSON.stringify(filesContext, null, 2)}

    ### Instructions:
    1. **Project Title**: ${metadata.name}
    2. **Description**: Analyze the code logic to write a professional summary.
    3. **Key Features**: Bullet points describing what the code *does* (e.g., "Implements RBAC", "Handles JWT sessions").
    4. **Logic Flow**: Briefly explain the architecture based on the file paths and content.
    5. **Environment**: Mention necessary environment variables (inferred from code like \`process.env.X\`).
    6. **Installation**: Standard \`npm install\` and run commands only.

    ### CRITICAL RULES:
    - **NEVER** copy the source code back into the README.
    - **NEVER** write steps like "Step 1: Create auth.ts".
    - The README is for a user *downloading* the repo, not building it.
    - Output raw Markdown only.
    `
}
