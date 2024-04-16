import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { REGISTRAR_URL } from '../../Constants';
import AssignmentAdd from './AssignmentAdd';
import AssignmentGrade from './AssignmentGrade';

const AssignmentsView = (props) => {
    const [assignments, setAssignments] = useState([]);
    const [message, setMessage] = useState('');
    const [gradingAssignmentId, setGradingAssignmentId] = useState(null);

    const location = useLocation();
    const { secNo } = location.state;

    const fetchAssignments = useCallback(async () => {
        try {
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch(`${REGISTRAR_URL}/sections/${secNo}/assignments`,
                {headers: {
                        'Authorization': `Bearer ${jwt}`,
                    }});
            if (response.ok) {
                const data = await response.json();
                setAssignments(data);
            } else {
                setMessage('Failed to fetch assignments.');
            }
        } catch (error) {
            setMessage(`Error: ${error}`);
        }
    }, [secNo]); // secNo is the dependency

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]); // fetchAssignments is stable now

    const handleGrade = (assignmentId) => {
        setGradingAssignmentId(assignmentId);
    };

    const handleEdit = (assignmentId) => {
        console.log('Edit:', assignmentId);
        // Implementation for editing an assignment
    };

    const handleDelete = async (assignmentId) => {
        console.log('Delete:', assignmentId);
        try {
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch(`${REGISTRAR_URL}/assignments/${assignmentId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                        'Content-Type': 'application/json',
                    },
                });
            if (response.ok) {
                setMessage("Assignment deleted");
                fetchAssignments();
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    };

    return (
        <div>
            <h3>Assignments</h3>
            <h4>{message}</h4>
            <AssignmentAdd secNo={secNo} onAddSuccess={fetchAssignments} />
            {gradingAssignmentId && (
                <div>
                    <button onClick={() => setGradingAssignmentId(null)}>Back to Assignments List</button>
                    <AssignmentGrade assignmentId={gradingAssignmentId} onGradeSuccess={() => {
                        setGradingAssignmentId(null); // Reset after grading
                        fetchAssignments(); // Refresh assignments list
                    }} />
                </div>
            )}
            <table className="Center" style={{ marginTop: '20px' }}>
                <thead>
                <tr>
                    <th>Assignment ID</th>
                    <th>Title</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {assignments.map((assignment) => (
                    <tr key={assignment.assignmentId}>
                        <td>{assignment.assignmentId}</td>
                        <td>{assignment.title}</td>
                        <td>{assignment.dueDate}</td>
                        <td>
                            <button onClick={() => handleGrade(assignment.assignmentId)}>Grade</button>
                            <button onClick={() => handleEdit(assignment.assignmentId)}>Edit</button>
                            <button onClick={() => handleDelete(assignment.assignmentId)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssignmentsView;