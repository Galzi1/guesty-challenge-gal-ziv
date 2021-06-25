import React, {useState} from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import {treatDefinitions} from '../services/DefinitionsService';
import '../styles/Definitions.css';

export default function TreatedDefinitionsModal() {
    const [treatedDefinitions, setTreatedDefinitions] = useState([]);
    const [totalNum, setTotalNum] = useState(0);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const renderTreatedDefinitions = (_definitions) => {
        if (_definitions && Array.isArray(_definitions)) {
            return _definitions.map((def, index) => {
                return <li>{def._id}</li>
            });
        }

        return null;
    };
    
    const sendTreatDefinitionsToServer = () => {
        treatDefinitions().then((res) => {
            if (res) {
                setTotalNum(res.total_num);
                setTreatedDefinitions(res.treated);
                handleOpen();
            };
        });
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={sendTreatDefinitionsToServer}>Treat Definitions</Button>
            <Modal open={open} onClose={handleClose} className="modal">
                <div className="paper">
                    <span>Definitions: </span>
                    <br/>
                    <ul>
                    {renderTreatedDefinitions(treatedDefinitions)}
                    </ul>
                    <br/>
                    <span>Were treated (out of {totalNum})</span>
                </div>
            </Modal>
        </div>
    );
}