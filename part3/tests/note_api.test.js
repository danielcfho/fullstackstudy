const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Note = require('../models/note')
const helper = require('./test_helper')

const api = supertest(app);

beforeEach(async () => {
  await Note.deleteMany({});
  const noteObjects = helper.initialNotes.map(note => new Note(note));
  const promiseArray = noteObjects.map(note => note.save());
  await Promise.all(promiseArray);
})


test("note is returned as json", async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 10000);

test("all notes are returned", async () => {
  const response = await api.get("/api/notes");
  expect(response.body).toHaveLength(helper.initialNotes.length);
});

test("a specific note is within the returned notes", async () => {
  const response = await api.get("/api/notes");
  const contents = response.body.map((n) => n.content);
  console.log(contents);
  expect(contents).toContain(
    'Browser can execute only Javascript'
  )
});

test('a valid note can be added',async()=>{
  const newContent =  'async/await simplifies making async calls'
  const newNote = {
    content: newContent,
    important: true,
  }
  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const notesAtEnd = await helper.notesInDb();
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

  const contents = notesAtEnd.map(n => n.content);
  expect(contents).toContain(
    newContent
  )
})

test('note without content is not added',async()=>{
  const newNote = {
    important: true,
  }
  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb();
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
})

test('a specific note can be viewed',async()=>{
  const notesAtStart = await helper.notesInDb();
  const noteToView = notesAtStart[0];
  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const procesedNoteToView = JSON.parse(JSON.stringify(noteToView));
  expect(resultNote.body).toEqual(procesedNoteToView);
})

test('a note can be deleted',async()=>{
  const notesAtStart = await helper.notesInDb();
  const noteToDelete = notesAtStart[0];

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204);

  const notesAtEnd = await helper.notesInDb();
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

  const contents = notesAtEnd.map(n => n.content);
  expect(contents).not.toContain(noteToDelete.content);
})


afterAll(() => {
  mongoose.connection.close();
});
