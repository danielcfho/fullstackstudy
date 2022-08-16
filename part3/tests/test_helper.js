const Note = require('../models/note');

const initialNotes = [
  {
    content: "HTML is easy",
    date: new Date(),
    important: false,
  },
  {
    content: "Browser can execute only Javascript",
    date: new Date(),
    important: true,
  },
]

/**
 * create a new note and remove it after the test
 * make sure the returning id is not exist.
 * @returns The id of the note that was removed.
 */
const nonExistingId = async()=>{
  const note = new Note({
    content: 'will be removed',
    date: new Date(),
    important: true
  })
  await note.save();
  await note.remove();
  return note._id.toString();
}

/**
 * It fetches all the notes from the database and returns 
 * them as an array of JavaScript objects
 * @returns The notes in the database.
 */
const notesInDb = async()=>{
  const notes = await Note.find({});
  return notes.map(note=>note.toJSON());
}

module.exports= {
  initialNotes, nonExistingId, notesInDb
}