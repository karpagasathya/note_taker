const express = require("express");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let storedData = [];

// GET '/notes' - Should return the 'notes.html' file.
app.get("/notes", (req, res)=> {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// API to store data as JSON
app.get("/api/notes",  (req, res)=> {
  fs.readFile("db/db.json", "utf8",  (err, data) => {
    var savedData = JSON.parse(data);
    return res.json(savedData);
  });
});

//  GET '*' - Should return the 'index.html' file
app.get("*", (req, res) =>{
  res.send(path.join(__dirname, "/public/index.html"));
});

//POST New note to server
app.post("/api/notes",  (req, res)=> {
  let newNote = req.body;

  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    storedData = JSON.parse(data);
    storedData.push(newNote);
    console.log("newNote added to db.json");

    for (let i in storedData) {
      storedData[i].id = parseInt([i]) + 1;
    }

    fs.writeFile("db/db.json", JSON.stringify(storedData), err=> {
      if (err) throw err;
    });
    res.json(true);
  });
});

//DELETE Note from Server
app.delete("/api/notes/:id", function (req, res) {
  let deleteId = req.params.id;

  fs.readFile("db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    storedData = JSON.parse(data);
    storedData.splice(deleteId - 1, 1);
    console.log("Note " + deleteId + " deleted");

    for (let i in storedData) {
      storedData[i].id = parseInt([i]) + 1;
    }

    fs.writeFile("db/db.json", JSON.stringify(storedData), function (err) {
      if (err) throw err;
    });
    res.json(storedData);
  });
});

// Starts the server to begin listening
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
