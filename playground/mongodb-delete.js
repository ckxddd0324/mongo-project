const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        console.log('Unable to connect MangoDB server');
    }
    console.log('Connected to MongoDB server');

    //deleteManay
    // db.collection('Todos').deleteMany({text: "eat lunch"})
    // .then((result)=>{
    //     console.log(result);
    // })

    //deleteOne
    // db.collection('Todos').deleteOne({text: "eat lunch"})
    // .then((result)=>{
    //     console.log(result);
    // }, (err) =>{
    //     console.log(err);
    // })
    //findOneAndDelete
    db.collection('Todos').findOneAndDelete({
        _id: new ObjectID("5b86cd50501fefa7969761bd")
    }).then((result) => {
        console.log(result);    
    }, (err) => {
        console.log(err);
    })

    db.collection('Todos').deleteMany({
        text: "eat lunch"
    }).then((result) => {
        console.log(result);
    }, (err) => {
        console.log(err);
    })
    //db.close();
});