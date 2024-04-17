import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { REGISTRAR_URL } from '../../Constants';

    const AssignmentUpdate = (props)  => {

    const [open, setOpen] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [assignment, setAssignment] = useState({id:'', courseId:'', secId:' ', title:'', dueDate:''});

    const editOpen = () => {
        setOpen(true);
        setEditMessage('');
        setAssignment(props.assignment);
    };

    const editClose = () => {
        setOpen(false);
        setAssignment({id:'', courseId:'', secId:' ', title:'', dueDate:''});
        setEditMessage('');
    };
    
    const handleFieldChange = (event) => {
        setAssignment({...assignment,  [event.target.name]:event.target.value})
    };

    const onSave = () => {
        saveAssignment(assignment);
        //editClose();
    }

    const saveAssignment = async (assignment) => {
        try {
          const jwt = sessionStorage.getItem('jwt');
          const response = await fetch (`${REGISTRAR_URL}/assignments`, 
            {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json',
              }, 
              body: JSON.stringify(assignment),
            });
          if (response.ok) {
            setEditMessage("assignment saved");
          } else {
            const rc = await response.json();
            setEditMessage(rc.message);
          }
        } catch (err) {
          setEditMessage("network error: "+err);
        }
      }


    return (
        <div>
            <Button onClick={editOpen}>Edit Assignment</Button>
            <Dialog open={open} onClose={editClose}>
                <DialogTitle>Edit Assignment</DialogTitle>
                <DialogContent style={{ paddingTop: 20 }}>
                    <h4>{editMessage}</h4>
                    <TextField
                        style={{ padding: 10 }}
                        fullWidth
                        label="Assignment ID"
                        name="assignmentId"
                        value={assignment.id}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        style={{ padding: 10 }}
                        autoFocus
                        fullWidth
                        label="Title"
                        name="title"
                        value={assignment.title}
                        onChange={handleFieldChange}
                    />
                    <TextField
                        style={{ padding: 10 }}
                        fullWidth
                        label="Due Date"
                        type="date"
                        name="dueDate"
                        value={assignment.dueDate}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleFieldChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={editClose}>Close</Button>
                    <Button color="primary" onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AssignmentUpdate;