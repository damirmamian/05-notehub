import axios from "axios";
import type { Note } from "../types/note";

interface fetchNotesProps {
    notes: Note[],
    totalPages: number
}

const note = axios.create({
    baseURL: "https://notehub-public.goit.study/api",
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`
    }
})

export async function fetchNotes(page: number, mysearchtext: string) {
    const response = await note.get<fetchNotesProps>("/notes", {
        params: {
            page,
            perPage: 12,
            search: mysearchtext
        },

    })
    return response.data
}

export async function createNote(data: {
    title: string
    content: string
    tag: string
}) {
    const res = await note.post("/notes", data)
    return res.data
}

export async function deleteNote(id: string) {
    const request = await note.delete<Note>(`/notes/${id}`)
    return request.data
}

export default { fetchNotes, createNote, deleteNote }