import { render, screen } from '@testing-library/react';
import App from './App';

test('renders map container', () => {
  render(<App />);
  const mapContainer = screen.getByTestId('map-container');
  expect(mapContainer).toBeInTheDocument();
});
