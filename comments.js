// Create web server

// 1. Import Express
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();

// 2. Define port
const PORT = 3000;

// 3. Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// 4. Routing
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/comments', (req, res) => {
  fs.readFile('./data/comments.json', (err, data) => {
    if (err) throw err;
    const comments = JSON.parse(data);
    res.send(comments);
  });
});

app.post('/comments', (req, res) => {
  const comment = req.body;
  fs.readFile('./data/comments.json', (err, data) => {
    if (err) throw err;
    const comments = JSON.parse(data);
    comment.id = uuidv4();
    comments.push(comment);
    fs.writeFile('./data/comments.json', JSON.stringify(comments), () => {
      res.send(comment);
    });
  });
});

app.delete('/comments/:id', (req, res) => {
  const id = req.params.id;
  fs.readFile('./data/comments.json', (err, data) => {
    if (err) throw err;
    const comments = JSON.parse(data);
    const newComments = comments.filter((comment) => comment.id !== id);
    fs.writeFile('./data/comments.json', JSON.stringify(newComments), () => {
      res.send(id);
    });
  });
});

// 5. Start web server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});