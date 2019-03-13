import React from 'react'
import ReactDOM from 'react-dom'
import './styles.css'
import { Game } from './Board';

function Usage() {
  return <Game />
}
Usage.title = 'Tic Tac Toe: Advanced State'

export default Usage

ReactDOM.render(<Game />, document.getElementById('root'))
