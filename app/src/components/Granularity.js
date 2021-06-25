import React from 'react';

export default function Granularity(props) {
    const {num, units} = props;

    return (
        <div>
            <ul>
                <li>
                    <span>{units}</span>
                </li>
                <li>
                    <span>{num}</span>
                </li>
            </ul>
        </div>
    );
};