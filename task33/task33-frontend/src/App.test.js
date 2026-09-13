import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Naqib item desk', () => {
  render(<App />);
  expect(screen.getByText(/Naqib's item desk/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Add to collection/i })).toBeInTheDocument();
});
