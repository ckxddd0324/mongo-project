const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, users, populateTodos, populateUsers } = require ('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);
describe('POST /todos', () => {
    it('it shoud create a new todo', (done) => {
        let text = 'This is a supertest';

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.result.text).toBe(text);
            })
            .end((err, res) => {
                if(err){
                    done(err);
                }

                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.result.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.result.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('it should not return todo created by other user', (done) => {
        let fakeId = new ObjectID();
        request(app)
            .get(`/todos/${todos[1]._id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('it should return 404 if todo not found', (done) => {
        let fakeId = new ObjectID();
        request(app)
            .get(`/todos/${fakeId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('shoud return 400 for non-object ID', (done) => {
        let wrongId = 123
        request(app)
            .get(`/todos/${wrongId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end(done);
    })
});

describe('DELETE /todos/:id', () => {
    it('should delete the selected todo', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id}`)
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 when trying to remove the todo that is not created by you', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById(todos[0]._id).then((result) => {
                    expect(result).toExist();
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    });

    it('should return 400 when trying to remove a non object id', (done) => {
        let wrongId = 123;
        request(app)
            .delete(`/todos/${wrongId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        //grab id of first item
        //patch request and some data- update the text and set completed to true
        //200
        //text is changed, completed is true
        //completed_at is a number
        let updateData = {text: "Test update process", completed: true};
        request(app)
            .patch(`/todos/${todos[0]._id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send(updateData)
            .expect(200)
            .expect((res) => {
                expect(res.body.result.text).toBe(updateData.text);
                expect(res.body.result.completed).toBe(true);
                expect(res.body.result.completed_at).toBeA('number');
            })
            .end(done);
    });

    it('should not update the todo', (done) => {
        //grab id of first item
        //patch request and some data- update the text and set completed to true
        //200
        //text is changed, completed is true
        //completed_at is a number
        let updateData = {text: "Test update process", completed: true};
        request(app)
            .patch(`/todos/${todos[0]._id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send(updateData)
            .expect(404)
            .end(done);
    });

    it('should clear completed_at when todo is not completed', (done) => {
        //grab id of second todo item
        //update text, set completed to false
        //200
        //res.body is update- text is change/ completed is false, completed_at is null(toNotExist)
        let updateData = {completed: false};
        request(app)
            .patch(`/todos/${todos[1]._id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send(updateData)
            .expect(200)
            .expect((res) => {
                expect(res.body.result.text).toBe(todos[1].text);
                expect(res.body.result.completed).toBe(false);
                expect(res.body.result.completed_at).toNotExist();
            })
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        let token = users[0].tokens[0].token;

        request(app)
            .get('/users/me')
            .set('x-auth', token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        let email = 'mina@minari.com'
        let password = '1234abcd';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toExist(email);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it('should return validation errors if request invalid', (done) => {
        let email = 'mina@minari.com'
        let password = '1234a';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toBe("User validation failed");
                expect(res.body.name).toBe("ValidationError");
            })
            .end(done);
    });

    it('should not create user if email in user', (done) => {
        request(app)
            .post('/users')
            .send({ 
                email: users[1].email, 
                password: '123abc'
            })
            .expect(400)
            .expect((res) => {
                expect(res.body.code).toBe(11000);
            })
            .end(done);
    });
})

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({ 
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if(err){
                    done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                      });
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + '1'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if(err){
                    done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1)
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            }).end((err, res) => {
                if(err){
                    done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => {
                    done(e);
                })
            })
    });
})
