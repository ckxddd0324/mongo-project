const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        console.log('Unable to connect MangoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: "Something to do",
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         return console.log("Unable to insert todo ", err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })
    var array = [];
    db.collection('Users').find({
        name: "MOMO"
    }).toArray()
    .then((docs)=>{
        array = docs;
        console.log('Found user: ');
        console.log(JSON.stringify(docs))
    }, (err)=>{
        console.log('unable to fetch todos', err);
    })
    console.log(1, array);

    db.close();
});