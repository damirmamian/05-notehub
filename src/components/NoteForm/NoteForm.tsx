import css from "./NoteForm.module.css"
import { Formik, Form, Field } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import type { Note } from "../../types/note";


interface NoteFormProps {
    onClose: () => void
    onCreate: (values: Note) => Promise<void>
}

const initialValues: Note = {
    id: "e3e",
    title: "",
    content: "",
    tag: "Todo",
};


const NoteFormSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, "Title must be at least 2 characters")
        .max(50, "Title is too long")
        .required("Title is required"),
    content: Yup.string()
        .max(500, "Content is too long"),
    tag: Yup.string()
        .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
        .required("Tag is required")
});


export default function NoteForm({ onClose, onCreate }: NoteFormProps) {
    const handleSubmit = (
        values: Note,
        actions: FormikHelpers<Note>
    ) => {
        console.log(values)
        onCreate(values)
        actions.resetForm()
        onClose()
    }

    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={NoteFormSchema}>
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor="title">Title</label>
                    <Field id="title" type="text" name="title" className={css.input} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="content">Content</label>
                    <Field as="textarea"
                        id="content"
                        name="content"
                        rows={8}
                        className={css.textarea}
                    />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="tag">Tag</label>
                    <Field as="select" id="tag" name="tag" className={css.select}>
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                </div>

                <div className={css.actions}>
                    <button onClick={onClose} type="button" className={css.cancelButton}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={css.submitButton}>
                        Create note
                    </button>
                </div>
            </Form>
        </Formik >
    )
}
