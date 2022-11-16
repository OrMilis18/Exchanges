import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateCurrentUser, updatePhoneNumber, updateProfile } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, db, storage } from '../firebase-config';


function Register() {
  //from details
  const [email, setEmail] = useState("");
  const [mailError, setMailError]= useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError]= useState("");
  const [validatePassword, setValidatePassword] = useState("");
  const [birthDay,setBirthDay]=useState("");
  const [name, setName]=useState("");
  const [phone,setPhone]= useState("");
  const [photo, setPhoto]=useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png");
  const [verify, setVerify]=useState(false);

  //handle password
  const handlePassword = (e) =>{
    if(e.length<8){
      setPasswordError("אורך הסיסמה חייב להכיל בין 8 ל24 תווים ולפחות אות אחת באנגלית ומספר")
    }
    else{
    let letter=false;
    let number=false;
    for (let i = 0; i < e.length; i++) {
      if(e.charAt(i)>=0 && e.charAt(i)<=9){
        number=true;
      }
      if((e.charAt(i)>='a' && e.charAt(i)<='z') ||(e.charAt(i)>='A'&&e.charAt(i)<='Z')){
        letter=true;
      }
      
    }  
    if (letter&&number) {
      setPasswordError("");
      setPassword(e);
    }
    else{
      setPasswordError("אורך הסיסמה חייב להכיל בין 8 ל24 תווים ולפחות אות אחת באנגלית ומספר");
      setPassword()
    }
  }
}

//upload profile image
    const uploadFile = () => {
      const storageRef = ref(storage, `avatars/${file.name}#${name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress ="uploading: "+
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100 +"%";
          console.log("Upload is " + progress + "% done");
          setProgress(progress);
          switch (snapshot.state) { 
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            toast.info("Image upload to firebase successfully");
            setPhoto(downloadUrl);
            alert("set")
          });
        }
      );
    };

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);

  //sign in 
  const signIn = () =>{
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
        alert("connected");
        navigate('/');
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode)
    });
  }
    let navigate = useNavigate();

    //sign up with email and password
  const signUp = async () =>{
    if(name==""||phone==""||birthDay==""||verify===false){
      alert("חובה למלא את כל השדות המסומנים בכוכבית כראוי")
    }
    else{
    try{
    const user = await createUserWithEmailAndPassword(auth,email,password);
    await setDoc(doc(db,'users', user.user.uid),{
      uid: user.user.uid,
      name:name,
      email:email,
      birthDay:birthDay,
      photoURL:photo,
      phone:phone,
      createdAt: Timestamp.fromDate(new Date()),
    })
    alert("משתמש נוצר");
    signIn();
    updateProfile(auth.currentUser,{
      displayName:name,
      photoURL:photo
    })
    }
    catch (error) {
      if(error.code=='auth/email-already-in-use'){
      setMailError("כתובת המייל כבר בשימוש");
      }
      else if(error.code=='auth/invalid-email'){
        setMailError("כתובת מייל לא חוקית");
      }
      else(alert("חובה למלא את כל השדות המסומנים בכוכבית כראוי"))
    }
  }
  }
  return (
    <from action="/action_page.php">
    <div className='container'><br/>
    <div className="card" style={{maxWidth: "60rem", margin:"auto", padding:"25px"}}>
    <h1 className='title'>צור משתמש</h1> 
      <div className="row g-3">
  <div className="col-md-4">
    <label htmlFor="validationDefault01" className="form-label">שם מלא:*</label>
    <input type="text" className="form-control" id="validationDefault01" onChange={(e)=>{setName(e.target.value)}} required/>
  </div>
  
  <div className="col-md-4">
    <label htmlFor="validationDefault03" className="form-label">דוא"ל:*</label>
    <input type="email" className="form-control" id="validationDefault03" onChange={(e)=>{setEmail(e.target.value)}} required/>
    <p style={{color: 'red'}}>{mailError}</p>
  </div>
  
  <div className="col-md-4">
  <label htmlFor="birthDay" className="form-label">תאריך לידה:*</label>
  <input type="date" className="form-control" id="birthDay" max="2022-02-01" min="1900-01-1" onChange={(e)=>{setBirthDay(e.target.value)}} required/>
</div>
  <div className="col-md-4">
    <label htmlFor="validationDefault05" className="form-label">טלפון:</label>
    <input type="tel" className="form-control" id="validationDefault05" onChange={(e)=>{setPhone(e.target.value)}} required/>
  </div>

  <div className="col-md-4">
    <label htmlFor="validationDefault05" className="form-label">סיסמה:*</label>
    <input type={"password"} className="form-control" id="validationDefault05" onChange={(e)=>{handlePassword(e.target.value)}} required/>
    <p style={{color: 'red'}}>{passwordError}</p>
  </div>
  <div className="col-md-4">
    <label htmlFor="validationDefault05" className="form-label">וודא סיסמה:*</label>
    <input type={"password"} className="form-control" id="validationDefault05" onChange={(e)=>{setValidatePassword(e.target.value)}} required/>
  </div>

  <div className="mb-3">
  <label style={{cursor:"pointer"}} className="form-label" htmlFor='profile'><img width={100} src={photo}/></label>
  <input style={{display:"none"}} className="form-control" id='profile' type="file" accept='image/*' onChange={(event) => {setFile(event.target.files[0])}}/>
  <button className='btn btn-info' onClick={uploadFile}><i style={{color:"white"}} className='fa fa-cloud-upload'/></button>
  <p>{progress}</p>
  
</div>

<div className="form-check form-check-reverse">
  <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={()=>setVerify(!verify)} required/>
  <label className="form-check-label" htmlFor="flexCheckDefault">
    *אני מאשר שימוש בפרטי האישיים לצורך שיתוף מידע ושימוש באתר. <br/>אני מאשר שכל הפרטים נכונים.
  </label>
</div>
  
  <div className="col-12">
    <button type='submit' onClick={()=>{(validatePassword===password) ? signUp() : alert("הסיסמאות לא זהות")}} className="btn btn-primary" >צור משתמש</button>
  </div>
</div>
</div>
    </div>
    </from>
  )
}

export default Register