const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
},{
    _id: new ObjectID(),
    text: 'Second test todo'
}];


beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        done();
    })
});

describe('POST /todos', () => {
    it('it shoud create a new todo', (done) => {
        let text = 'This is a supertest';

        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.result.text).toBe(text);
            })
            .end((err, res) => {
                if(err){
                    done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    expect(todos[2].text).toBe(text);
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({

            })
            .expect(400)
            .end((err, res) => {
                if(err){
                    done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    })
});

describe('LIST /todos', () => {
    it('Get all the created todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.result.length).toBe(2);
            })
            .end(done);
    })
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.result.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('it should return 404 if todo not found', (done) => {
        let fakeId = new ObjectID();
        request(app)
            .get(`/todos/${fakeId}`)
            .expect(404)
            .end(done);
    });

    it('shoud return 400 for non-object ID', (done) => {
        let wrongId = 123
        request(app)
            .get(`/todos/${wrongId}`)
            .expect(400)
            .end(done);
    })
});

describe('DELETE /todos/:id', () => {
    it('should delete the selected todo', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.result._id).toBe(todos[0]._id.toHexString());
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById(todos[0]._id).then((result) => {
                    expect(result).toNotExist();
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    });

    it('should return 404 when trying to remove the todo that is not found', (done) => {
        let fakeId = new ObjectID()
        request(app)
            .delete(`/todos/${fakeId}`)
            .expect(404)
            .end(done);
    });

    it('should return 400 when trying to remove a non object id', (done) => {
        let wrongId = 123;
        request(app)
            .delete(`/todos/${wrongId}`)
            .expect(400)
            .end(done);
    });
});