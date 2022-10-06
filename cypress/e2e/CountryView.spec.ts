describe('<CountryView />', () => {
    beforeEach(() => {
        cy.intercept(
            'GET',
            'https://covid-19-aggregates-dev.s3.eu-central-1.amazonaws.com/country/latest.json',
            { fixture: 'countriesData.json', statusCode: 200 },
        ).as('fetchCountriesData');
    });

    it('Displays map and legend', () => {
        cy.visit('/');

        cy.wait('@fetchCountriesData');

        cy.get('.mapboxgl-canvas').should('be.visible');
        cy.contains('Line List Cases').should('be.visible');
    });
});
