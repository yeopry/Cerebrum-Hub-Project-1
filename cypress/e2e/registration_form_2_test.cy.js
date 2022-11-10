beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_2.html')
})

// Workshop #6 create following tests:

describe('Section 1: Functional tests', () => {
    it('User can submit form with valid data and only mandatory fields added', ()=>{
        // Add test steps for filling in ONLY mandatory fields
        cy.get('[data-testid="user"]').type('username')
        //cy.get('[data-testid="user"]').should('have.value','username')
        cy.get('#email').type('test@gmail.com')
        //cy.get('#email').should('have.value','test@gmail.com')
        cy.get('[data-cy="name"]').type('John')
        //cy.get('[data-cy="name"]').should('have.value','John')
        cy.get('[data-testid="lastNameTestId"]').type('Smith')
        //cy.get('[data-testid="lastNameTestId"]').should('have.value','Smith')
        cy.get('[data-testid="phoneNumberTestId"]').type('10203040')
        //cy.get('[data-testid="phoneNumberTestId"]').should('have.value','10203040')
        cy.get('#password').type('myPass')
        //cy.get('#password').should('have.value','myPass')
        cy.get('#confirm').type('myPass{enter}')
        //cy.get('#confirm').should('have.value','myPass')

        // Assert that submit button is enabled
        cy.get('.submit_button').should('be.enabled')
        //cy.get('.submit_button').click()     this is replaced by adding {enter} to password confirmation

        // Assert that after submitting the form system show successful message
        cy.get('#success_message').should('be.visible').should('contain','User successfully submitted registration')
    })

    it('User can submit form with all fields added', ()=>{
        // Add test steps for filling in ALL fields
        cy.get('#username').type('yeopry');
        cy.get('#email').type('test@gmail.com');
        cy.get('[data-cy="name"]').type('FirstName');
        cy.get('[data-testid="lastNameTestId"]').type('Lastname');
        cy.get('[data-testid="phoneNumberTestId"]').type('10203040');
        cy.get('#cars').select('Saab').invoke('val').should('eq', 'saab');
        cy.get('#animal').select('Hippo').invoke('val').should('eq', 'hippo');
        cy.get('input[name="password"]').type('Qwerty');
        cy.get('[name="confirm"]').type('Qwerty{enter}');

        // Assert that submit button is enabled
        cy.get('.submit_button').should('be.enabled')

        // Assert that after submitting the form system show successful message
        cy.get('#success_message').should('be.visible').and('contain', 'User successfully submitted registration');
    })

    it('User can use only same both first and validation passwords', ()=>{
        // Add test steps for filling in only mandatory fields
        cy.get('#username').type('username');
        cy.get('#email').type('test@mail.com');
        cy.get('input[placeholder="John"]').type('FirstName');
        cy.get('#lastName').type('Lastname');
        cy.get('[data-testid="phoneNumberTestId"]').type('10203040');
        cy.get('#cars').select('Volvo').invoke('val').should('eq', 'volvo');
        cy.get('#animal').select('Cat').invoke('val').should('eq', 'cat');

        // Type confirmation password which is different from first password
        cy.get('input[name="password"]').type('Qwerty');
        cy.get('[name="confirm"]').type('Qwerty2{enter}');

        // Assert that submit button is not enabled
        cy.get('.submit_button').should('be.disabled');
        // Assert that successful message is not visible
        cy.get('#success_message').should('not.be.visible');
        // Assert that error message is visible
        cy.get('#password_error_message').should('be.visible').and('contain', 'Passwords do not match!');
    })

    it('Check that submit button cannot be selected if username is empty', () => {
        // Submit button by default is disabled and cannot be clicked
        cy.get('button[class="submit_button"]').should('be.disabled')

        // use function in order to fill the form with correct data
        inputValidData()

        // Add steps for emptying username input field
        cy.get('#username').clear();

        // Assert that submit button is still disabled
        cy.get('button[class="submit_button"]').should('be.disabled')
    })

    //Add more similar tests for checking other mandatory field's absence

})

// Workshop #7 create more visual tests

