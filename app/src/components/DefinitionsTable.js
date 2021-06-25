import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DefinitionRow from './DefinitionRow';

export default function DefinitionsTable(props) {
    const {definitions_collection} = props;

    const renderDefinitions = (_definitions) => {
        if (_definitions && Array.isArray(_definitions)) {
            return _definitions.map((def, index) => {
                return <DefinitionRow key={index} definition={def}/>
            });
        };

        return null;
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Body</TableCell>
                        <TableCell>Recipients</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Granularity</TableCell>
                        <TableCell>Treatment Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {renderDefinitions(definitions_collection)}
                </TableBody>
            </Table>
        </TableContainer>
    );
};