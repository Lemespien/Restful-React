import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: "",
      title: '',
      description: '',
      content: '',
    }
  }

  handleFormChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState(
      {
        [name]: value,
      }
    )
  }

  handleForm = async (event) => {
    event.preventDefault();
    const title = this.state.title;
    const description = this.state.description;
    const content = this.state.content;
    await fetch("http://localhost:8080/post", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "title": title,
        "description": description,
        "content": content
      }),
    });
    this.callAPI();
  }

  deletePost = async (id) => {
    await fetch(`http://localhost:8080/post/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
    });
    this.callAPI();
  }

  callAPI = async () => {
    try {
      const data = await fetch("http://localhost:8080/post");
      const dataText = await data.json();
      this.setState({
        posts: dataText,
      });
      console.log("API was called")
      console.log(this.state);
    } catch (error) {
      console.error(error);
    }

  }

  pageHandler = (page) => {
    console.log(page);
    if (page === "Posts") {
      this.callAPI();
    }
  }
  render() {
    let renderstuff = [];
    if (this.state.posts !== '') {
      this.state.posts.forEach(post => {
        const { _id, title, description, content } = post;
        renderstuff.push(<Post
          key={_id}
          id={_id}
          title={title}
          description={description}
          content={content}
          deletePost={this.deletePost}
        />);
      });
    }

    return (
      <div className="App" >
        <header className="App-header">
          <nav >
            <Navigation pageHandler={this.pageHandler} />
          </nav>
        </header>

        <section className="post-section">
          <Post title="Hello world" description="This is a post" content="
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium dolorum, rem, necessitatibus repudiandae cum voluptate molestiae eligendi sed laudantium, quam perferendis! Laboriosam, vitae modi? Sapiente quasi veritatis, magnam similique totam saepe odit dolor ullam vel suscipit quos iusto sequi! Accusantium in ratione ad? Delectus eum architecto amet molestiae inventore incidunt?" />
          {window.location.hash === "#Posts" ? <PostForm handleForm={this.handleForm} handleFormChange={this.handleFormChange} /> : <div></div>}
          <div className={"card-container"}>
            {renderstuff}
          </div>
        </section>
      </div >
    );
  }
}

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: ["Posts", "About", "Projects"],
      currentPage: ''
    }
  }

  changePage = (page) => {
    this.props.pageHandler(page);
    this.setState({
      currentPage: page,
    });
  }

  render() {
    let renderstuff = [];
    this.state.pages.forEach(page => {
      renderstuff.push(<li key={page}><a href={`#${page}`} onClick={() => this.changePage(page)}>{page}</a></li>)
    });

    return (
      <ul className={"nav-ul"}>
        {renderstuff}
      </ul>
    );
  }
}

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisplayed: true,
    }
  }

  deletePost = () => {
    this.setState({
      isDisplayed: false,
    })
  }

  render() {
    if (!this.state.isDisplayed) return (<div></div>);
    const { title, description, content, id } = this.props;
    const onclick = this.props.deletePost || this.deletePost;
    return (
      <div className={"card"} data-id={id}>
        <div className={"card-title"}>
          <div className={"remove-btn"} onClick={() => onclick(id)}>X</div>
          <h1>
            {title}
          </h1>
        </div>
        <h3>
          {description}
        </h3>
        <p className={"card-content"}>
          {content}
        </p>
      </div>
    )
  }
}

function PostForm(props) {
  return (
    <div>
      <form className={"post-form"} onSubmit={(e) => props.handleForm(e)}>
        <label>
          <h3>Title</h3>
          <input type="text" name="title" required onChange={(e) => props.handleFormChange(e)} />
        </label>
        <label>
          <h3>Description</h3>
          <input type="text" name="description" required onChange={(e) => props.handleFormChange(e)} />
        </label>
        <label>
          <h3>Content</h3>
          <textarea name="content" required onChange={(e) => props.handleFormChange(e)} />
        </label>
        <button className="btn-submit" type="submit">Post</button>
      </form>
    </div>
  )
}

export default App;
