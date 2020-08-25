import React from 'react';
import { ProgressBar } from './resourceCard';

export class Expedition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id || '5f4521b4e1a1a13f6c021b9e',
            name: '',
            gold: 0,
            duration: 10,
            timeleft: 0,
            loot: [["5f36ce9d7e9ca13684464b4f", 95], ["5f36ce8b7e9ca13684464b4e", 50], ["5f36cec47e9ca13684464b50", 10], ["5f36ced57e9ca13684464b51", 10], ["5f36d4c77e9ca13684464b52", 40], ["5f36d4df7e9ca13684464b53", 50], ["5f36ce237e9ca13684464b4d", 90]],
            interval: null,
            intervalTime: 1000,
        };
    }
    componentDidMount() {
        this.fetchExpeditions();
    }

    fetchExpeditions = async () => {
        try {
            const data = await fetch(`http://localhost:8080/expeditions/${this.state.id}`);
            const dataText = await data.json();
            const { name, gold, duration, loot_table } = dataText;
            console.log(dataText);
            console.log(name, gold, loot_table);
            if (dataText) {
                this.setState({
                    name: name,
                    gold: gold,
                    duration: duration,
                    loot: loot_table
                });
                console.log(this.state);
            }
        } catch (error) {
            console.error(error);
        }

    }

    startExpedition = () => {
        if (this.state.interval)
            return;
        this.setState(
            {
                timeleft: this.state.duration,
                interval: setInterval(() => {
                    this.setState({
                        timeleft: this.state.timeleft - this.state.intervalTime / 1000,
                    });
                }, this.state.intervalTime)
            });
    };

    stopInterval = () => {
        clearInterval(this.state.interval);
        this.setState(
            {
                interval: null,
                timeleft: this.state.duration,
            }
        );
    };

    collectReward = async () => {
        let loot = this.state.loot;
        let lootDrop = loot.map(resource => {
            const randomNumber = Math.floor(Math.random() * 101);
            const chance = resource.chance;
            let lootMultiplier = 1;
            if (chance / randomNumber > 1) {
                lootMultiplier = Math.round(chance / randomNumber);
            }
            if (randomNumber <= chance) {
                const returnedLoot = [resource.item, lootMultiplier];
                return returnedLoot;
            }
        });

        const finalLoot = lootDrop.filter(loot => {
            if (loot)
                return loot;
        });
        if (finalLoot.length > 0) {
            const playerID = this.props.playerID;
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
            this.props.playerUpdate();
        }
        this.stopInterval();

    };

    render() {
        let displayTimer, collectReward, progressBar;
        if (this.state.interval) {
            progressBar = this.state.timeleft / this.state.duration;
            if (this.state.timeleft <= 0) {
                collectReward = true;
            }
            displayTimer = true;
        }
        let timerElement = (
            <ProgressBar text={this.state.timeleft} progress={progressBar} />
        );
        return (
            <div>
                {collectReward ? <button onClick={this.collectReward}>Collect Reward</button> : displayTimer ? timerElement : <button onClick={this.startExpedition}>Start {this.state.name}</button>}
            </div>
        );
    }
}
