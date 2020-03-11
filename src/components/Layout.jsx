import React from 'react';
import {Link} from "react-router-dom";
import {useIdentity} from '../hooks/useIdentity'

export const IdentityContext = React.createContext(null);


export const Layout = ({children}) => {
  const {authenticate, identity} = useIdentity()

  return <IdentityContext.Provider value={identity}>
  <h1>Locked.fyi</h1>
  <header>
    {!identity &&
    <nav>
      <button onClick={authenticate}>Authenticate</button>
    </nav>}
    {identity &&
    <nav>
      <span>You are {identity}!</span>
    </nav>}
    <nav>
      <Link to='/write'>Write</Link>
    </nav>
  </header>

  {children}

  </IdentityContext.Provider>
}
export default Layout