import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <h1>BAW - Buy and Sell Around the World</h1>
          <p>React + Django Marketplace Platform</p>
          
          <div style={{ margin: '40px 20px', textAlign: 'center' }}>
            <h2>Getting Started</h2>
            <p>Backend API: http://localhost:8000</p>
            <p>Frontend: http://localhost:3000</p>
            
            <h3>Quick Start:</h3>
            <ol style={{ textAlign: 'left', display: 'inline-block' }}>
              <li>Start Django backend: <code>python manage.py runserver</code></li>
              <li>Start React frontend: <code>npm run dev</code></li>
              <li>Create superuser: <code>python manage.py createsuperuser</code></li>
              <li>Visit admin panel: <code>http://localhost:8000/admin</code></li>
            </ol>
          </div>
        </div>
      </Router>
    </Provider>
  )
}

export default App
