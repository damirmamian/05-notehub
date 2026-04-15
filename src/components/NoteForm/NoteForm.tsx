import css from "./NoteForm.module.css"
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNote } from "../../services/noteService"


interface NoteFormProps {
    onClose: () => void
}

interface initialValuesProps {
    title: string,
    content: string,
    tag: string,
}

const initialValues: initialValuesProps = {
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


export default function NoteForm({ onClose }: NoteFormProps) {

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: createNote,
        retry: false,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] })
            onClose()
        },
    })

    const handleSubmit = (
        values: initialValuesProps,
        actions: FormikHelpers<initialValuesProps>
    ) => {
        mutation.mutate(values)
        actions.resetForm()
    }

    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={NoteFormSchema}>
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor="title">Title</label>
                    <Field id="title" type="text" name="title" className={css.input} />
                    <ErrorMessage name="title" component="span" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="content">Content</label>
                    <Field as="textarea"
                        id="content"
                        name="content"
                        rows={8}
                        className={css.textarea}
                    />
                    <ErrorMessage name="content" component="span" className={css.error} />
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
                    <ErrorMessage name="tag" component="span" className={css.error} />
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
