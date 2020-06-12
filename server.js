const express = require("express");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static("public"));
// app.use(express.static("db"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

 

  
  
  // GET '/notes' - Should return the 'notes.html' file.
  app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });

  app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
  });

  app.get("/api/notes/:id", function (err, res) {
    notes = JSON.parse(fs.readFile(path.join(__dirname, "/db/db.json"), "utf8"), function (err, data) {
      if (err) throw err;
    });
    res.json(notes[Number(req.params.id)]);
    // res.json(data);
  });

  //  GET '*' - Should return the 'index.html' file
  app.get("*", function (req, res) {
    res.send(path.join(__dirname, "/public/index.html"));
  });


  app.post("/api/notes", function (req, res) {
    notes = JSON.parse(fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8"));
    // data = JSON.parse(notes);
    newNote = req.body;
    // req.body.id = notes.length +1;
    arrayId = notes.length.toString();
    newNote.id = arrayId;
    notes.push(newNote);
    fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(notes), "utf8", function (err) {
      if (err) throw err;
    });
    res.json(notes);
  });


  app.delete("/api/notes/:id", function (req, res) {
    notes = JSON.parse(fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8"));
    // notes = JSON.parse(notes);
    noteId = req.params.id;
    notes = notes.filter((selectNote) => {
      return selectNote.id != noteId;
    });
    // notes = JSON.stringify(notes);
    fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(notes), "utf8", function (err) {
      if (err) throw err;
    });
    res.json(notes);
  });




//  const notes = require("./db/db.json");
// // let notes = [];
//   app.get("/api/notes", function (req, res) {
//     return res.json(notes);
//   });

  
  // app.post("/api/notes", function (req, res) {
  //     fs.readFile(path.join(__dirname, "../db/db.json"), (err, data) => {
  //         if (err) throw err;
  //         let newNote = req.body;

  //         let notesArr = JSON.parse(data);
  //         let id = notesArr[notesArr.length - 1].id + 1;
  //          newNote.id = id;
  //         notesArr.push(newNote);
  //         let notesString = JSON.stringify(notesArr);

  //         console.log(typeof notesString);
  //         fs.writeFileSync(path.join(__dirname, "../db/db.json"), notesString);

  //     })
  // })






app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
