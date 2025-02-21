describe('Map Display', () => {
  before(() => {
    cy.visit('/');
  });

  it('should render the map container', () => {
    cy.get('[data-testid="map-container"]').should('exist');
  });
});
