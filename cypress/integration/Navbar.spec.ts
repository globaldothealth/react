describe('<TopBar />', () => {
    it('Displays navbar and logo', () => {
        cy.visit('/');

        cy.url().should('include', '/country');

        cy.get('.navbar').should('be.visible');
        cy.get('#logo').should('be.visible');
        cy.contains('Country view').should('be.visible');
        cy.contains('Regional view').should('be.visible');
        cy.contains('Coverage').should('be.visible');

        cy.url().should('include', '/country');

        cy.get('.regionalViewNavButton').click();
        cy.url().should('include', '/region');
        cy.url().should('not.include', '/country');
    });

    it('Opens and closes the MapGuide', () => {
        cy.visit('/');

        cy.get('.MuiDialog-paperScrollPaper').should('not.exist');
        cy.contains(/Map Guide/i)
            .should('be.visible')
            .click();
        cy.get('.MuiDialog-paperScrollPaper').should('exist');
        cy.contains('Close').click();
        cy.get('.MuiDialog-paperScrollPaper').should('not.exist');
        cy.contains(/Map Guide/i)
            .should('be.visible')
            .click();
        cy.get('body').click(0, 0);
        cy.get('.MuiDialog-paperScrollPaper').should('not.exist');
    });
});
