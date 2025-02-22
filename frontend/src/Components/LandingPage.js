// LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import ExampleGraph from './ExampleGraph';

const LandingPage = () => (
  <div style={{
    textAlign: 'center',
    paddingTop: '20px',
    background: 'black',
    color: 'white',
    minHeight: '100vh'
  }}>
    <h1>Welcome to Plan-et Rendezvous</h1>
    <p>Explore a galaxy of date ideas through an interactive 3D experience.</p>
    
    <div style={{ margin: 'auto', width: '90%', height: '600px' }}>
      <ExampleGraph />
    </div>

    <br />
    <Link to="/register" style={{ color: 'white', fontSize: '18px' }}>Create an Account</Link>
  </div>
);

export default LandingPage;
