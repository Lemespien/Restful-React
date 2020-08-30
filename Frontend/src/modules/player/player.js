import React from 'react';
import { ResourceCard } from '../resources/resourceCard.js';
import { Expedition } from "../resources/expedition.js";
import '../resources/resourceCard.css';
import './player.css';

class PlayerHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '5f452c7144746224a8f903ee',
            name: 'Default Player',
            gold: 0,
            inventory: [],
        }
    }

    componentDidMount() {
        this.fetchInventory();
    }

    fetchInventory = async () => {
        try {
            const data = await fetch(`http://localhost:8080/players/?id=${this.state.id}`);
            const dataText = await data.json();
            this.setState({
                inventory: dataText[0].inventory,
            });
        } catch (error) {
            console.error(error);
        }
    }

    playerUpdate = () => {
        this.fetchInventory();
    }

    playerStartedExpedition = () => {

    }

    render() {
        let tableContent = [];
        this.state.inventory.forEach(item => {
            const quantity = item.quantity;
            const { name, description, price } = item.item;
            tableContent.push([name, description, price, quantity]);
        });
        const tableHead = ["Name", "Description", "Price", "Quantity"];
        const TableElement = <Table tableHead={tableHead} tableContent={tableContent} />;
        return (
            <div>
                <Expedition id={"5f452ae6ea19c81d5433f72d"} playerID={this.state.id} playerUpdate={this.playerUpdate} />
                <Expedition id={"5f452d4fa3a3772410be70c6"} playerID={this.state.id} playerUpdate={this.playerUpdate} />
                <Expedition id={"5f4bb69dbe32e04754c13fdd"} playerID={this.state.id} playerUpdate={this.playerUpdate} />

                <InfoWindow title={"Player Inventory"} windowClass={"player-inventory"} content={TableElement} />
            </div >
        )
    }
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
    console.log(props.elements);
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

export default PlayerHandler;