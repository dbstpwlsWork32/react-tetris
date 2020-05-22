import React from 'react'
import { NavLink } from 'react-router-dom'

const Header:React.SFC<{}> = props => {
  return (
    <ul>
      <li>
        <NavLink to="/" exact>Home</NavLink>
      </li>
      <li>
        <NavLink to="/self">Free Play</NavLink>
      </li>
    </ul>
  )
}

export default Header