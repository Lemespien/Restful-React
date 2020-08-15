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
            <div>
                <Expedition />
                <div className={"resourceCard-container"}>{renderstuff}</div>
            </div>
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
                Price: {price} <br></br>
                Quantity: {quantity}
            </p>
        </div>
    )
}

class Expedition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            duration: 0,
            timeleft: 0,
            loot: [["5f36ce9d7e9ca13684464b4f", 95], ["5f36ce8b7e9ca13684464b4e", 50], ["5f36cec47e9ca13684464b50", 10], ["5f36ced57e9ca13684464b51", 10], ["5f36d4c77e9ca13684464b52", 40], ["5f36d4df7e9ca13684464b53", 50], ["5f36ce237e9ca13684464b4d", 90]],
            interval: null,
            intervalTime: 5000,
        }
    }

    startExpedition = () => {
        if (this.state.interval) return;
        this.setState(
            {
                timeleft: this.state.duration,
                interval: setInterval(() => {
                    this.setState({
                        timeleft: this.state.timeleft - this.state.intervalTime / 1000,
                    })
                }, this.state.intervalTime)
            });
    }

    stopInterval = () => {
        clearInterval(this.state.interval);
    }

    collectReward = async () => {
        let loot = this.state.loot;
        let lootDrop = loot.map(resource => {
            const randomNumber = Math.floor(Math.random() * 101);
            const chance = resource[1];
            let lootMultiplier = 1;
            if (chance / randomNumber > 1) {
                lootMultiplier = Math.round(chance / randomNumber);
            }
            if (randomNumber <= chance) {
                const returnedLoot = [resource[0], lootMultiplier];
                return returnedLoot;
            }
        });

        const finalLoot = lootDrop.filter(loot => {
            if (loot) return loot;
        })
        console.log(finalLoot);
        if (finalLoot.length > 0) {
            const playerID = "5f37a65f3117324bdc7b5d4c";
            await fetch(`http://localhost:8080/players/${playerID}`, {
                method: "PATCH",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    loot: finalLoot
                }),
            });
        }

        // try {
        //     const data = await fetch("http://localhost:8080/resources");
        //     const dataText = await data.json();
        //     this.setState({
        //         posts: dataText,
        //     });
        //     console.log("API was called")
        //     console.log(this.state);
        // } catch (error) {
        //     console.error(error);
        // }
    }

    render() {
        let displayTimer, collectReward;
        if (this.state.interval) {
            if (this.state.timeleft <= 0) {
                this.stopInterval();
                collectReward = true;
            }
            displayTimer = true;
        }
        let timerElement = (<p>{this.state.timeleft}</p>)
        return (
            <div>
                {collectReward ? <button onClick={this.collectReward}>Collect Reward</button> : displayTimer ? timerElement : <button onClick={this.startExpedition}>Start Expedition</button>}
            </div>
        );
    }
}

export default ResourceHandler;