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
    it('CerebrumHub logo is visible and has correct size', () => {
        cy.get('[data-testid="picture"]').should('have.attr', 'src').should('eq','cerebrum_hub_logo.png')
        cy.get('[data-testid="picture"]').invoke('width').should('be.lessThan', 179)    //checking the width
        cy.get('[data-testid="picture"]').invoke('height').should('eq', 166)    //checking the height
    });

    it('Typing name and email', () => {
        cy.get('#name').clear().type('Elon Musk')
        cy.get('.email').clear().type('wrong.email')  //typing wrong email and making sure error message appear
        cy.get('[ng-show="myForm.email.$error.email"]').should('contain','Invalid email address.').should('be.visible')
        cy.get('.email').clear().type('test@gmail.com')  //typing correct email and making sure error doesnt appear
        cy.get('[ng-show="myForm.email.$error.email"]').should('not.be.visible')
    })

    it('Testing country and city dropdowns', () => {
        //Making sure all 3 countries are being displayed
        cy.get('#country').children().should('have.length', 4)
        cy.get('#country').find('option').eq(1).should('have.text','Spain')
        cy.get('#country').find('option').eq(2).should('have.text','Estonia')
        cy.get('#country').find('option').eq(3).should('have.text','Austria')

        //Making sure if Spain chosen, the right cities are displayed
        cy.get('#country').select('Spain')
        cy.get('#city').children().should('have.length', 5)
        cy.get('#city').find('option').eq(1).should('have.text','Malaga')
        cy.get('#city').find('option').eq(2).should('have.text','Madrid')
        cy.get('#city').find('option').eq(3).should('have.text','Valencia')
        cy.get('#city').find('option').eq(4).should('have.text','Corralejo')

        //Making sure if Estonia chosen, the right cities are displayed
        cy.get('#country').select('Estonia')
        cy.get('#country>option').eq(2).should('be.selected')
        cy.get('#city').children().should('have.length', 4)
        cy.get('#city').find('option').eq(1).should('have.text','Tallinn')
        cy.get('#city').find('option').eq(2).should('have.text','Haapsalu')
        cy.get('#city').find('option').eq(3).should('have.text','Tartu')

        //Making sure if Austria chosen, the right cities are displayed
        cy.get('#country').select('Austria')
        cy.get('#city').children().should('have.length', 4)
        cy.get('#city').find('option').eq(1).should('have.text','Vienna')
        cy.get('#city').find('option').eq(2).should('have.text','Salzburg')
        cy.get('#city').find('option').eq(3).should('have.text','Innsbruck')

    });

    it('Checking if newsletter radio buttons are working', () => {
        cy.get('input[type="radio"]').should('have.length', 4)

        cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','Never').and('not.be.checked')

        //Selecting one will remove selection from another radio button
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    });

    it('Checking if birthday field works', () => {
        cy.get('input[type="date"]').eq(0).type('1999-03-20')
        cy.get('input[type="date"]').eq(0).should('have.value','1999-03-20')
        cy.get('input[type="date"]').eq(0).type('1999-03-21')
        cy.get('input[type="date"]').eq(0).should('have.value','1999-03-21')
        cy.get('input[type="date"]').eq(1).type('1998-04-21')
        cy.get('input[type="date"]').eq(1).should('have.value','1998-04-21')
        cy.get('input[type="date"]').eq(1).invoke('val','')
        cy.get('input[type="date"]').eq(1).type('2024-04-21') //Future date can be entered
    });

    it('Checking privacy checkboxes', () => {
        cy.get('input[type="checkbox').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox').eq(1).check().should('be.checked')
        cy.get('input[type="checkbox').eq(0).should('be.checked')

        //Checking if cookie policy page is working correctly
        cy.get('a').click()
        cy.url().should('contain','cookiePolicy.html') //correct url is opened
        cy.go('back')
        cy.url().should('contain','registration_form_3.html') //checking if we are back to original url
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

describe('Functional tests', () => {
    it('Registration submission', () => {
        //All fields are filled in + validation
        AllFieldsFilled()
        PoliciesAccepted()
        cy.get(':nth-child(2) > input').should('be.enabled') //submit button is enabled
        cy.get(':nth-child(2) > input').click()
        cy.get('body > div > h1').should('be.visible').should('contain','Submission received') //making sure submission message visible
        cy.go('back') //going back to registration form

        //Only mandatory fields are filled in + validation
        MondatoryFieldsFilled()
        cy.get(':nth-child(2) > input').should('not.be.enabled') //submit button is not enabled
        PoliciesAccepted() //checking policies
        cy.get(':nth-child(2) > input').should('be.enabled') //submit button is enabled
        cy.get(':nth-child(2) > input').click()
        cy.get('body > div > h1').should('be.visible').should('contain','Submission received') //making sure submission message visible
        cy.go('back') //going back to registration form

        //Mandatory fields are absent + validations
        cy.get(':nth-child(2) > input').should('not.be.enabled')
        PoliciesAccepted()
        cy.get(':nth-child(2) > input').should('not.be.enabled')

        //Users cannot submit form if all mondatory fields are filled but policy checkboxes are not checked
        MondatoryFieldsFilled()
        cy.get('input[type="checkbox').eq(0).uncheck().should('not.be.checked') // making sure checkboxes
        cy.get('input[type="checkbox').eq(1).uncheck().should('not.be.checked') // are not checked 
        cy.get(':nth-child(2) > input').should('not.be.enabled') //making sure submit button is not enabled
    });

    it('If city is chosen and country updated, city choice should be removed', () => {
        cy.get('#country').select('Spain')
        cy.get('#city').select('Madrid')
        cy.get('#city>option').eq(2).should('be.selected')
        cy.get('#country').select('Austria')
        cy.get('#city>option').eq(2).should('not.be.selected')
        cy.get('#city').children().should('not.have.text', 'Madrid')
    });

    it('Check that "Upload a file" function is working', () => {
        //Checking if users can upload files
        cy.get('input[type=file]').selectFile('cypress/fixtures/cerebrum_hub_logo.png')
        cy.get('input[type=submit]:nth-child(2)').click()
        cy.get('body > div > h1').should('be.visible').should('contain','Submission received')
        cy.go("back")
    });

});

//Used functions

function AllFieldsFilled() {
    //All fields are filled
    MondatoryFieldsFilled()
    cy.get('input[type="date"]').eq(0).type('1999-03-20').should('have.value','1999-03-20')
    cy.get('input[type="date"]').eq(1).type('1999-03-20').should('have.value','1999-03-20')
    cy.get('input[type="radio"]').eq(3).check().should('be.checked')
}

function MondatoryFieldsFilled() {
    cy.reload()
    //Filling in all mandatory fields
    cy.get('#name').clear().type('Elon Musk').should('have.value','Elon Musk')
    cy.get('.email').clear().type('test@gmail.com').should('have.value','test@gmail.com')
    cy.get('#country').select('Estonia')
    cy.get('#country>option').eq(2).should('be.selected') //asserting selection was made
    cy.get('#city').select('Tallinn')
    cy.get('#city>option').eq(1).should('be.selected') //asserting selection was made
}

function PoliciesAccepted() {
    //Accepting (checking) policies
    cy.get('input[type="checkbox').eq(0).check().should('be.checked')
    cy.get('input[type="checkbox').eq(1).check().should('be.checked')    
}