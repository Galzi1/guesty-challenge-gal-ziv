import React, {useEffect, useState} from 'react';
import DefinitionsTable from './DefinitionsTable';
import Button from '@material-ui/core/Button';
import {getAllDefinitions, updateDefinitions} from '../services/DefinitionsService';
import {generateDefinitions} from '../utils/DefinitionsGenerator';
import TreatedDefinitionsModal from './TreatedDefinitionsModal';

export default function DefinitionsContext() {
    const [definitions, setDefinitions] = useState([]);

    const getAllDefinitionsFromServer = () => {
        getAllDefinitions().then((res) => {
            setDefinitions(res);
        });
    };

    useEffect(() => {
        const interval = setInterval(getAllDefinitionsFromServer, 2000);
        return () => clearInterval(interval);
    });

    const updateDefinitionsInServer = (_definitions) => {
        updateDefinitions(_definitions).then((res) => {
            getAllDefinitionsFromServer();
        });
    };
    
    return (
        <div>
        <DefinitionsTable definitions_collection={definitions}/>
        <br/>
        <Button variant="contained" onClick={() => { updateDefinitionsInServer(generateDefinitions()); }}>Generate</Button>
        <TreatedDefinitionsModal />
        </div>
    );
}
