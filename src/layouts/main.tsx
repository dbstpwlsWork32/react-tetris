import React from 'react'
import {
  Switch,
  Route
} from 'react-router-dom'
import Tetris from '../components/tetris'

const Main:React.SFC<{}> = props => {
  return (
    <div>
      <Switch>
        <Route exact path="/">
          Wellcome to Tetris contest
        </Route>
        <Route exact path="/self">
          <Tetris/>
        </Route>
      </Switch>
    </div>
  )
}

export default Main