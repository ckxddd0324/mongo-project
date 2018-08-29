const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// const id = '5b871a8701d6a3c61e5e3e791';

// if(!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos ', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todos) => {
//     console.log('Todo ', todos);
// });

// Todo.findById(id).then((todos) => {
//     console.log('Todo by ID ', todos);
// }).catch((e) => console.log(e));

const userID = '5b86ec636ce1426f1851c84c';
//query work and no user
//query was found
//print error
User.findById(userID).then((todos) => {
    if(!todos){
        console.log('Unable to locate the entered ID!')
    }

    console.log('This is the id you are looking for: ', todos)
    
}, (err) => {
    console.log('There is something wrong with the ID', err);
})