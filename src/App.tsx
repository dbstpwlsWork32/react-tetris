import React from 'react';
import {
  BrowserRouter as Router
} from 'react-router-dom'
import Header from './layouts/header'
import Main from './layouts/main'

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Main />
      </div>
    </Router>
  );
}

export default App;
