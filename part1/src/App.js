import { useState, useEffect } from "react";
import Note from "./components/Note";
import Notification from "./components/Notification";
import noteService from "./services/notes";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    console.log("effect");
    noteService.getAll().then((res) => {
      setNotes(res.data);
    });
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    };
    noteService.create(noteObject).then((res) => {
      setNotes([...notes, res.data]);
      setNewNote("");
    });
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  const handleNoteChnage = (event) => {
    setNewNote(event.target.value);
  };

  const toggleImportantOf = (id) => {
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };
    // const changedImportant = { important: !note.important}
    noteService
      .update(id, changedNote)
      .then((res) => {
        setNotes(notes.map((note) => (note.id !== id ? note : res.data)));
      })
      .catch((err) => {
        setErrorMessage(
          `Note '${note.content}' was already deleted from server`
        )
        setTimeout(() => { 
          setErrorMessage(null)
         },5000)
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold underline">Notes</h1>
      <Notification message={errorMessage}/>
      <div>
        <button
          class="
          bg-blue-500 mx-2 my-4 hover:bg-blue-700 
          text-white font-bold p-2 rounded"
          onClick={() => setShowAll(!showAll)}
        >
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul class="space-y-1 my-4">
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportant={() => toggleImportantOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote} class="space-x-2">
        <input class="border" value={newNote} onChange={handleNoteChnage} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;
