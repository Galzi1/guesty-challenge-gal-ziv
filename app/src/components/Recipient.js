import React from 'react';

export default function Recipient(props) {
    const {name, email_address} = props;

    return (
        <div>
            <ul>
                <li>
                    <span>{name}</span>
                </li>
                <li>
                    <span>{email_address}</span>
                </li>
            </ul>
        </div>
    );
};