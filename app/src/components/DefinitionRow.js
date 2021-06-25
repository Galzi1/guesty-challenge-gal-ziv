import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Recipient from './Recipient';
import Granularity from './Granularity';

export default function DefinitionRow(props) {
    const {title, body, recipients, start_datetime, end_datetime, granularity, treatment_datetime} = props.definition;

    const renderRecipients = (_recipients) => {
        if (_recipients && Array.isArray(_recipients)) {
            return _recipients.map((recp, index) => {
                return <Recipient key={index} {...recp}/>
            });
        };

        return null;
    };

    return (
        <TableRow>
            <TableCell component="th" scope="row">
                {title}
            </TableCell>
            <TableCell>{body}</TableCell>
            <TableCell>{renderRecipients(recipients)}</TableCell>
            <TableCell>{start_datetime}</TableCell>
            <TableCell>{end_datetime}</TableCell>
            <TableCell>
                <Granularity {...granularity}/>
            </TableCell>
            <TableCell>{treatment_datetime}</TableCell>
        </TableRow>
    );
};