import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { createNote, initializeNotes } from '../../reducers/noteReducer'
import { createNotification } from '../../reducers/notificationReducer'

const Home = () => {
    const dispatch = useDispatch()
    const notes = useSelector(state => state.notes)

    const [note, setNote] = useState('')

    useEffect(() => {
        dispatch(initializeNotes())
    }, [dispatch])

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(createNote({
            note: note
        }))
        setNote('')
    }

    return (
        <div>
            <div>
                <h1>
                    Home
                </h1>

                <button onClick={() => dispatch(createNotification('Success', false))}>See Success Notification</button>
                <button onClick={() => dispatch(createNotification('Error', true))}>See Error Notification</button>

                <h2>Temp Form To Show Server Connection</h2>
                <form onSubmit={handleSubmit}>
                    <input required value={note} onChange={(e) => setNote(e.target.value)} />
                    <button type='submit'>Submit</button>
                </form>

                <h2>Notes</h2>
                {notes && notes.length > 0? <ul>
                    {notes.map(note => <li key={note.id}>{note.note}</li>)}
                </ul>:<p>There are no notes currently</p>}
            </div>
        </div>
    )
}

export default Home