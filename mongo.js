const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://rslepfso:${password}@cluster0.tojczn2.mongodb.net/notes?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

// const note = new Note({
//   content: "HTML is Easy",
//   important: false,
// });

// const note2 = new Note({
//   content: "Browser can execute only JavaScript",
//   important: false,
// });

// const note3 = new Note({
//   content: "GET and POST are the most important methods of HTTP protocol",
//   important: true,
// });

// note.save().then((result) => {
//   console.log("Note saved");
// });

// note2.save().then((result) => {
//   console.log("Note saved");
// });

// note3.save().then((result) => {
//   console.log("Note saved");
// });

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
