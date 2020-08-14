import React from 'react';
import './App.css';
import Navigation from './modules/navigation.js';
import { CardHandler } from './modules/cards.js';
import ResourceCard from './modules/resources/resourceCard.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentpage: '',
      shouldPostsDisplay: false,
    }
  }

  pageChange = (page) => {
    this.setState({
      currentpage: page,
    });
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
            <Navigation pages={["Posts", "About", "Projects", "Resources"]} pageChange={this.pageChange} />
          </nav>
        </header>
        {displayPosts ? <CardHandler /> : <div></div>}
        <ResourceCard />
      </div >
    );
  }
}





export default App;
