import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: "",
    }
  }

  handleForm = (event) => {
    event.preventDefault();
    console.log("YO");
  }

  callAPI = async () => {
    try {
      const data = await fetch("http://localhost:8080/post");
      const dataText = await data.json();
      this.setState({
        apiResponse: dataText,
      });
    } catch (error) {
      console.error(error);
    }

  }
  render() {
    let renderstuff = [];
    if (this.state.apiResponse !== '') {
      this.state.apiResponse.forEach(post => {
        renderstuff.push(<Post
          post={post}
          key={post._id}
        />);
      });
    }


    return (
      <div className="App" >
        <header className="App-header">
          <nav >
            <ul style={{ display: "flex", listStyle: "none" }}>
              <li style={{ padding: "15px" }}><a href="#posts" onClick={this.callAPI}>Posts</a>
              </li>
              <li style={{ padding: "15px" }}><a href="#about">About</a>
              </li>
              <li style={{ padding: "15px" }}><a href="#projects">Projects</a>
              </li>
            </ul>
          </nav>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
        </p>
          <PostForm handleForm={this.handleForm} />
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >

            Learn React
        </a>
        </header>
        <section>
          <div className={"card-container"}>
            {renderstuff}
          </div>
        </section>
      </div >
    );
  }
}

function Post(props) {
  const { title, description, content, _id } = props.post;
  return (
    <div className={"card"} data-id={_id}>
      <h1>
        {title}
      </h1>
      <h3>
        {description}
      </h3>
      <p>
        {content}
      </p>
    </div>
  )
}

function PostForm(props) {
  return (
    <div>
      <form className={"post-form"}>
        <label>
          <h3>Title</h3>
          <input type="text" name="title" />
        </label>
        <label>
          <h3>Description</h3>
          <input type="text" name="description" />
        </label>
        <label>
          <h3>Content</h3>
          <textarea />
        </label>
        <button onClick={(e) => props.handleForm(e)}>Post</button>
      </form>
    </div>
  )
}

export default App;
