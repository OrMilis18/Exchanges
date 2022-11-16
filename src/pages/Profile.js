import { deleteUser, sendEmailVerification, updateEmail, updateProfile } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase-config';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { async } from '@firebase/util';

function Profile(){

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [newPhone,setNewPhone] = useState("");
  const [date,setDate] =useState("");

// get current user
  const userRef = doc(db, "users", auth.currentUser.uid);
  const [usersList, setUsersList] = useState([]);
    const usersCollection = collection(db,"users"); 
    useEffect(()=> { 
      const getUsers = async () =>{
        const data = await getDocs(usersCollection);
        setUsersList(data.docs.map((doc) => ({...doc.data(),id: doc.id})));
      };
      getUsers();
      
    })
  
    let user = usersList.find(user => user.uid===auth.currentUser.uid); 
  

  const [image, setImage]=useState(null);
  const [url,setUrl]=useState(null);

//upload profile image
  const handleImageChange = (e) =>{
    if(e.target.files[0]){
      setImage(e.target.files[0]);
    }
  }
  
  const uploadFile = async() => {
    const storageRef = ref(storage, `avatars/${image.name}#${auth.currentUser.displayName}`);
    uploadBytes(storageRef,image).then(()=>{
      getDownloadURL(storageRef,image).then((url)=> {
        setUrl(url);
        alert("up")
      })
      .catch((error)=>{
        console.log(error.message,"error getting the image url");
      })
    })
    .catch((error)=>{
      console.log(error.message);
    });
    updateProfile(auth.currentUser, {
      photoURL:url
    }).then(()=>{

    }).catch((error)=>{
      console.log(error.message);
    });

    const userRef = doc(db, "users", user.id);

 updateDoc(userRef, {
  photoURL: url
});
  };

const [progress, setProgress] = useState(null);
  let navigate = useNavigate();

  // update name
  const updateName = async() =>{
    if(name.length>=2){
    updateProfile(auth.currentUser, {
      displayName:name
    }).then(()=>{
      updateDoc(userRef, {
        name: name
      });
    }).catch((error)=>{
      console.log(error.message);
    });

    
    }
    else{
      alert("השם חייב להכיל 2 תווים לפחות");
    }
  }

  //update email address
  const updateEmailAddress = async() =>{
    updateEmail(auth.currentUser, email).then(() => {
      // Email verification sent!
      alert("התעדכן");
    }).catch((error) => {
      alert(error.code);
    });
  }

  const updatePhone = async() =>{
    await updateDoc(userRef, {
      phone: newPhone
    });
  }

  const updateDate = async() =>{
    await updateDoc(userRef, {
      birthDay: date
    });
  }

//delete user
  const deleteU=async ()=>{
    
    Swal.fire({
      title: 'האם אתה בטוח שברצונך למחוק?',
      text:"אנו נשמח אם תשאר כאן איתנו. אם תמחק את המשתמש לא תהיה לך גישה לפרסומים שלך אך הם עדיין יופיעו",
      showCancelButton: false,
      confirmButtonText: 'אישור',
      cancelButtonText: 'ביטול',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
     
      icon: 'error'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDoc(doc(db,'users',auth.currentUser.uid));
      deleteUser(auth.currentUser).then(() => {
        navigate('/');
    }).catch((error) => { 
      // An error ocurred
      // ...
    });
      } 
    })
  }
  return (
    <div className='container'>
    <h1 className='title'>פרופיל אישי</h1>
    {user&&<div className='card p-5 shadow bg-body rounded'>
      <br/>
      <h1>{user.name} <i className='fa fa-pencil' style={{color:"orangered"}} data-bs-toggle="collapse" href="#name" role="button" aria-expanded="false" aria-controls="collapseExample"/> </h1>
      <div className="collapse" id="name">
        <div className="input-group">
          <input type="text" className="form-control" onChange={(e)=> setName(e.target.value)} placeholder="שם מלא..." />
          <button className="btn btn-primary" type="button" onClick={updateName}>שמור</button>
        </div>
      </div><br/>
      <div className="mb-3">
      <img width={200} src={auth.currentUser.photoURL}/>
      <i className='fa fa-pencil' style={{color:"orangered", fontSize:"50px"}}  data-bs-toggle="collapse" href="#image" role="button" aria-expanded="false" aria-controls="collapseExample"/>  
</div>
  <div className="collapse" id="image">
        <div className="input-group">
          <input type="file" accept='image/*' className="form-control" onChange={handleImageChange} placeholder="שם מלא..." />
          <button className='btn btn-info'><i style={{color:"white"}} className='fa fa-cloud-upload' onClick={uploadFile}/></button>
        </div>
      </div>
<br/><br/> 
      <h3><u>פרטים אישיים</u></h3><br/>
      <div className='container' style={{margin:"auto"}}>
      <p><i className='fa fa-envelope'></i> דוא"ל: {user.email}  <i className='fa fa-pencil' style={{color:"orangered"}}  data-bs-toggle="collapse" href="#email" role="button" aria-expanded="false" aria-controls="collapseExample"/></p>
      <div className="collapse" id="email">
        <div className="input-group">
          <input type="text" className="form-control" onChange={(e)=> setEmail(e.target.value)} placeholder="כתובת מייל..." />
          <button className="btn btn-primary" type="button" onClick={updateEmailAddress}>שמור</button>
        </div>
      </div> 
      <p><i className='fa fa-phone'></i> נייד: {user.phone} <i className='fa fa-pencil' style={{color:"orangered"}}  data-bs-toggle="collapse" href="#phone" role="button" aria-expanded="false" aria-controls="collapseExample"/></p>
      <div className="collapse" id="phone">
        <div className="input-group">
          <input type="text" className="form-control" onChange={(e)=> setNewPhone(e.target.value)} placeholder="טלפון" />
          <button className="btn btn-primary" type="button" onClick={updatePhone}>שמור</button>
        </div>
      </div> 
      <p><i className='fa fa-calendar'></i> תאריך לידה: {user.birthDay} <i className='fa fa-pencil' style={{color:"orangered"}}  data-bs-toggle="collapse" href="#birthDay" role="button" aria-expanded="false" aria-controls="collapseExample"/></p>
      <div className="collapse" id="birthDay">
        <div className="input-group">
          <input type="date" className="form-control" id="birthDay" max="2022-02-01" min="1900-01-1" onChange={(e)=> setDate(e.target.value)} placeholder="טלפון" />
          <button className="btn btn-primary" type="button" onClick={updateDate}>שמור</button>
        </div>
      </div> 
      </div>
      <Link to='/forget'>שנה סיסמה</Link>
      <a href='#' style={{color:"red"}} onClick={deleteU}>מחק חשבון</a>
    </div>}
    </div>
  )
}

export default Profile
