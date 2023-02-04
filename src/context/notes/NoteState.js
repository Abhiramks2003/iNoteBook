import noteContext from './noteContext'
import { useState } from 'react'
const NoteState = (props) => {
  const host = "http://localhost:5000"
  const [notes, setNotes] = useState([])

  //Get all notes
  const getNotes = async () => {
    let url = `${host}/api/notes/fetchallnotes`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
    });
    const json = await response.json()
    setNotes(json)
  }

  //Add a note
  const addNote = async (title, description, tag) => {
    let url = `${host}/api/notes/addnote`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    const json = await response.json();
    setNotes(notes.concat(json))
  }
  //Delete a note
  const deleteNote = async (id) => {
    console.log("Deleting note with id = " + id);
    let url = `${host}/api/notes/deletenote/${id}`
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify(notes)
    });
    const json = response.json()
    console.log(json);
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes)

  }

  //Edit a note
  const editNote = async (id, title, description, tag) => {
    let url = `${host}/api/notes/updatenote/${id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    const json = response.json()
    console.log("Edited Note = "+json);
    let newNotes = JSON.parse(JSON.stringify(notes))
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title
        newNotes[index].description = description
        newNotes[index].tag = tag
        break;
      }
    }
    console.log(id);
    setNotes(newNotes);
  }

  return (
    <noteContext.Provider value={{ notes, setNotes, addNote, editNote, deleteNote, getNotes }}>
      {props.children}
    </noteContext.Provider>
  )
}
export default NoteState