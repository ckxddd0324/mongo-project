const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        console.log('Unable to connect MangoDB server');
    }
    console.log('Connected to MongoDB server');



    db.collection('Users').insertOne({
        name: "CK",
        age: 27,
        location: "NYC"
    }, (err, result) => {
        if(err){
            return console.log("Unable to insert user ", err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    })
    db.close();
});