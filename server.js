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
  app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });

  app.get("/api/notes", function (req, res) {
    fs.readFile("db/db.json", "utf8", function (err, data) {
      var savedData = JSON.parse(data);
      return res.json(savedData);
    });
  });


  

  //  GET '*' - Should return the 'index.html' file
  app.get("*", function (req, res) {
    res.send(path.join(__dirname, "/public/index.html"));
  });


  


  app.post("/api/notes", function (req, res) {
    
    var newNote = req.body;

    fs.readFile("db/db.json", "utf8", function (err, data) {
      if (err) throw err;
      storedData = JSON.parse(data);
      storedData.push(newNote);
      console.log("newNote added to db.json");

      for (var i = 0; i < storedData.length; i++) {
        storedData[i].id = parseInt([i]) + 1;
      }

      fs.writeFile("db/db.json", JSON.stringify(storedData), function (err) {
        if (err) throw err;
        console.log("db.json updated");
      });
      res.json(true);
    });
  });

  

  app.delete("/api/notes/:id", function (req, res) {
    var deleteId = req.params.id;

    fs.readFile("db/db.json", "utf8", function (err, data) {
      if (err) throw err;
      storedData = JSON.parse(data);
      storedData.splice(deleteId - 1, 1);
      console.log("Note " + deleteId + " deleted");
      
      for (var i = 0; i < storedData.length; i++) {
        storedData[i].id = parseInt([i]) + 1;
      }

      fs.writeFile("db/db.json", JSON.stringify(storedData), function (err) {
        if (err) throw err;

        console.log("db.json updated");
      });
      res.json(storedData);
    });
  });




app.listen(PORT, function () {                                      
  console.log("App listening on PORT " + PORT);
});
