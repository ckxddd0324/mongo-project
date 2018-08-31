const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { User } = require('./../models/user');

describe('POST /users', () => {
    it('should create a user', (done) => {
        let userData = {
            email: `testing@12.com`,
            password: '123456'
        };

        request(app)
            .post('/users')
            .send(userData)
            .expect(200)
            .expect((res) => {
                expect(res.body.result.email).toBe(userData.email);
                expect(res.body.result.password).toBeA('string');
            })
            .end(done);
    });
});