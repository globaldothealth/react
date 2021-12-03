describe('<VariantsView />', () => {
    it('Displays map and legend', () => {
        cy.intercept(
            'GET',
            'https://covid-19-aggregates-dev.s3.eu-central-1.amazonaws.com/variant-reporting-data.json',
            { fixture: 'variantsData.json' },
        ).as('fetchVariantsData');

        cy.visit('/variant-reporting');

        cy.wait('@fetchVariantsData');

        cy.get('.mapboxgl-canvas').should('be.visible');
        cy.contains(/To be determined/i).should('be.visible');
    });
});
