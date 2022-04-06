import 'reflect-metadata';
import 'jest';
import request from 'supertest';
import { Helper } from '../helper';

 describe('widget crud', () => {
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

   /*it('Create Widget', async (done) => {
     const authToken = await helper.loginUser('dummy@test.de');
     request(helper.app)
       .post('/api/widgets')
       .send({
         id: '34',
         type: 'todo',
         xPos: 0,
         yPos: 0,
         height: 0,
         width: 0,
         data: {}
       })
       .set('Content-Type', 'application/json')
       .set('Accept', 'application/json')
       .set('Authorization', authToken)
       .expect(200)
       .end((err, res) => {
         if (err) throw err;
         expect(res.body.data.id).toBe('34');
         done();
       });
   });

   it('Get Widget', async (done) => {
     const authToken = await helper.loginUser('dummy@test.de');
     request(helper.app)
       .get('/api/widgets/34')
       .set('Content-Type', 'application/json')
       .set('Accept', 'application/json')
       .set('Authorization', authToken)
       .expect(200)
       .end((err, res) => {
         if (err) throw err;
         expect(res.body.data.id).toBe('34');
         expect(res.body.data.type).toBe('test type');
         done();
       });
   });

   it('Update Widget', async (done) => {
    const authToken = await helper.loginUser('dummy@test.de');
    request(helper.app)
      .patch('/api/widgets/34')
      .send({
        type: 'new widget test type'
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.type).toBe('new widget test type');
        expect(res.body.data.id).toBe('34');
        done();
      });
  });

   it('Delete Widget', async (done) => {
     const authToken = await helper.loginUser('dummy@test.de');
     request(helper.app)
       .delete('/api/widget/34')
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
   });*/
 });
