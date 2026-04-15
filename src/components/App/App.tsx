import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import SearchBox from "../SearchBox/SearchBox"
import css from "./App.module.css"
import { useEffect, useState } from "react"
import { deleteNote, fetchNotes } from "../../services/noteService"
import NoteList from "../NoteList/NoteList"
import Pagination from "../Pagination/Pagination"
import 'modern-normalize/modern-normalize.css';
import Modal from "../Modal/Modal"
import { useDebouncedCallback } from 'use-debounce';
import Loader from "../Loader/Loader"
import Error from "../Error/Error"
import NoteForm from "../NoteForm/NoteForm"


export default function App() {
  const [page, setPage] = useState(1)
  const [topic, setTopic] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, topic],
    queryFn: () => fetchNotes(page, topic),
    placeholderData: keepPreviousData
  })

  const notes = data?.notes ?? []
  const totalPages = data?.totalPages ?? 0

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteNote,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
    },
  })

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleFetch = async () => {
    const data = await fetchNotes(page, topic)
    return data.notes
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
    {modalOpen && <Modal onClose={closeModal}><NoteForm onClose={closeModal} /> </Modal>}

  </div >
  )
}