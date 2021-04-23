const express = require('express');
const app = express();
// concats filepaths
const path = require('path');   
// returns promises instead of callbacks 
const fs = require("fs").promises;
// generates unique keys
var uniqid = require('uniqid');       

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// looks for bound port first, otherwise runs on port 3000
const PORT = process.env.PORT || 3000;  

// reads saved notes from db.json
// returns array of objects representing saved notes
async function readFile() {
    const data = await fs.readFile("./db/db.json", "utf8");
    return JSON.parse(data);
}

// saves notes to db.json
async function writeFile(data) {
    data = JSON.stringify(data);
    await fs.writeFile("./db/db.json", data);
}

// homepage
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

// notes page
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

// notes api
app.get('/api/notes', async(req, res) => {
    let data = await readFile();
    res.json(data);
});
  
// adds note to db.json
app.post('/api/notes', async (req, res) => {

    const newNote = req.body;     
    let notes = await readFile(); 
    newNote.id = uniqid();        
    notes.push(newNote);          

    await writeFile(notes);       

    res.json(newNote);            

});



// listener
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));