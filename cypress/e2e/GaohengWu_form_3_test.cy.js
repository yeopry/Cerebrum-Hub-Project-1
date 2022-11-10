beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})
//Workshop #8 add visual tests for registration form 3
/*
Task list:
* Create first test suite for visual tests
* Create tests to verify visual parts of the page:
    * radio button and its content
    * dropdown and dependencies between 2 dropdowns
    * checkbox, its content and link in it
    * email format
 */

describe('Section 1: visual tests', ()=> {
    it('Check the Cerebrum Hub picture is correct', () => {
        cy.get('[data-testid="picture"]').should('have.attr','src').should('include','cerebrum_hub_logo')
        cy.get('[data-testid="picture"]').invoke('height').should('equal',166)
        cy.get('[data-testid="picture"]').invoke('width').should('equal',178)
    });

    it('Check the Country dropdown button is correct', () => {
        // See that the dropdown button has three choices
        cy.get('#country').children('').should('have.length', 4)
        cy.get('#country').find('option').eq(0).should('have.text', '')
        cy.get('#country').find('option').eq(1).should('have.text', 'Spain')
        cy.get('#country').find('option').eq(2).should('have.text', 'Estonia')
        cy.get('#country').find('option').eq(3).should('have.text', 'Austria')

        //See that when the country Spain is chosen, the City dropdown button works correctly
        cy.get('#country').select(1).should('have.value','object:3')
        cy.get('#city').find('option').eq(0).should('have.text','')
        cy.get('#city').find('option').eq(1).should('have.text','Malaga')
        cy.get('#city').find('option').eq(2).should('have.text','Madrid')
        cy.get('#city').find('option').eq(3).should('have.text','Valencia')
        cy.get('#city').find('option').eq(4).should('have.text','Corralejo')

        //See that when the country Estonia is chosen, the City dropdown button works correctly
        cy.get('#country').select(2).should('have.value','object:4')
        cy.get('#city').find('option').eq(0).should('have.text','')
        cy.get('#city').find('option').eq(1).should('have.text','Tallinn')
        cy.get('#city').find('option').eq(2).should('have.text','Haapsalu')
        cy.get('#city').find('option').eq(3).should('have.text','Tartu')
        
        //See that when the country Austria is chosen, the City dropdown button works correctly
        cy.get('#country').select(3).should('have.value','object:5')
        cy.get('#city').find('option').eq(0).should('have.text','')
        cy.get('#city').find('option').eq(1).should('have.text','Vienna')
        cy.get('#city').find('option').eq(2).should('have.text','Salzburg')
        cy.get('#city').find('option').eq(3).should('have.text','Innsbruck')

    });

    it('Check the radio button of "Select your frequency" is correct', () => {
        // Check that four radio buttons display correctly
        cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily').should('not.be.checked')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly').should('not.be.checked')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly').should('not.be.checked')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','Never').should('not.be.checked')

        // Check that four radio buttons work correctly
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')

    });

    it('Check the checkboxes are correct', () => {
        // Check that the content beside checkboxes display correctly
        //cy.get('input[type="checkbox"]').eq(0).should('have.text','Accept our privacy policy') ??? Have problem to write a selector by myself 
        cy.get(':nth-child(15)').contains('Accept our privacy policy').should('not.be.checked')
        cy.get('button').get('a').contains('Accept our cookie policy').should('not.be.checked')

        // Check that checkboxes work correctly
        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')

        // Check that after checking the second checkbox, the first one is still checked
        cy.get('input[type="checkbox"]').eq(0).should('be.checked')

        // Check that checkboxes can be unchecked
        cy.get('input[type="checkbox"]').eq(0).uncheck().should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(1).uncheck().should('not.be.checked')
    });

    it('Check the link of "Accept our cookie policy" works correctly ', () => {
        // Check that the Accept our cookie policy button works
        cy.get('a').contains('Accept our cookie policy')
        cy.get('button').get('a').should('have.attr', 'href','cookiePolicy.html').click()

        // Check that after clciking the button, it is redirected to another page
        cy.url().should('contain','cookiePolicy.html')

        // Visit previous page
        cy.go('back')
        cy.url().should('contain','registration_form_3.html')
    });
})

