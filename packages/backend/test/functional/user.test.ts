 import 'reflect-metadata';
 import 'jest';
 import request from 'supertest';
 import { Helper } from '../helper';

 describe('User Tests', () => {
   const helper = new Helper();

   beforeAll(async () => {
     await helper.init();
   });

   afterAll(async () => {
     await helper.shutdown();
   });

   // TODO: Delete this tests if fixtures are running in test-context
    it('Create/Register Dummy User (TODO)', async (done) => {
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

    it('Get Dummy User', async (done) => {
      const authToken = await helper.loginUser('dummy@test.de');
      request(helper.app)
        .get('/api/users/1')
        .send()
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.data.email).toBe('dummy@test.de');
          expect(res.body.data.name).toBe('Dummy');
          done();
        });
    });

    it('Update Dummy User', async (done) => {
     const authToken = await helper.loginUser('dummy@test.de');
     request(helper.app)
       .patch('/api/users/1')
       .send({
          name: 'Updated Dummy',
          email: 'newdummy@test.de',
          password: 'newtestpw'
       })
       .set('Content-Type', 'application/json')
       .set('Accept', 'application/json')
       .set('Authorization', authToken)
       .expect(200)
       .end(async (err, res) => {
         if (err) throw err;
         expect(res.body.data.email).toBe('newdummy@test.de');
         expect(res.body.data.name).toBe('Updated Dummy');
         done();
      });
    });

    it('Delete Dummy User', async (done) => {
     const authToken = await helper.loginUser('newdummy@test.de');
     request(helper.app)
       .delete('/api/users/1')
       .send()
       .set('Content-Type', 'application/json')
       .set('Accept', 'application/json')
       .set('Authorization', authToken)
       .expect(200)
       .end((err, res) => {
         if (err) throw err;
         expect(res.status).toBe(200);
         done();
      });
    });
 });
