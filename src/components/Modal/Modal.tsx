import { useEffect } from "react"
import NoteForm from "../NoteForm/NoteForm"
import css from "./Modal.module.css"
import type { Note } from "../../types/note"
import { createPortal } from "react-dom";


interface closeButtonProps {
    onClose: () => void
    onCreate: (values: Note) => Promise<void>
}

export default function Modal({ onClose, onCreate }: closeButtonProps) {
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return (() => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        })
    }, [onClose])

    return createPortal(<div onClick={handleBackdropClick}
        className={css.backdrop}
        role="dialog"
        aria-modal="true"
    >
        <div className={css.modal}>
            <NoteForm onCreate={onCreate} onClose={onClose} />
        </div>
    </div>, document.body
    )
}
