const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;
  const user = users.find(user => user.username === username);
  
  if(!user){
      return response.status(400).json({erro:"User not found"});
  }
  request.user = user; // permite que eu tenha acesso ao customer nos .get
  return next();

  // Complete aqui
}

app.post('/users', (request, response) => {
   const {name,username} = request.body;

   const checksExistsUserAccount = users.some(
    (users)=> users.username === username
    ); //some para verificar se ja existe

   if (checksExistsUserAccount){
      return response.status(400).json({error:"user already exists"});
   }

   const user = {
    name,
    username,
    id: uuidv4(),
    todos: []
  }

   users.push(user);

   return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title,deadline} = request.body;
  const{user} = request;

  const todos = {
    id : uuidv4(),
    title : title,
    done: false, 
    deadline :  new Date(deadline),
    created_at :  new Date()
  };

  user.todos.push(todos)
  return response.status(201).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {title,deadline} = request.body;
  
  const {id} = request.params;

  const todo = user.todos.find(todo => todo.id = id);

  if (!todo){
    return response.status(404).send({error: "Todo not found"})

  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  //user.todos.map((item) =>{
  //  if (item.id === id ){
  //    item.title = title;
  //    item.deadline = new Date(deadline);
  //  }
  //});

  return response.status(201).send(todo)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params;

  const todo = user.todos.find(todo => todo.id === id)

  if(!todo){
    return response.status(404).send({error: "Todo not found"})
  }

  todo.done = true;

  //user.todos.map((item) =>{
  //  if (item.id === id ){
  //    item.done = true;
  //  }
  //});

  return response.status(201).send(todo)

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params;

  const todoIdex = user.todos.findIndex(todo => todo.id === id);  //retorno posicao

  if(todoIdex === -1){
    return response.status(404).send({error: "Todo not found"})
  }

  user.todos.splice(todoIdex, 1); 

  //for( var i = 0; i < user.todos.length; i++){ 
  //  if ( user.todos[i].id === id) { 
  //    user.todos.splice(i, 1); 
  //  }
  //} 

  return response.status(204).send()
});

module.exports = app;

app.listen(3333);