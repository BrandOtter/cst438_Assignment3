import React, { useState } from 'react';
import { REGISTRAR_URL } from "../../Constants";

const AssignmentAdd = ({ secNo, onAddSuccess }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Clear any existing errors
        const newAssignment = { title, dueDate, secId: secNo };

        try {
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch(`${REGISTRAR_URL}/assignments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
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
            setError(error.message || 'Failed to add assignment.');
        }
    };

    return (
        <>
            {error && <p>Error: {error}</p>}
            <form onSubmit={handleSubmit} id="assignment-form">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                <button type="submit">Add Assignment</button>
            </form>
        </>
    );
};

export default AssignmentAdd;