const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose, Todo} = require('./db');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
//Add headers so app works from local with remote(heroku) API - cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// POST /todos
app.post('/todos', (req, res) => {
  var todo = new Todo({
    content: req.body.content
  });

  todo.save().then((todo) => {
    res.send(todo._id);
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /todos
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send(todos);
  }, (e) => {
    res.status(400).send(e);
  })
});

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send(todo);
  }).catch(err => res.status(400).send());
});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndDelete(id).then((todo) => {
    if (todo) {
      return res.status(200).send(todo);
    }
    return res.status(404).send();

  }).catch(err => res.status(400).send());
});

// PATCH /todos/:id
app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOneAndUpdate({_id: id}, {$set: req.body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    return res.send(todo);
  }). catch(e => res.status(400).send());
})


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
