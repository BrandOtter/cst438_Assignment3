import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import { SERVER_URL } from '../../Constants';

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

    const onGradeChange = (event) => {
        setEnrollments({...enrollments, [event.target.name]:event.target.value});
    }

    const location = useLocation();
    const {secNo, courseId, secId} = location.state;

    const fetchEnrollments = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections/` + secNo + `/enrollments`);
            if (response.ok) {
                const enrollments = await response.json();
                setEnrollments(enrollments);
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message + location.secNo);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    }

    useEffect( () => {
        fetchEnrollments();
    }, []);

    return(
        <div> 
            <h3>Enrollments</h3>   
            <h4>{message}</h4>
            <table className="Center">
                <thead>
                    <tr>
                        {headers.map((e, idx) => (<th key={idx}>{e}</th>))}
                    </tr>
                </thead>
                <tbody>
                    {enrollments.map((e) => (
                        <tr key = {e.enrollmentId}>
                            <td>{e.enrollmentId}</td>
                            <td>{e.studentId}</td>
                            <td>{e.name}</td>
                            <td><input type="text" name="grade" value={e.grade} onChange={onGradeChange} /></td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EnrollmentsView;
