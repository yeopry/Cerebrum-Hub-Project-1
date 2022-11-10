beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_1.html')
})

// NB! this is copy of registration_form_1_test.cy.js
// This file was created to make actions on same code that will be next in Workshop 4

/*
Workshop 3 assignment:
1 and 2 - If you see this text and founded file location in project tree, great job!
3 - Find .type('MyPass') - and then duplicate line 20 by using Shift + Alt + DownArrow
4 - Uncomment lines 17 - 20, you can use Ctrl + / while selecting multiple or single line
3 - Find and replace username2 to username
 */
describe('This is first test suite', () => {
    it('User can submit data only when valid mandatory values are added', () => {
        cy.get('#username').type('Something')
        cy.get('[data-testid="phoneNumberTestId"]').type('10203040')
        cy.get('input[name="password"]').type('MyPass')
        cy.get('[name="confirm"]').type('MyPass')

        //in order to activate submit button, user has to click somewhere outside the input field
        cy.get('h2').contains('Password').click()

        cy.get('.submit_button').should('be.enabled');
        cy.get('.submit_button').click()

        // Assert that both input and password error messages are not shown
        // next 2 lines check exactly the same, but using different approach
        cy.get('#input_error_message').should('not.be.visible')
        cy.get('#password_error_message').should('have.css', 'display', 'none')

        // Assert that success message is visible
        // next 2 lines check exactly the same, but using different approach
        cy.get('#success_message').should('be.visible')
        cy.get('#success_message').should('have.css', 'display', 'block')
    });
})