import React from 'react';
import { ProgressBar } from './resourceCard';
import './expedition.css';
import '../player/player.css';

export class Expedition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id || '5f4521b4e1a1a13f6c021b9e',
            name: '',
            gold: 0,
            duration: 10,
            timeleft: 0,
            loot: [],
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

            if (dataText) {
                this.setState({
                    name: name,
                    gold: gold,
                    duration: duration,
                    loot: loot_table
                });
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
        const tableHead = ["Resources", "Chance"];
        let tableContent = [];
        if (this.state.loot) {
            this.state.loot.forEach(item => {
                console.log(item);
                const chance = item.chance;
                const { name } = item.item;
                tableContent.push([name, chance]);
            });
        }

        const TableElement = <Table tableHead={tableHead} tableContent={tableContent} />
        let timerElement = <ProgressBar text={this.state.timeleft} progress={progressBar} />;
        return (
            <div>
                <InfoWindow title={this.state.name} windowClass={"player-inventory"} content={TableElement} />
            </div>
        )
        // return (
        //     <div className={"expeditionCard"}>
        //         <h3>{this.state.name}</h3>
        //         <ExpeditionResourceReward resources={this.state.loot} />
        //         {collectReward ? <button className={"expedition-btn"} onClick={this.collectReward}>Collect Reward</button> : displayTimer ? timerElement : <button className={"expedition-btn"} onClick={this.startExpedition}>Start</button>}
        //     </div>
        // );
    }
}


function ExpeditionResourceReward(props) {
    if (props.resources) {
        let renderstuff = [];
        props.resources.forEach(resource => {
            renderstuff.push(<div key={resource._id} className={"resource-row"}>
                <p>{resource.item.name}</p>
                <p className={"resource-chance"}>{resource.chance}%</p>
            </div>);
        });
        return (renderstuff);
    }
    return (
        <div>

        </div>);
}

function InfoWindow(props) {
    return (
        <div className={props.windowClass}>
            <h3>{props.title}</h3>
            {props.content}
        </div>);
}

function Table(props) {
    return (
        <table className={"inventory-table"}>
            <TableHead elements={props.tableHead} />
            <TableContent elements={props.tableContent} />
        </table>)
}

function TableHead(props) {
    let tHead = [];
    props.elements.forEach(head => tHead.push(
        <th key={head}>{head}</th>
    ));

    return (
        <thead>
            <tr>
                {tHead}
            </tr>
        </thead>
    )
}

function TableContent(props) {
    let tContent = [];
    props.elements.forEach(content => tContent.push(
        <tr key={content[0]}>
            {content.map(element => <td key={element}>{element}</td>)}
        </tr>
    ))
    return (
        <tbody>
            {tContent}
        </tbody>
    );
}
