import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { REGISTRAR_URL } from '../../Constants';
import AssignmentAdd from './AssignmentAdd';
import AssignmentGrade from './AssignmentGrade';
import AssignmentUpdate from './AssignmentUpdate';

const AssignmentsView = (props) => {
    const [assignments, setAssignments] = useState([]);
    const [message, setMessage] = useState('');
    const [gradingAssignmentId, setGradingAssignmentId] = useState(null);


    const location = useLocation();
    const { secNo } = location.state;

    const fetchAssignments = useCallback(async () => {
        try {
            const jwt = sessionStorage.getItem('jwt');
            const url = `${REGISTRAR_URL}/sections/${secNo}/assignments`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                }
            });
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

    const save = (assignment) => {
        fetch (`${REGISTRAR_URL}/assignments`, 
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          }, 
          body: JSON.stringify(assignment),
        })
        .then(response => response.json() )
        .then(data => {
            setMessage("Assignment saved");
            fetchAssignments(secNo);
        })
        .catch(err => setMessage(err));
    }
    

    const handleDelete = async (assignmentId) => {
        console.log('Delete:', assignmentId);
        try {
            const jwt = sessionStorage.getItem('jwt');
            const url = `${REGISTRAR_URL}/assignments/${assignmentId}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                }
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
                {assignments.map((a) => (
                    <tr key={a.assignmentId}>
                        <td>{a.assignmentId}</td>
                        <td>{a.title}</td>
                        <td>{a.dueDate}</td>                        
                        <td><button onClick={() => handleGrade(a.assignmentId)}>Grade</button></td>
                        <td><AssignmentUpdate assignment={a} save={save} onUpdateSuccess={fetchAssignments} /></td>
                        <td><button onClick={() => handleDelete(a.assignmentId)}>Delete</button></td>                        
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssignmentsView;