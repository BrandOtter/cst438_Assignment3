import React, {useState, useEffect} from 'react';
import { SERVER_URL } from '../../Constants';

// students gets a list of all courses taken and grades
// use the URL /transcript?studentId=
// the REST api returns a list of EnrollmentDTO objects 
// the table should have columns for 
//  Year, Semester, CourseId, SectionId, Title, Credits, Grade

const Transcript = (props) => {
    const headers = ['Year', 'Semester', 'CourseId', 'SectionId', 'Title', 'Credits', 'Grade'];

    const [transcript, setTranscript] = useState([]);
    const [message, setMessage] = useState('');

    const [studentId, setID] = useState({id:3})

    const fetchTranscript = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/transcripts?studentId=` + studentId.id);
            if (response.ok) {
                const transcript = await response.json();
                setTranscript(transcript); 

                // Check if there are any null values and replace
                for(var i = 0; i < transcript.length; i++){
                    if(transcript[i].grade == null){
                        const newData = [...transcript];
                        newData[i].grade = 'No Grade';
                        setTranscript(newData);
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

    useEffect( () => {
        fetchTranscript();
    }, []);
     
    return(
        <div> 
           <h3>Transcript</h3>
           <h4>{message}</h4>
           <table className="Center"> 
            <thead>
                <tr>
                    {headers.map((t, idx) => (<th key={idx}>{t}</th>))}
                </tr>
            </thead>
            <tbody>
                {transcript.map((t) => (
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