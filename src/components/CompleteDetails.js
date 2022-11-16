import { async } from '@firebase/util';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase-config';

export default function CompleteDetails() {
  const user = doc(db, "users", auth.currentUser.uid);
  const [phone,setPhone] = useState("");
  const [birthDay, setBirthDay] = useState("");
  let navigate = useNavigate();

  const update = async() =>{  
   await updateDoc(user, {
    phone: phone,
    birthDay:birthDay
  });
  alert("כל הפרטים עודכנו בהצלחה")
  navigate('/');
}
  return (
    <div className='container'>
        <h1>ברוכים הבאים לExchanges</h1>
        <br/><br/>
        <h4>על מנת שתוכל ליצור קשר עם אנשים ולבצע החלפות נשמח אם תמלא את הפרטים הבאים:</h4>
        <br/>
        <div className="col-md-4" style={{margin:"auto"}}>
  <label htmlFor="birthDay" className="form-label">תאריך לידה:</label>
  <input type="date" className="form-control" id="birthDay" max="2022-02-01" min="1900-01-1" onChange={(e)=>setBirthDay(e.target.value)} required/>
</div><br/>
  <div className="col-md-4" style={{margin:"auto"}}>
    <label htmlFor="validationDefault05" className="form-label">טלפון:</label>
    <input type="tel" className="form-control" id="validationDefault05"  onChange={(e)=>setPhone(e.target.value)}  required/>
  </div><br/>

<button className='btn btn-primary' onClick={update}>עדכן</button>
    </div>
  )
}
