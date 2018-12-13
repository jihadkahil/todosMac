var express = require('express');
var env = process.env.NODE_ENV || 'development';

console.log('env ******',env);
if(env ==='development')
{

process.env.PORT = 3000;
process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
}else{
  process.env.PORT = 3000;
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest"
}

var bodyParser = require('body-parser');
const _ = require('lodash');
var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { ObjectID } = require('mongodb');
var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.status(200).send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});


app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {

    res.send({ 'todos': todos });
  }).catch((e) => {
    res.status(400).send({ 'error': e });
  });
})


app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id))
    return res.status('404').send({ 'error': 'invalide object Id' });

  Todo.findByIdAndRemove(id).then((todo) => {

    if (!todo) {
      return res.status(404).send({'error':'invalide Todos'});
    }


    res.status(200).send({todo});
  }).catch((e) => {
    res.status(404).send((e));
  })
})

app.patch('/todos/:id',(req,res)=>{
  var id =  req.params.id;
  if(!ObjectID.isValid(id))
  return res.status('404').send({ 'error': 'invalide object Id' });

  var body = _.pick(req.body,['text','completed']);

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send({'error':'inavlide To Do'});
    }

    res.send({todo});

  

}).catch((e)=>{
  res.status('404').send({'error':e});
})
});
app.listen(3000, () => {
  console.log('Started on port 3000');
});


module.exports = {
  app
};
