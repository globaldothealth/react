describe('<SideBar />', () => {
    it('Displays navbar, hides navbar', () => {
        cy.visit('/');

        cy.get('[data-cy="sidebar"]').should('be.visible');

        cy.contains('COVID-19 LINE LIST CASES');
        cy.get('#sidebar-tab-icon').should('be.visible').click();

        cy.get('[data-cy="sidebar"]').should('not.be.visible');
        cy.contains('COVID-19 LINE LIST CASES').should('not.be.visible');

        cy.get('#sidebar-tab-icon').click();

        cy.get('.regionalViewNavButton').click();
        cy.get('[data-cy="sidebar"]').should('be.visible');
    });

    it('Countries list dropdown opens', () => {
        cy.visit('/');

        cy.get('.searchbar')
            .should('be.visible')
            .click()
            .type('Germany{downarrow}{enter}');

        //TODO: add action to check if germany was clicked correctly (ie. zoom into the right country)
    });

    it('Displays completeness select in coverage view', () => {
        cy.intercept(
            'GET',
            'https://covid-19-aggregates-dev.s3.eu-central-1.amazonaws.com/completeness-data.json',
            { fixture: 'completenessData.json', statusCode: 200 },
        ).as('fetchCompletenessData');

        cy.visit('/coverage');
        cy.wait('@fetchCompletenessData');

        cy.contains(/Choose a field/i);
    });

    it('Changes countries list after choosing completeness field', () => {
        cy.intercept(
            'GET',
            'https://covid-19-aggregates-dev.s3.eu-central-1.amazonaws.com/completeness-data.json',
            { fixture: 'completenessData.json', statusCode: 200 },
        ).as('fetchCompletenessData');

        cy.visit('/coverage');
        cy.wait('@fetchCompletenessData');

        cy.get('#completeness-field-select').click();
        cy.contains('_id').click();

        cy.contains(/United States/i).should('not.exist');
        cy.contains(/Cuba/i);
    });
});
