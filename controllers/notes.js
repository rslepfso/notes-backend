const notesRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");

// ROUTE HANDLERS

// Get all notes
notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate("user");

  response.json(notes);
});

// Get single note
notesRouter.get("/:id", async (request, response, next) => {
  const note = await Note.findById(request.params.id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

// Delete note
notesRouter.delete("/:id", async (request, response, next) => {
  await Note.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

// Create new note
notesRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const user = await User.findById(body.userId);

  if (!body.content) {
    return response.status(400).json({ error: "content is missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  response.json(savedNote);
});

// Update note
notesRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((result) => response.json(result))
    .catch((error) => next(error));
});

module.exports = notesRouter;
