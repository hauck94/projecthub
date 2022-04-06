 import 'reflect-metadata';
 import 'jest';
 import request from 'supertest';
 import { Authentication } from '../../src/middleware/authentication';
 import { Helper } from '../helper';

 describe('Authentication Tests', () => {
  const helper = new Helper();

   beforeAll(async () => {
     await helper.init();
   });

   afterAll(async () => {
     await helper.shutdown();
   });

   it('Create/Register new User', async (done) => {
     request(helper.app)
       .post('/api/users')
       .send({
         name: 'Dummy',
         email: 'dummy@test.de',
         password: 'testpw',
         repeatPassword: 'testpw',
       })
       .set('Content-Type', 'application/json')
       .set('Accept', 'application/json')
       .expect(200)
       .end((err, res) => {
         if (err) throw err;
         expect(res.body.data.email).toBe('dummy@test.de');
         expect(res.body.data.name).toBe('Dummy');
         done();
       });
   });

    it('Login User', async (done) => {
     request(helper.app)
       .post('/api/users/login')
       .send({
          email: 'dummy@test.de',
          password: 'testpw',
       })
       .set('Content-Type', 'application/json')
       .set('Accept', 'application/json')
       .expect(200)
       .end(async (err, res) => {
         if (err) throw err;
         const tokenData = (await Authentication.verifyToken(res.body.data)) as any;
         expect(tokenData).not.toBeNull();
         expect(tokenData.email).toBe('dummy@test.de');
         expect(tokenData.password).not.toBeDefined();
         expect(tokenData.iat).toBeDefined();
         expect(tokenData.exp).toBeDefined();
         done();
       });
   });
 });