//Workshop #9 add functional tests for registration form 3
/*
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + validation
    * only mandatory fields are filled in + validations
    * mandatory fields are absent + validations (use function)
    * If city is already chosen and country is updated, then city choice should be removed
    * Bonus task: add file (google yourself for solution)
* Rename file registration_form_3_test.cy.js to contain your name - JohnSmith_form_3_test.cy.js and upload your individual result to  team confluence
 */
describe('Section 2: functional tests', () => {
    it('Check that all fields are filled in with valid data and the registration form can be submitted', () => {
        // Fill all the fields
        fillInAllFields()

        // After filling all the fields, the submit button should be abled
        cy.get('[type="submit"]').eq(1).should('not.be.disabled')

    });

    it('Check that only mandatory fields are filled and ', () => {
        // All the mandatory fields are filled
        cy.get('#name').clear().type('Gao')
        cy.get('input[name="email"]').type('xxx@gmail.com')
        cy.get('#country').select(1)
        cy.get('#city').select('Malaga')
        cy.get('input[type="checkbox"]').eq(0).check()
        cy.get('input[type="checkbox"]').eq(1).check()

        // After filling all the mandatory fields, the submit button should be abled
        cy.get('[type="submit"]').eq(1).should('not.be.disabled')

    });

    it('Check that submit button is not active when the Name filed is empty', () => {  
        fillInAllFields()
        cy.get('#name').clear()

        // The submit button should be disabled
        cy.get('[type="submit"]').eq(1).should('be.disabled')
    });

    it('Check that submit button is not active when the Email filed is empty', () => {
        fillInAllFields()
        cy.get('input[name="email"]').clear()

        // The submit button should be disabled
        cy.get('[type="submit"]').eq(1).should('be.disabled')

        // Error message should be visible
        cy.get('[ng-show="myForm.email.$error.required"]').should('be.visible')
    });

    it('Check that submit button is not active when the email is invalid (random data)', () => {
        fillInAllFields()
        cy.get('input[name="email"]').clear().type('xx')

        // The submit button should be disabled
        cy.get('[type="submit"]').eq(1).should('be.disabled')

        // Error message should be visible
        cy.get('[ng-show="myForm.email.$error.email"]').should('be.visible')

    });

    it('Check that submit button is not active when the email is invalid (with @ symbol between random data)', () => {
        fillInAllFields()
        cy.get('input[name="email"]').clear().type('x@c')

        // The submit button should be disabled
        cy.get('[type="submit"]').eq(1).should('be.disabled')

        // Error message should be visible
        cy.get('[ng-show="myForm.email.$error.email"]').should('be.visible')

    });

    it('Check that submit button is not active when the Country filed is empty', () => {
        fillInAllFields()
        cy.get('#country').select(0)

        // The submit button should be disabled
        cy.get('[type="submit"]').eq(1).should('be.disabled')
        
    });

    it('Check that submit button is not active when the City filed is empty', () => {
        fillInAllFields()
        cy.get('#city').select('')

        // The submit button should be disabled
        cy.get('[type="submit"]').eq(1).should('be.disabled')

    });

    it('Check that submit button is not active when the "Accept our privacy policy" is not checked', () => {
        fillInAllFields()
        cy.get('input[type="checkbox"]').eq(0).uncheck()

        // The submit button should be disabled
        cy.get('[type="submit"]').eq(1).should('be.disabled')
    });

    it.only('Check that submit button is not active when the "Accept our cookie policy" is not checked', () => {
        fillInAllFields()
        cy.get('input[type="checkbox"]').eq(1).uncheck()

        // The submit button should be disabled
        cy.get('[type="submit"]').eq(1).should('be.disabled')
    });

    it('Check that file can be uploaded', () => {
        // Upload a file 
        cy.get('#myFile').selectFile('cypress/fixtures/cat-banner.png')
    });
});


function fillInAllFields() {
    cy.get('#name').clear().type('Gao')
    cy.get('input[name="email"]').type('xxx@gmail.com')
    cy.get('#country').select(1)
    cy.get('#city').select('Malaga')
    cy.get('input[type="date"]').eq(0).type('1991-08-29')
    cy.get('input[type="radio"]').eq(0).check()
    cy.get('input[type="date"]').eq(1).type('1991-08-29')
    cy.get('input[type="checkbox"]').eq(0).check()
    cy.get('input[type="checkbox"]').eq(1).check()
}