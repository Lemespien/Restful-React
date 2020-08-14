import React from 'react';
import './resourceCard.css';

class ResourceHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resources: []
        }
    }
    componentDidMount() {
        this.getResources();
    }
    getResources = async () => {
        try {
            const data = await fetch("http://localhost:8080/resources");
            const dataText = await data.json();
            this.setState({
                resources: dataText,
            });
            console.log("API was called")
            console.log(this.state);
        } catch (error) {
            console.error(error);
        }
    }
    render() {
        let renderstuff = [];
        if (this.state.resources.length > 0) {
            this.state.resources.forEach(resource => {
                const { name, description, price, quantity, shortname } = resource;
                renderstuff.push(
                    <ResourceCard key={resource._id} name={name} description={description} price={price} quantity={quantity} shortname={shortname} />
                );
            });
        }
        return (
            <div className={"resourceCard-container"}>{renderstuff}</div>
        )
    }
}


function ResourceCard(props) {
    const { name, description, price, quantity, shortname } = props;
    return (
        <div className={"resourceCard"} data-id={shortname}>
            <div className={"resourceCard-title"}>
                <h1>
                    {name}
                </h1>
            </div>
            <h3>
                {description}
            </h3>
            <p className={"resourceCard-content"}>
                price: {price} <br></br>
                quantity: {quantity}
            </p>
        </div>
    )
}

export default ResourceHandler;