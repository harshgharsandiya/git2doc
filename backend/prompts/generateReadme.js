export function generateReadmePrompt(metadata, tree) {
    //metadata
    const compactMetadata = {
        name: metadata.name,
        description: metadata.description || 'No description provided.',
        default_branch: metadata.default_branch,
    }

    //tree
    const compactTree = tree
        .map(
            (item) =>
                `${item.type === 'tree' ? 'folder' : 'file'}: ${item.path}`
        )
        .join('\n')

    //important file content
    const importantFiles = tree
        .filter((item) => item.content)
        .map((item) => `${item.path} : ${item.content} `)
        .join('\n')

    return `
    You are generating a production-quality README.md. 
    Use the metadata, folder structure, and important file contents to infer the project's stack and functionality.

    ### Repository Metadata
    ${JSON.stringify(compactMetadata, null, 2)}

    ## File Structure 
    ${compactTree}

    ## Important File Contents
    ${importantFiles}

    ## Instructions:
    1. Identify the project type & stack from file contents and file structure.
    2. Infer routing, architecture, framework, and folder roles.
    3. If description missing — infer description from important files.
    4. Produce clean Markdown — without code block wrappers.

    ## README Output Sections:
    - Title
    - Description
    - Tech Stack
    - Installation
    - Usage
    - Features
    - Folder Structure
    - License

    Generate the README now:

    `
}
