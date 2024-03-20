import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../../Constants';

const AssignmentGrade = ({ assignmentId, onGradeSuccess }) => {
    const [grades, setGrades] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/assignments/${assignmentId}/grades`);
                if (response.ok) {
                    const data = await response.json();
                    setGrades(data);
                } else {
                    setMessage('Failed to fetch grades.');
                }
            } catch (error) {
                setMessage(`Error: ${error}`);
            }
        };

        if (assignmentId) {
            fetchGrades();
        }
    }, [assignmentId]);

    const handleScoreChange = (event, gradeId) => {
        const newScores = grades.map((grade) => {
            if (grade.gradeId === gradeId) {
                return { ...grade, score: event.target.value };
            }
            return grade;
        });
        setGrades(newScores);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const updatePromises = grades.map((grade) => {
            const url = grade.gradeId ? `${SERVER_URL}/grades/${grade.gradeId}` : `${SERVER_URL}/grades`;
            const method = grade.gradeId ? 'PUT' : 'POST';
            const body = grade.gradeId ? { score: grade.score } : {
                score: grade.score,
                assignmentId: assignmentId,
                // enrollmentId needs to be known for new grades, ensure it's provided somehow
                enrollmentId: grade.enrollmentId,
            };

            return fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
        });

        try {
            // Wait for all grade updates/creations to complete
            await Promise.all(updatePromises);
            alert('Grades updated successfully!');
            onGradeSuccess(); // This function should be passed as a prop, as done in your AssignmentsView component
        } catch (error) {
            console.error('Error updating grades:', error);
            alert('Failed to update grades.');
        }
    };


    return (
        <>
            <h3>Grades for Assignment {assignmentId}</h3>
            <form onSubmit={handleSubmit}>
                <table>
                    <thead>
                    <tr>
                        <th>Grade ID</th>
                        <th>Student Name</th>
                        <th>Student Email</th>
                        <th>Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {grades.map((grade) => (
                        <tr key={grade.gradeId}>
                            <td>{grade.gradeId}</td>
                            <td>{grade.studentName}</td>
                            <td>{grade.studentEmail}</td>
                            <td>
                                <input
                                    type="text"
                                    name="score"
                                    value={grade.score}
                                    onChange={(event) => handleScoreChange(event, grade.gradeId)}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <button type="submit">Update Grades</button>
            </form>
            {message && <p>{message}</p>}
        </>
    );
};

export default AssignmentGrade;