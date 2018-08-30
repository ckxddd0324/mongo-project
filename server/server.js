const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT || 5001;
app.use(bodyParser.json());

//url and callback
//post todos
app.post('/todos', (req, res) => {
    console.log(req.body);
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((result) => {
        res.send({ result });
    }, (e) => {
        res.status(400).send(e);
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

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = { 
    app 
};