const express = require("express");
const cors = require("cors");
require("dotenv").config();

const Note = require("./models/note");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

// STATIC NOTES BACKEND
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// ROUTE HANDLERS
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// Get all notes
app.get("/api/notes", (request, response) => {
  Note.find({}).then((result) => {
    response.json(result);
  });
});

// Get single note
app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id).then((result) => response.json(result));
});

app.delete("/api/notes/:id", (request, response) => {
  const id = +request.params.id;
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

// Create new note
app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({ error: "content is missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((result) => response.json(result));
});

// MIDDLEWARE
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:", request.path);
  console.log("Body:", request.body);
  console.log("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(requestLogger);
app.use(unknownEndpoint);

// PORT AND APP
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