describe('Section 2: Visual tests', () => {
    it('Check that logo is correct and has correct size', () => {
        cy.log('Will check logo source and size')
        cy.get('img').should('have.attr', 'src').should('include', 'cerebrum_hub_logo')
        // get element and check its parameter height, to be equal 178
        cy.get('img').invoke('height').should('be.lessThan', 178)
            .and('be.greaterThan', 100)
    })

    it('Check that second logo is correct and has correct size', () => {
        cy.log('WIll check secong logo sourse and size')
        cy.get('[data-cy="cypress_logo"]').should('have.attr', 'src').should('equal', 'cypress_logo.png')
        cy.get('[data-cy="cypress_logo"]').invoke('width').should('eq', 116)    //checking the width
        cy.get('[data-cy="cypress_logo"]').invoke('height').should('eq', 88)    //checking the height

    })

    // Create similar test for checking second picture

    it('Check navigation part', () => {
        cy.get('nav').children().should('have.length', 2)

        // Get navigation element, find siblings that contains h1 and check if it has Registration form in string
        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')
        cy.get('nav').children().eq(0).should('be.visible')
            .and('have.attr', 'href', 'registration_form_1.html')
            .click()
        // Check that currently opened URL is value:
        cy.url().should('contain', '/registration_form_1.html')
        // Visit previous page
        cy.go('back')
        cy.log('Back again in registration form 2')
    })

    it('Check that URL to Cerebrum Hub page is correct and clickable', () => {
        //Create similar test for checking second link to Cerebrum Hub homepage
        cy.get('nav').siblings('h1').should('have.text','Registration form number 2')
        cy.get('nav').children().eq(1).should('be.visible')
            .and('have.attr','href','https://cerebrumhub.com/')
            .click()
        //Check that currently opened URL is correct
        cy.url().should('contain','cerebrumhub.com')
        //Go back to previouse page
        cy.go('back')
        cy.url().should('contain', 'registration_form_2.html')
        cy.log('Back to the registration form 2')
    })

    it('Check that radio button list is correct', () => {
        // Array has totally 4 elements
        cy.get('input[type="radio"]').should('have.length', 4)
        /*
        .next() is needed because of HTML structure:
        <input type="radio" id="htmlFavLanguage" name="fav_language" value="HTML">
        <label for="htmlFavLanguage">HTML</label><br>
         */
        cy.get('input[type="radio"]').next().eq(0).should('have.text','HTML').and('not.be.checked')
        cy.get('[for="htmlFavLanguage"]').should('have.text','HTML')

        cy.get('input[type="radio"]').next().eq(1).should('have.text','CSS').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','JavaScript').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','PHP').and('not.be.checked')

        // Selecting one will remove selection from other radio button
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })

    it('Check that checkbox list is correct', () => {
        // Create test similar to previous one
        cy.get('input[class="checkbox vehicles"]').should('have.length', 3)

        //Check each checkbox text
        cy.get('[for="vehicle1"]').should('have.text','I have a bike').and('not.be.checked')
        cy.get('[for="vehicle2"]').should('have.text','I have a car').and('not.be.checked')
        cy.get('[for="vehicle3"]').should('have.text','I have a boat').and('not.be.checked')

        //Several checkboxes can be selected
        cy.get('#vehicle1').check().should('be.checked')
        cy.get('#vehicle2').check().should('be.checked')
        cy.get('#vehicle1').should('be.checked')

        cy.get('#vehicle1').uncheck().should('not.be.checked')
    })

    it('Car dropdown is correct', () => {
        // Select second element and create screenshot for this area, and full page
        // Don't forget to delete files and comment back if not using
        // cy.get('#cars').select(1).screenshot('Cars drop-down')
        // cy.screenshot('Full page screenshot')

        // Different solutions how get array length of elements in Cars dropdown
        cy.get('#cars').children().should('have.length', 4)
        cy.get('#cars').find('option').should('have.length', 4)
        cy.get('#cars').find('option').eq(0).should('have.text', 'Volvo')
        cy.get('#cars').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['volvo', 'saab', 'opel', 'audi'])
        })
    })

    it('Favourite animal dropdown is correct', () => {
        // Create test similar to previous one
        cy.get('#animal').children().should('have.length',6)

        //Check content of every animal dropdown
        cy.get('#animal').children().eq(0).should('have.text', 'Dog')
        cy.get('#animal').children().eq(1).should('have.text', 'Cat')
        cy.get('#animal').children().eq(2).should('have.text', 'Snake')
        cy.get('#animal').children().eq(3).should('have.text', 'Hippo')
        cy.get('#animal').children().eq(4).should('have.text', 'Cow')
        cy.get('#animal').children().eq(5).should('have.text', 'Horse')
    })
})

function inputValidData() {
    cy.log('Username will be filled')
    cy.get('input[data-testid="user"]').type('Something')
    cy.get('#email').type('validemail@yeap.com')
    cy.get('[data-cy="name"]').type('John')
    cy.get('#lastName').type('Doe')
    cy.get('[data-testid="phoneNumberTestId"]').type('10203040')
    // If element has multiple classes, then one of them can be used
    cy.get('#password').type('MyPass')
    // To get multiple classes user .class1.class2 selector
    cy.get('#confirm').type('MyPass')
    cy.get('[name="confirm"]').type('InvalidMyPass')
    cy.get('h2').contains('Password').click()
}

