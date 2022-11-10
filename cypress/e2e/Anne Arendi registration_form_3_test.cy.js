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
    it('Check the Cerebrum Hub logo', () => {
        cy.get('[data-testid="picture"]').should('have.attr','src').should('include','cerebrum_hub_logo')
        cy.get('[data-testid="picture"]').invoke('height').should('equal',166)
        cy.get('[data-testid="picture"]').invoke('width').should('equal',178)
    });
    
    it('Check Name', () => {
        cy.get('#name').clear().type('Anne Ar')
        
    })

    it('Check email format', () => {
        cy.get('.email').type ('username@username.com').should ('contain.value','@','.')
        cy.get('.email').clear

        cy.get('.email').type ('usernameusernamecom')
        cy.get('[ng-show="myForm.email.$error.email"]').should ('contain.text','Invalid email address.')
    
    });

    
    it('Check if country dropdown is correct', () => {

        cy.get('#country').children().should('have.length', 4)
        cy.get('#country').find('option').should('have.length', 4)
        cy.get('#country').find('option').eq(0).should('have.text', '')
        cy.get('#country').find('option').eq(1).should('have.text', 'Spain')
        cy.get('#country').find('option').eq(2).should('have.text', 'Estonia')
        cy.get('#country').find('option').eq(3).should('have.text', 'Austria')
    });

    it('City dropdown to check dependencies', () => {
       cy.get('#country').select("Estonia")
       //cy.get('#city>option').should('have.lenght',4)
       cy.get('#city>option').eq(0).should('not.be.selected')
       cy.get('#city>option').eq(1).should('have.text','Tallinn')
       cy.get('#city').contains('Tallinn').click()
       cy.get('#city>option').eq(2).should('have.text','Haapsalu')
       cy.get('#city').contains('Haapsalu').click()
       cy.get('#city>option').eq(3).should('have.text','Tartu')
       cy.get('#city').contains('Tartu').click()

       cy.get('#country').select("Spain")
       cy.get('#city>option').eq(0).should('not.be.selected')
       cy.get('#city>option').eq(1).should('have.text','Malaga')
       cy.get('#city').contains('Malaga').click()
       cy.get('#city>option').eq(2).should('have.text','Madrid')
       cy.get('#city').contains('Madrid').click()
       cy.get('#city>option').eq(3).should('have.text','Valencia')
       cy.get('#city').contains('Valencia').click()
       cy.get('#city>option').eq(4).should('have.text','Corralejo')
       cy.get('#city').contains('Corralejo').click()

       cy.get('#country').select("Austria")
       cy.get('#city>option').eq(0).should('not.be.selected')
       cy.get('#city>option').eq(1).should('have.text','Vienna')
       cy.get('#city').contains('Vienna').click()
       cy.get('#city>option').eq(2).should('have.text','Salzburg')
       cy.get('#city').contains('Salzburg').click()
       cy.get('#city>option').eq(3).should('have.text','Innsbruck')
       cy.get('#city').contains('Innsbruck').click()

    });

    it('Radio buttons for frequency of newsletter', () => {
        
        cy.get('input[type="radio"]').should('have.length', 4)
        cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','Never').and('not.be.checked')

        // Selecting one will remove selection from other radio button
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    });

    it('Check the birthday format', () => {
        cy.get('[for="birthday"]').type('2022-02-12')
        cy.get('[for="birthday"]').clear
        cy.get('[for="birthday"]').type('1616-04-01')
        cy.get('[for="birthday"]').clear
        cy.get('[for="birthday"]').type('2100-02-12')
    });

    it('Check the checkboxes, its content and link in it', () => {

        cy.get(':nth-child(15) > .ng-pristine').should ('not.be.selected')
        cy.get(':nth-child(15)').contains ('Accept our privacy policy' )

        cy.get(':nth-child(15) > :nth-child(2)').should ('not.be.selected')
        cy.get(':nth-child(15)').contains ('Accept our cookie policy').should ('have.attr', 'href',"cookiePolicy.html").click()
        cy.url().should('contain', 'cookiePolicy.html')
        cy.go('back');
        
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
describe('Section 2: visual tests', () => {
   it('All fields are filled in + validation', () => {

   FillInAllFields()
   cy.get(':nth-child(2) > input').should('be.enabled').click()
   cy.get('h1').should('have.text', 'Submission received')
   cy.go('back')
});
it('Mandatory Fields are filled in + validation', () => {
   MandatoryFields()
   cy.get(':nth-child(2) > input').should('be.enabled').click()
   cy.get('h1').should('have.text', 'Submission received')
   cy.go('back')

});

it('Mandatory fields are absent (function)', () => {
         
    cy.get (MandatoryFields).clear  
    cy.get(':nth-child(2) > input').should('be.disabled')      
                     
});
it('If city is already chosen and country is updated, then city choice should be removed', () => {

    cy.get('#country').select('Spain')
    cy.get('#city').select('Corralejo')
    cy.get('#country').select('Austria')
    cy.get('#city').should('not.be.selected')
    cy.get(':nth-child(2) > input').should('be.disabled')  
    
});



   function FillInAllFields() {

      cy.get('#name').clear().type('AnneAr');
      cy.get('.email').type('annear@gmail.com');
      cy.get('#country').select('Spain');
      cy.get('#city').select('Corralejo');
      cy.get(':nth-child(8) > input').type('2022-01-01');
      cy.get('input[type="radio"]').next().eq(0).should('have.text', 'Daily').and('not.be.checked')
      cy.get('input[type="radio"]').eq(1).check().should('be.checked')
      cy.get('input[type="radio"]').eq(0).should('not.be.checked')
      cy.get('[for="birthday"]').type('2022-01-01');
      cy.get(':nth-child(15) > .ng-pristine').click().should('be.checked')
      cy.get(':nth-child(15) > :nth-child(2)').click().should('be.checked')
        
    }
        
    function MandatoryFields() {
        
        cy.get('input[name="email"]').type('annear@gmail.com')
        cy.get('#country').select('Spain')
        cy.get('#city').select('Corralejo')
        cy.get(':nth-child(15) > .ng-pristine').click().should('be.checked')
        cy.get(':nth-child(15) > :nth-child(2)').click().should('be.checked')
    }
    
})