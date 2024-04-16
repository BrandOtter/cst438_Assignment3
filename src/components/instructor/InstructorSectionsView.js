import React, {useState, useEffect} from 'react';
import {Link, useLocation} from "react-router-dom";
import { REGISTRAR_URL } from '../../Constants';

// instructor views a list of sections they are teaching 
// use the URL /sections?email=dwisneski@csumb.edu&year= &semester=
// the email= will be removed in assignment 7 login security
// The REST api returns a list of SectionDTO objects
// The table of sections contains columns
//   section no, course id, section id, building, room, times and links to assignments and enrollments
// hint:  
// <Link to="/enrollments" state={section}>View Enrollments</Link>
// <Link to="/assignments" state={section}>View Assignments</Link>

const InstructorSectionsView = (props) => {
    const headers = ['SectionNo', 'CourseId', 'SecId', 'Building', 'Room', 'Times', '', '']; 
    
    const [sections, setSections] = useState([ ]);
    const [message, setMessage] = useState('');

    // Used to set the secID and be passed to EnrollmentView
    const [indexes, setIndex] = useState({newIndex:''});

    // Use this to call the state from the previous page
    const { state } = useLocation();

    const fetchSections = async () => {
        try {
            const jwt = sessionStorage.getItem('jwt');
            const url = `${REGISTRAR_URL}/sections?year=${state.year}&semester=${state.semester}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`, // Ensure the JWT is sent in the request
                }
            });
            if (response.ok) {
                const sections = await response.json();
                setSections(sections);
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    }

    useEffect( () => {
        fetchSections();
    }, []);

    // This will set the secID based on the enrollment link clicked
    // so EnrollmentView.js will load the correct enrollment. 
    const getSecId = (e) => {
        const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
        indexes.newIndex = sections[row_idx].secNo;
      }
     
    return(
        <div> 
           <h3>Sections</h3>
           <h4>{message}</h4>
           <table className="Center"> 
            <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
            </thead>
            <tbody>
                {sections.map((s) => (
                    <tr key = {s.secNo}>
                        <td>{s.secNo}</td>
                        <td>{s.courseId}</td>
                        <td>{s.secId}</td>
                        <td>{s.building}</td>
                        <td>{s.room}</td>
                        <td>{s.times}</td>
                        <td><Link to="/enrollments" state={{ secNo: s.secNo }}>View Enrollments</Link></td>
                        <td><Link to="/assignments" state={{ secNo: s.secNo }}>View Assignments</Link></td>

                    </tr>
                ))}
            </tbody>
           </table>
        </div>
    );
}

export default InstructorSectionsView;