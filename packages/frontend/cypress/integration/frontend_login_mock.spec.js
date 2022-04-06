/* eslint-disable no-undef */
/// <reference types="cypress" />

context('frontend login actions', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: JSON.stringify({
        data:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlbW9AZXhhbXBsZS5vcmciLCJpZCI6MiwiaWF0IjoxNjEzNzY3ODkxLCJleHAiOjE2MTM3NzE0OTF9.8rLnb11EoVjoH51275DmkhLkhnhMyaZIACocKUnArbY',
      }),
    });

    cy.intercept('POST', '/api/users/', {
      statusCode: 200,
      body: JSON.stringify({
        data: JSON.stringify({
          id: 2,
          username: 'string',
          email: 'string',
          status: 'string',
          firstName: 'string',
          lastName: 'string',
          picture: 'string',
          entryDate: 'string',
          jobTitle: 'string',
          bio: 'string',
          settings: {},
        }),
      }),
    });

    cy.fixture('project1.json').then((json) => {
      cy.intercept('GET', '/api/projects', {
        statusCode: 200,
        body: JSON.stringify({
          data: json,
        }),
      });
    });

    cy.visit('http://localhost:3000');
  });

  it('should log in', () => {
    cy.get('[name=email]').type('fake@email.com').should('have.value', 'fake@email.com');
    cy.get('[name=password]').type('demoPassword').should('have.value', 'demoPassword');
    cy.get('[type=submit]').click();
    cy.url().should('eq', 'http://localhost:3000/dashboard');
  });

  it('should fail because password doesnt match', () => {
    cy.visit('http://localhost:3000/register');
    cy.get('[name=name]').type('DemoUser').should('have.value', 'DemoUser');
    cy.get('[name=email]').type('fake@email.com').should('have.value', 'fake@email.com');
    cy.get('[name=password]').type('demoPassword').should('have.value', 'demoPassword');
    cy.get('[name=repeatPassword]').type('hallo').should('have.value', 'hallo');
    cy.get('[type=submit]').click();
    cy.get('.error').should('contain', 'Password values do not match.');
  });

  it('sign in', () => {
    cy.visit('http://localhost:3000/register');
    cy.get('[name=name]').type('DemoUser').should('have.value', 'DemoUser');
    cy.get('[name=email]').type('fake@email.com').should('have.value', 'fake@email.com');
    cy.get('[name=password]').type('demoPassword').should('have.value', 'demoPassword');
    cy.get('[name=repeatPassword]').type('demoPassword').should('have.value', 'demoPassword');
    cy.get('[type=submit]').click();
    cy.url().should('eq', 'http://localhost:3000/dashboard');
  });
});
