import React from 'react';
import './navigation.css';

function Navigation(props) {
    let renderstuff = [];
    props.pages.forEach(page => {
        renderstuff.push(<li key={page}><a href={`#${page}`} >{page}</a></li>)
    });

    return (
        <ul className={"nav-ul"}>
            {renderstuff}
        </ul>
    );
}

export default Navigation;