import React from 'react';

class PlayerHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: 'Default Player',
            gold: 0,
            inventory: [],
        }
    }

    fetchInventory = async () => {
        try {
            const data = await fetch(`http://localhost:8080/players/${this.state.id}`);
            const dataText = await data.json();
            console.log(dataText);
            // this.setState({
            //     inventory: dataText,
            // });
            console.log("API was called")
            console.log(this.state);
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        let renderstuff = [];

        this.state.inventory.forEach(item => {
            renderstuff.push(
                <div>
                    <p>Name</p>
                    <p>Quantity</p>
                    <p>Price</p>
                </div>
            )
        });
        return (
            <div>
                {renderstuff}
            </div>
        )
    }
}

export default PlayerHandler;