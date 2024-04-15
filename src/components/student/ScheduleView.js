import React, {useState, useEffect} from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Button from '@mui/material/Button';
import {REGISTRAR_URL} from '../../Constants';

// student can view schedule of sections 
// use the URL /enrollment?studentId=3&year= &semester=
// The REST api returns a list of EnrollmentDTO objects
// studentId=3 will be removed in assignment 7

// to drop a course 
// issue a DELETE with URL /enrollment/{enrollmentId}

const ScheduleView = (props) => {
    const headers = ['EnrollmentId', 'Times', 'CourseId', 'SectionId', 'Year', 'Credits', 'Grade', ''];

    const [schedule, setSchedule] = useState([]);
    const [message, setMessage] = useState('');

    const [studentId, setID] = useState({id:3, year:2024, semester:'Spring'})
    
    const fetchSchedule = async () => {
        try {
            const response = await fetch(`${REGISTRAR_URL}/enrollments?studentId=` + 3 + `&year=` + studentId.year + `&semester=` + studentId.semester);
            if (response.ok) {
                const schedule = await response.json();
                setSchedule(schedule);
                
                // Check if there are any null grade and replace
                for(var i = 0; i < schedule.length; i++){
                    if(schedule[i].grade === null){
                        const newData = [...schedule];
                        newData[i].grade = 'No Grade';
                        setSchedule(newData);
                    }
                } 
                
            } else {
                const json = await response.json();
                setMessage("reponse error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }        
    }

    const deleteCourse = async (courseId) => {
        try {
          const response = await fetch (`${REGISTRAR_URL}/enrollments/` + courseId, 
              {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                }, 
              });
          if (response.ok) {
            setMessage("Course deleted");
            fetchSchedule();
          } else {
            const rc = await response.json();
            setMessage("Delete failed "+rc.message);
          }
        } catch (err) {
          setMessage("network error: "+err);
        }
      }

    const onDelete = (e) => {
        const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
        const enrollmentId = schedule[row_idx].enrollmentId;
        console.log(enrollmentId);
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Do you really want to delete?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => deleteCourse(enrollmentId)
              },
              {
                label: 'No',
              }
            ]
          });
      }

    useEffect( () => {
        fetchSchedule();
    }, []);

    return(
        <div> 
           <h3>Schedule</h3>
           <h4>{message}</h4>
           <table className="Center"> 
            <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
            </thead>
            <tbody>
                {schedule.map((s) => (
                    <tr key = {s.enrollmentId}>
                        <td>{s.enrollmentId}</td>
                        <td>{s.times}</td>
                        <td>{s.courseId}</td>
                        <td>{s.sectionId}</td>
                        <td>{s.year}</td>
                        <td>{s.credits}</td>
                        <td>{s.grade}</td>
                        <td><Button onClick={onDelete}>Delete</Button></td>
                    </tr>
                ))}
            </tbody>
           </table>
        </div>
    );
}

export default ScheduleView;