import React, {useState, useEffect} from 'react';
import { REGISTRAR_URL} from '../../Constants';

// students gets a list of all courses taken and grades
// use the URL /transcript?studentId=
// the REST api returns a list of EnrollmentDTO objects 
// the table should have columns for 
//  Year, Semester, CourseId, SectionId, Title, Credits, Grade

const Transcript = (props) => {
    const headers = ['Year', 'Semester', 'CourseId', 'SectionId', 'Title', 'Credits', 'Grade'];

    const [message, setMessage] = useState('');   
    const [courses, setCourses] = useState([]);

    const fetchTranscript = async () => {
        try {
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch(`${REGISTRAR_URL}/transcripts`,
            {headers: {
                'Authorization': jwt,
            }});
            if (response.ok) {
                const transcript = await response.json();
                setCourses(transcript);
                
            } else {
                const json = await response.json();
                setMessage("reponse error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }        
    }

    useEffect( () => {
        fetchTranscript();
    }, [])
     
    return(
        <div> 
           <h3>Transcript</h3>
           <h4>{message}</h4>
           {(courses.length > 0) ? (<p>Student id : {courses[0].studentId} <br/>  Student name : {courses[0].name} </p> ) : '' }
           <table className="Center"> 
            <thead>
                <tr>
                    {headers.map((t, idx) => (<th key={idx}>{t}</th>))}
                </tr>
            </thead>
            <tbody>
                {courses.map((t) => (
                    <tr key = {t.enrollmentId}>
                        <td>{t.year}</td>
                        <td>{t.semester}</td>
                        <td>{t.courseId}</td>
                        <td>{t.sectionId}</td>
                        <td>{t.title}</td>
                        <td>{t.credits}</td>
                        <td>{t.grade}</td>
                    </tr>
                ))}
            </tbody>
           </table>
        </div>
    );
}

export default Transcript;