import React from 'react';
import './navigation.css';

function Navigation(props) {
    let pageLinks = [];
    props.pages.forEach(page => {
        pageLinks.push(<li key={page}><a href={`#${page}`} onClick={() => props.pageChange(page)} >{page}</a></li>)
    });

    return (
        <ul className={"nav-ul"}>
            {pageLinks}
        </ul>
    );
}

export default Navigation;