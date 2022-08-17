import React, { Component } from 'react';
import './App.css';

import { BrowserRouter } from 'react-router-dom'
import MainRouter from './routes/MainRouter'
import AuthenticationProvider from './providers/AuthProvider';

class App extends Component {  
  render() {
    return (
      <div className="App">
        <AuthenticationProvider>
          <BrowserRouter>
            <MainRouter/>
          </BrowserRouter>
        </AuthenticationProvider>
      </div>
    );
  }
}

export default App;