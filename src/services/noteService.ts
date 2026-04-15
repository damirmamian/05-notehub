import axios from "axios";
import type { Note } from "../types/note";

interface fetchNotesProps {
    notes: Note[],
    page: number
    totalPages: number
}

const note = axios.create({
    baseURL: "https://notehub-public.goit.study/api",
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
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

export async function createNote({ title, content, tag }: Note) {
    const message = await note.post<fetchNotesProps>("/notes", {
        title: title,
        content: content,
        tag: tag
    })
    return message.data
}

export async function deleteNote(id: string) {
    const request = await note.delete<fetchNotesProps>(`/notes/${id}`)
    return request
}

export default { fetchNotes, createNote, deleteNote }