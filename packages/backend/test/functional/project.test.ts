 import 'reflect-metadata';
 import 'jest';
 import request from 'supertest';
 import { Helper } from '../helper';

 describe('project crud', () => {
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
    
   it('Create new Project', async (done) => {
     const authToken = await helper.loginUser('dummy@test.de');
     request(helper.app)
       .post('/api/projects')
       .send({
         name: 'Dummy Project',
         description: 'Dummy Project description',
         picture: '',
         members: [{
           id: 1,
           permission: 'true'
         }],
       })
       .set('Content-Type', 'application/json')
       .set('Accept', 'application/json')
       .set('Authorization', authToken)
       .expect(200)
       .end((err, res) => {
         if (err) throw err;
         expect(res.body.data.name).toBe('Dummy Project');
         expect(res.body.data.id).toBe(1);
         done();
       });
   });

   it('Get Project', async (done) => {
     const authToken = await helper.loginUser('dummy@test.de');
     request(helper.app)
       .get('/api/projects/1')
       .send()
       .set('Content-Type', 'application/json')
       .set('Accept', 'application/json')
       .set('Authorization', authToken)
       .expect(200)
       .end((err, res) => {
         if (err) throw err;
         expect(res.body.data.id).toBe(1);
         expect(res.body.data.name).toBe('Dummy Project');
         expect(res.body.data.description).toBe('Dummy Project description');
         done();
       });
   });

   it('Update Project', async (done) => {
    const authToken = await helper.loginUser('dummy@test.de');
    request(helper.app)
      .patch('/api/projects/1')
      .send({
        name: 'Updated Dummy Project',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.name).toBe('Updated Dummy Project');
        expect(res.body.data.id).toBe(1);
        done();
      });
   });

   it('should be able to add widgets to an existing project', async (done) => {
     const authToken = await helper.loginUser('dummy@test.de');
     request(helper.app)
       .put('/api/projects/1/widgets')
       .send([{
          id: "string",
          type: "string",
          xPos: 0,
          yPos: 0,
          height: 0,
          width: 0,
          data: {}
        }
        ])
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

   // TODO: Check why 404 is returned
   /*it('Delete Project', async (done) => {
    const authToken = await helper.loginUser('dummy@test.de');
    request(helper.app)
      .delete('/api/projects/1')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken)
      .end((err, res) => {
        if (err) throw err;
        expect(res.status).toBe(200);
        done();
      });
  });*/
 });
