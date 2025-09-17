import { render, screen } from '@testing-library/react'
import Home from '../page'

test('renders hero', () => {
  render(<Home />)
  expect(screen.getByText(/Your Future, Decoded/i)).toBeInTheDocument()
})
