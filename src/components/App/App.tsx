import { keepPreviousData, useQuery } from "@tanstack/react-query"
import SearchBox from "../SearchBox/SearchBox"
import css from "./App.module.css"
import { useEffect, useState } from "react"
import { createNote, deleteNote, fetchNotes } from "../../services/noteService"
import NoteList from "../NoteList/NoteList"
import type { Note } from "../../types/note";
import Pagination from "../Pagination/Pagination"
import 'modern-normalize/modern-normalize.css';
import Modal from "../Modal/Modal"
import { useDebouncedCallback } from 'use-debounce';
import Loader from "../Loader/Loader"
import Error from "../Error/Error"


export default function App() {
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [topic, setTopic] = useState("")
  const [notes, setNotes] = useState<Note[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const { isLoading, isError } = useQuery({
    queryKey: ["note", page, topic],
    queryFn: () => fetchNotes(page, topic),
    enabled: topic !== "",
    placeholderData: keepPreviousData
  })

  const handleFetch = async () => {
    const data = await fetchNotes(page, topic)
    setNotes(data.notes)
    setTotalPages(data.totalPages)
  }

  const handleCreate = async (values: Note) => {
    await createNote(values)
    handleFetch()
  }

  const handleDelete = async (id: string) => {
    await deleteNote(id)
    handleFetch()
  }

  const updateSearchQuery = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTopic(e.target.value),
    300
  );

  const openModal = () => {
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
  }

  useEffect(() => {
    const fetchData = async () => await handleFetch()
    fetchData()
  }, [page, topic])

  return (<div className={css.app}>
    <header className={css.toolbar}>
      <SearchBox onChange={updateSearchQuery} />
      {totalPages > 1 && <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />}
      <button className={css.button} onClick={openModal}>Create note +</button>
    </header>
    {isLoading && <Loader />}
    {isError && <Error />}
    {notes.length > 0 && <NoteList notes={notes} onClick={handleDelete} />}
    {modalOpen && <Modal onCreate={handleCreate} onClose={closeModal} />}

  </div >
  )
}