import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Reader from './components/Reader';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/novel/:id/chapter/:chapterIndex" component={Reader} />
          <Route path="/" exact>
            <h1>Novel Reader Home</h1>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;