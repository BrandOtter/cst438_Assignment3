import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const AssignmentUpdate = ({ assignment, updateAssignment, deleteAssignment }) => {
    const [open, setOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [editMessage, setEditMessage] = useState('');
    const [currentAssignment, setCurrentAssignment] = useState({
        assignmentId: '',
        title: '',
        dueDate: ''
    });

    const editOpen = () => {
        setOpen(true);
        setEditMessage('');
        setCurrentAssignment(assignment);
    };

    const editClose = () => {
        setOpen(false);
        setCurrentAssignment({
            assignmentId: '',
            title: '',
            dueDate: ''
        });
    };

    const handleFieldChange = (event) => {
        setCurrentAssignment({ ...currentAssignment, [event.target.name]: event.target.value });
    };

    const onSave = () => {
        if (!currentAssignment.title || !currentAssignment.dueDate) {
            setEditMessage('Title and due date must be provided.');
        } else {
            updateAssignment(currentAssignment);
            editClose();
        }
    };

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
                        value={currentAssignment.assignmentId}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        style={{ padding: 10 }}
                        autoFocus
                        fullWidth
                        label="Title"
                        name="title"
                        value={currentAssignment.title}
                        onChange={handleFieldChange}
                    />
                    <TextField
                        style={{ padding: 10 }}
                        fullWidth
                        label="Due Date"
                        type="date"
                        name="dueDate"
                        value={currentAssignment.dueDate}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleFieldChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={editClose}>Close</Button>
                    <Button color="primary" onClick={onSave}>Save</Button>
                    <Button color="error" onClick={onDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AssignmentUpdate;