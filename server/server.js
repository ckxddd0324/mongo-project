require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());

//url and callback
//post todos
app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((result) => {
        res.send({ result });
    }, (e) => {
        res.status(400).send();
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then((result) => {
        res.send({result});
    }, (e) => {
        res.status(400).send(e);
    })
})

// GET /todos/:ID
app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    
    //valid id using isValid
        //stop and return 404 -send empty body
    if(!ObjectID.isValid(id)){
        res.status(400).send();
    }
    //findById
        //success
            //if todo- send it back
            //if no todo - send back 404 with empty body
        //error
            //400 - send empty body

    Todo.findById(id).then((result) => {
        if(!result){
            res.status(404).send();
        }

        res.send({ result });

    }).catch((e) => {
        res.status(400).send();
    })
})

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    if(!ObjectID.isValid(id)){
        res.status(400).send();
    }

    Todo.findByIdAndRemove(id).then((result) => {
        if(!result){
            res.status(404).send();
        }

        res.send({ result });
    }).catch((e) => {
        res.status(400).send();
    })

})

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)){
        res.status(400).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completed_at = new Date().getTime();
    } else {
        body.completed = false;
        body.completed_at = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((result) => {
        if(!result) {
            return res.status(404).send();
        }

        res.send({ result });
    }).catch((e) => {
        res.status(400).send();
    })

})

//POST /users
app.post('/users', (req, res) => {
    let userBody = _.pick(req.body, ['email', 'password']);

    let user = new User(userBody);

    user.save().then((user) => {
       // res.send({ result });
       console.log(user);
       return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = { 
    app 
};