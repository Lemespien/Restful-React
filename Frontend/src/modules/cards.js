import React from 'react';
import './cards.css';

class CardHandler extends React.Component {
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

    componentDidMount() {
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


    render() {
        let renderstuff = [];
        if (this.state.posts !== '') {
            this.state.posts.forEach(post => {
                const { _id, title, description, content } = post;
                renderstuff.push(<Card
                    key={_id}
                    id={_id}
                    title={title}
                    description={description}
                    content={content}
                    deletePost={this.deletePost}
                />);
            });
        }

        let instructionText = "Below you can enter a title, description and some content to create a new post! When you're done, simply click 'Card' and it will be uploaded to the server.";

        return (
            <section className="post-section">
                <div style={{ width: "480px" }}>
                    <Card title="Hello world" description="This is a post" content={instructionText} />
                </div>
                {window.location.hash === "#Posts" ? <PostForm handleForm={this.handleForm} handleFormChange={this.handleFormChange} /> : <div></div>}
                <div className={"card-container"}>
                    {renderstuff}
                </div>
            </section>
        );
    }
}

class Card extends React.Component {
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
                    <h1>
                        {title}
                    </h1>
                    <div className={"remove-btn"} onClick={() => onclick(id)}>X</div>
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

export { CardHandler, Card, PostForm };