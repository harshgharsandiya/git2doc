import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/github'

export const api = {
    getMetadata: async (url: string) => {
        const res = await axios.post(`${API_BASE}/metadata`, { url })
        return res.data
    },

    getTree: async (url: string) => {
        const res = await axios.post(`${API_BASE}/tree`, { url })
        return res.data // Expected { success: true, tree: [...] }
    },

    generateCustomReadme: async (url: string, selectedFiles: string[]) => {
        const res = await axios.post(`${API_BASE}/generate-readme-custom`, {
            url,
            selectedFiles,
        })
        return res.data // Expected { readme: "..." }
    },
}
