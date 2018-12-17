const {ObjectID} = require('mongodb');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');
const jwt = require('jsonwebtoken');
const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
  }, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
  }];

  var userIdOne = new ObjectID();
  var userIdTwo = new ObjectID();
var access = "auth";



  const users = [{
      _id:userIdOne,
      email:'jihadkahil.96@gmail.com',
      password:'12345678',
      tokens:[{
        access:'auth',
        token:jwt.sign({_id:userIdOne.toHexString(),access},'123asd').toString()
    }]
     
  },{
    _id:userIdTwo,
    email:'jihadkahil.95@gmail.com',
    password:'12345678',
    tokens:[{
        access:'auth',
        token:jwt.sign({_id:userIdTwo.toHexString(),access},'123asd').toString()
    }]
   
}];


  const  popuateTodos = (done) => {
    Todo.remove({}).then(() => {
      return Todo.insertMany(todos);
    }).then(() => done());
  };

  const populateUsers = (done)=>{
      User.remove({}).then(()=>{
        var  userOne =  new User(users[0]).save();
        var  userTwo =  new User(users[1]).save();

       return Promise.all([userOne,userTwo]);
      }).then(()=>{
          done();
      });
  }

  module.exports = {todos,users,popuateTodos,populateUsers};
  