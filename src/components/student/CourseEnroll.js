import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import {REGISTRAR_URL} from '../../Constants';

// students displays a list of open sections for a 
// use the URL /sections/open
// the REST api returns a list of SectionDTO objects

// the student can select a section and enroll
// issue a POST with the URL /enrollments?secNo= &studentId=3
// studentId=3 will be removed in assignment 7.

const CourseEnroll = (props) => {
     
    const headers = ['SecNo', 'CourseId', 'SecId',  'Year', 'Semester', 'Building', 'Room', 'Times', '', ''];

    const [sections, setSections] = useState([]);
    const [message, setMessage] = useState('');

    const fetchSections = async () => {
      
        try {
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch(`${REGISTRAR_URL}/sections/open`,
            {headers: {
                'Authorization': `Bearer ${jwt}`
            }});
            if (response.ok) {
              const data = await response.json();
              setSections(data);
            } else {
              const rc = await response.json();
              setMessage(rc.message);
            }
          } catch(err) {
            setMessage("network error: "+err);
          }
        
    }

    useEffect( () => {
      fetchSections();
    }, []);
 	  
    const enrollInSection = async (e) => {
      const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
      const secNo = sections[row_idx].secNo;
      const enrollurl = `${REGISTRAR_URL}/enrollments/sections/${secNo}`;
      try {
        const jwt = sessionStorage.getItem('jwt');
        const response = await fetch(enrollurl, 
          { method: 'POST', 
            headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
            }
          }
        );
        
        if (response.ok) {
          setMessage(`Enrolled in Section ${secNo}`);
          fetchSections();
        } else {
          const rc = await response.json();
          setMessage(rc.message);

        }
      } catch(err) {
        setMessage("Error:"+err + enrollurl);
      }

    }
    

    return(
        <div> 
            <h3>Sections</h3>    
          
            <h4>{message}</h4>
            
            <table className="Center" > 
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {sections.map((s) => (
                        <tr key={s.secNo}>
                        <td>{s.secNo}</td>
                        <td>{s.courseId}</td>
                        <td>{s.secId}</td>
                        <td>{s.year}</td>
                        <td>{s.semester}</td>
                        <td>{s.building}</td>
                        <td>{s.room}</td>
                        <td>{s.times}</td>
                        <td><Button onClick={enrollInSection}>Enroll</Button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CourseEnroll;