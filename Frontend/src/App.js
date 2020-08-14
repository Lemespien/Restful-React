import React from 'react';
import './App.css';
import Navigation from './modules/navigation.js';
import { Card, PostForm, CardHandler } from './modules/cards.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentpage: '',
    }
  }

  render() {
    let displayPosts = false;
    if (this.state.currentpage === "Posts") {
      displayPosts = true;
    }
    return (
      <div className="App" >
        <header className="App-header">
          <nav >
            <Navigation pages={["Posts", "About", "Projects"]} />
          </nav>
        </header>
        {displayPosts ? <CardHandler /> : <div></div>}
      </div >
    );
  }
}





export default App;
