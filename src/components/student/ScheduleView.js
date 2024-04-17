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
    
  // student views their class schedule for a given term

  const [term, setTerm] = useState( {year:'', semester:''  })
  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');

 
  const fetchEnrollments = async () => {
           try {
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch(`${REGISTRAR_URL}/enrollments?studentId=3&year=${term.year}&semester=${term.semester}`,
            {headers: {
                'Authorization': `Bearer ${jwt}`
            }});
          if (response.ok) {
              const data = await response.json();
              setEnrollments(data);
          } else {
              const rc = await response.json();
              setMessage(rc.message);
          }
      } catch (err) {
          setMessage("network error "+err);
      }
  }

  const dropCourse = async (enrollmentId) => {
      try {
          const jwt = sessionStorage.getItem('jwt');
          const response = await fetch(`${REGISTRAR_URL}/enrollments/${enrollmentId}`,
              {                 
                  method: 'DELETE',
                  headers: {
                    'Authorization': jwt,
                    'Content-Type': 'application/json',
                  }, 
              }
            );
          if (response.ok) {
              setMessage("course dropped");
              fetchEnrollments();
          } else {
              const rc = await response.json();
              setMessage("course drop failed "+rc.message);
          }
      } catch (err) {
          setMessage("network error "+err);
      }
  }

  const onDelete = (e) => {
    const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
    const enrollmentId = enrollments[row_idx].enrollmentId;
    confirmAlert({
        title: 'Confirm to drop',
        message: 'Do you really want to drop this course?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => dropCourse(enrollmentId)
          },
          {
            label: 'No',
          }
        ]
      });
  }

  const onChange = (event) => {
      setTerm({...term, [event.target.name]:event.target.value});
  }


  const headings = ["enrollmentId", "secNo", "courseId", "secId", "building", "room", "times",  ""];

  return(
      <div> 
          <h3>Enter year and semester</h3>
          <h4>{message}</h4>
          <table className="Center">
              <tbody>
                  <tr>
                      <td>Year</td>
                      <td><input type="text" name="year" id="year" value={term.year} onChange={onChange} /></td>
                  </tr>
                  <tr>
                      <td>Semester</td>
                      <td><input type="text" name="semester" id="semester" value={term.semester} onChange={onChange} /></td>
                  </tr>
              </tbody>
          </table>
          
          <button type="submit" onClick={fetchEnrollments}>Get Schedule</button>
          <br/> 
          <br/>
          <table className="Center">
              <thead>
                  <tr>
                     { headings.map( (h, idx) => <th key={idx}>{h}</th>) }
                  </tr>
              </thead>
              <tbody>
              { enrollments.map( (s) => 
                  <tr key={s.enrollmentId}>
                      <td>{s.enrollmentId}</td>
                      <td>{s.sectionNo}</td>
                      <td>{s.courseId}</td>
                      <td>{s.sectionId}</td>
                      <td>{s.building}</td>
                      <td>{s.room}</td>
                      <td>{s.times}</td>
                      <td><Button onClick={onDelete}>Drop</Button></td>
                  </tr>
               )}
              </tbody>
          </table>
         
      </div>
  );

}

export default ScheduleView;