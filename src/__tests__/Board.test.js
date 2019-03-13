import 'jest-dom/extend-expect'

import React from 'react'
import { render, fireEvent, cleanup } from 'react-testing-library'
import { Game } from '../Board';

afterEach(cleanup)

describe('', () => {
  test('should select on turn', () => {
    const { getByLabelText, getByText } = render(<Game />)
    expect(getByText(/Next player: X/)).toBeTruthy();
    fireEvent.click(getByLabelText(/square-0/))
    expect(getByLabelText(/square-0/)).toHaveTextContent('X')
    
    expect(getByText(/Next player: O/)).toBeTruthy();
    fireEvent.click(getByLabelText(/square-1/))
    expect(getByLabelText(/square-1/)).toHaveTextContent('O')
    
    // If click on selected not change turn
    expect(getByText(/Next player: X/)).toBeTruthy();
    fireEvent.click(getByLabelText(/square-1/))
    expect(getByLabelText(/square-1/)).toHaveTextContent('O')
    expect(getByText(/Next player: X/)).toBeTruthy();
  })

  test('should win the game', () => {
    const { getByLabelText, getByText } = render(<Game />)
    
    fireEvent.click(getByLabelText(/square-0/))
    fireEvent.click(getByLabelText(/square-3/))
    fireEvent.click(getByLabelText(/square-1/))
    fireEvent.click(getByLabelText(/square-4/))
    fireEvent.click(getByLabelText(/square-2/))
    expect(getByText('Winner: X')).toBeTruthy();
  })

  test('should go to move', () => {
    const { getByLabelText, getByText } = render(<Game />)
    fireEvent.click(getByLabelText(/square-0/))
    fireEvent.click(getByLabelText(/square-3/))
    fireEvent.click(getByLabelText(/square-1/))
    expect(getByLabelText(/square-1/)).toHaveTextContent('X')
    fireEvent.click(getByText('Go to move #2'))
    expect(getByLabelText(/square-1/)).toHaveTextContent('')
  })

  test('should tie', () => {
    const { getByLabelText, getByText } = render(<Game />)
    fireEvent.click(getByLabelText(/square-0/)) // x
    fireEvent.click(getByLabelText(/square-1/)) // o
    fireEvent.click(getByLabelText(/square-2/)) // x
    fireEvent.click(getByLabelText(/square-4/)) // o
    fireEvent.click(getByLabelText(/square-3/)) // x
    fireEvent.click(getByLabelText(/square-5/)) // o
    fireEvent.click(getByLabelText(/square-8/)) // x
    fireEvent.click(getByLabelText(/square-6/)) // o
    fireEvent.click(getByLabelText(/square-7/)) // x

    expect(getByText(/Scratch: Cat's game/)).toBeTruthy();
  })
})
