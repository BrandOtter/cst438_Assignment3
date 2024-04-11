import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import Button from '@mui/material/Button';
import { GRADEBOOK_URL } from '../../Constants';

// instructor view list of students enrolled in a section 
// use location to get section no passed from InstructorSectionsView
// fetch the enrollments using URL /sections/{secNo}/enrollments
// display table with columns
//   'enrollment id', 'student id', 'name', 'email', 'grade'
//  grade column is an input field
//  hint:  <input type="text" name="grade" value={e.grade} onChange={onGradeChange} />

const EnrollmentsView = (props) => {
    const headers = ['EnrollmentId', 'StudentId', 'Name', 'Email', 'Grade']

    const [enrollments, setEnrollments] = useState([]);
    const [message, setMessage] = useState('');

    const location = useLocation();
    const {secNo, courseId, secId} = location.state;

    const { state } = useLocation();

    const fetchEnrollments = async () => {       
        try {
            const response = await fetch(`${GRADEBOOK_URL}/sections/` + state.newIndex + `/enrollments`);
            if (response.ok) {
                const enrollments = await response.json();
                setEnrollments(enrollments);
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    }

    useEffect( () => {
        fetchEnrollments();
    }, []);

    const saveGrades = async () => {
        try {
            const response = await fetch (
                `${GRADEBOOK_URL}/enrollments`, 
                {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify(enrollments),
                });
            if (response.ok) {
                setMessage("Grades saved");
                fetchEnrollments();
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            } 
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    const onGradeChange = (e) => {
        const copy_enrollments = enrollments.map((x) => x);
        const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
        copy_enrollments[row_idx] = {...(copy_enrollments[row_idx]), grade: e.target.value};
        setEnrollments(copy_enrollments);      
    }

    return(
        <> 
            <h3>{message}</h3>   
            
            { enrollments.length > 0 && 
                <> 
                    <h3> {courseId}-{secId} Enrollments</h3>   
                    
                    <table className="Center" > 
                        <thead>
                        <tr>
                            {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                        </tr>
                        </thead>
                        <tbody>
                        {enrollments.map((e) => (
                                <tr key={e.enrollmentId}>
                                <td>{e.enrollmentId}</td>
                                <td>{e.studentId}</td>
                                <td>{e.name}</td>
                                <td>{e.email}</td>
                                <td><input type="text" name="grade" value={(e.grade)?e.grade:''} onChange={onGradeChange} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Button onClick={saveGrades}>Save Grades</Button>
                </>
            }
        </>
    );
}

export default EnrollmentsView;
