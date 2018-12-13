
require('../config/config');
const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');



const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed:true,
  completedAt:333
}];


beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });


  describe('GET /todos', () => {
    it('should get all todos', (done) => {
      request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
          expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
  });



});

describe('Delete / todos', () => {
  it('dhould delete all todos', (done) => {

    var hexId = todos[1]._id.toHexString();

    request(app).delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId)
      }).end((err, res) => {
        if (err)
          done(err);



        Todo.findById(todos[1]._id).then((todo) => {
          expect().toNotExist(toString);
          done();
        }).catch((e) => {
          done(e);
        })
      });
  });




  it('should retrun 404 if todos not exist', (done) => {
    var hexId = new ObjectID().toHexString();

    
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end((err,res)=>{
        if(err)
        done(err);

        console.log(res.body);
      expect(res.body.error).toBe('invalide Todos');
      done();
      })


  });

  it('should retrun 404 if Object Id not equal exist', (done) => {

    var hexId = new ObjectID().toHexString() +'s';
    
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(404)
    .end((err,res)=>{
      if(err)
      done(err);
      expect(res.body.error).toBe('invalide object Id');
      done();
    });
  });


});


describe('Patch / todos',()=>{
  it('should update a todos',(done)=>{


    var hexId = todos[0]._id.toHexString();
    request(app)
    .patch(`/todos/${hexId}`)
    .send({text:'PIPO',completed:true})
    .expect(200)
    .end((err,res)=>{
   
      if(err)
      done(err);
      
     expect(res.body.todo.text).toBe('PIPO');
     done();

   
    });

    
  });

  it('show update todo to false and created at to null', (done) => {

    var hexId = todos[0]._id.toHexString();
    
    request(app)
    .patch(`/todos/${hexId}`)
    .send({text:'PIPO',completed:false})
    .expect(200)
    .end((err,res)=>{
      if(err)
      done(err);
      expect(res.body.todo.text).toBe('PIPO');
      expect(res.body.todo.completedAt).toNotExist();
      expect(res.body.todo.completed).toBeFalsy();
      done();
    });
  });


  
})



