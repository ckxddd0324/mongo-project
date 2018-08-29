const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        console.log('Unable to connect MangoDB server');
    }
    console.log('Connected to MongoDB server');

   //findOneAndUpdate
//    db.collection('Todos').findOneAndUpdate({
//        text: "homework"
//    }, {
//        $set: {
//            completed: true
//        }
//    }, {
//        returnOriginal: false
//    }, (err, result) => {
//        if(err){
//            console.log(err)
//        }
//        console.log(result);
//    })

    db.collection('Users').findOneAndUpdate({
        name: "Irene"
    },{
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })
    //db.close();
});