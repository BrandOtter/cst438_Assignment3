import React, { useState } from 'react';
import {REGISTRAR_URL} from "../../Constants";

const AssignmentAdd = ({ secNo, onAddSuccess }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Construct the new assignment object
        const newAssignment = {
            title,
            dueDate,
            secId: secNo, // Not sure why this works... Need to revisit backend
        };

        try {
            const response = await fetch(`${REGISTRAR_URL}/assignments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAssignment),
            });
            if (response.ok) {
                onAddSuccess();
                setTitle('');
                setDueDate('');
            } else {
                throw new Error('Failed to add assignment.');
            }
        } catch (error) {
            console.error('Error adding assignment:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            <button type="submit">Add Assignment</button>
        </form>
    );
};

export default AssignmentAdd;