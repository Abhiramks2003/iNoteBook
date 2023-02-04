import React, { useState, useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import noteContext from "../context/notes/noteContext.js"
import AddNote from './AddNote.js';
import Noteitem from './Noteitem.js';
const Notes = (props) => {
    const context = useContext(noteContext);
    let navigate = useNavigate();
    const { notes, getNotes, editNote } = context;

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotes()
        }
        else {
            navigate('/login')
        }
    },)
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" })
    const ref = useRef(null)
    const refClose = useRef(null)

    const updateNote = (currentNote) => {
        ref.current.click()
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag })
    }

    const handleClick = (e) => {
        console.log("Updating the Note", note)
        editNote(note.id, note.etitle, note.edescription, note.etag)
        refClose.current.click()
        props.showAlert("Note Updated Successfully", "primary")
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <>
            <AddNote showAlert={props.showAlert} />
            <div className="container my-3">
                <button type="button" ref={ref} className="btn btn-success d-none" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    Edit Note
                </button>

                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">Edit Note</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">Title</label>
                                        <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} onChange={onChange} minLength={5} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="edescription" className="form-label">Description</label>
                                        <input type="text" className="form-control" value={note.edescription} id="edescription" name="edescription" onChange={onChange} minLength={5} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="tag" className="form-label">Tag</label>
                                        <input type="text" className="form-control" id="etag" value={note.etag} name="etag" onChange={onChange} minLength={5} required />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" ref={refClose} className="btn btn-secondary d-none" data-bs-dismiss="modal">Close</button>
                                <button type="button" disabled={note.etitle.length < 5 || note.edescription.length < 5} className="btn btn-primary" onClick={handleClick}>Update Note</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row my-3">
                <h2>Your Notes</h2>
                <div className="container mx-2">
                    {note.length === 0 && "No notes to display!!!"}
                </div>
                {notes.map((note) => {
                    return <Noteitem key={note._id} showAlert={props.showAlert} updateNote={updateNote} note={note} />
                })}
            </div>
        </>
    )
}

export default Notes