import React from 'react';
import { ResourceCard } from '../resources/resourceCard.js';
import { Expedition } from "../resources/expedition.js";
import '../resources/resourceCard.css';

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
        let renderstuff = [];
        this.state.inventory.forEach(item => {
            const quantity = item.quantity;
            const { name, description, price, shortname } = item.item;
            renderstuff.push(
                <ResourceCard key={item.item._id} name={name} description={description} price={price} quantity={quantity} shortname={shortname} />
            )
        });
        return (
            <div >
                <Expedition id={"5f452ae6ea19c81d5433f72d"} playerID={this.state.id} playerUpdate={this.playerUpdate} />
                <Expedition id={"5f452d4fa3a3772410be70c6"} playerID={this.state.id} playerUpdate={this.playerUpdate} />
                <Expedition id={"5f452dc8051d1a4b887328cb"} playerID={this.state.id} playerUpdate={this.playerUpdate} />
                <h2>Player Inventory</h2>
                <div className={"resourceCard-container"}>
                    {renderstuff}
                </div>
            </div >
        )
    }
}

export default PlayerHandler;