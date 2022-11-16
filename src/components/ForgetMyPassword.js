import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../firebase-config';

export default function ForgetMyPassword() {

    const [email,setEmail]= useState("");

    console.log(email);

    //send link to email for reset password
    const resetPassword = () =>{
        sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        alert("קישור לאיפוס הסיסמה נשלח למייל")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorCode);
      });
      }
  return (
    <div className='container' style={{marginTop:"5%"}}>
        <h1 className='title'>איפוס סיסמה</h1><br/>
        <h5>הכנס כתובת מייל אלייה ישלח קישור לאיפוס הסיסמה. (שים לב♥, ייתכן שהמייל נמצא בתיבת ה"ספאם" שלך.)</h5>
        <div className="form-floating mb-3 mt-3" style={{width:"300px", margin:"auto"}}>
        <input type="text" name='email' className="form-control" placeholder="email@example.com" onChange={(e)=>setEmail(e.target.value)}/>
        <label htmlFor='email'>Email</label>
      </div>
      <button className='btn btn-primary' onClick={resetPassword}>אפס סיסמה</button>

    </div>
  )
}
