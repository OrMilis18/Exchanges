import React, { useEffect, useState } from 'react';
import Logo2 from '../Logo2.png';
import {auth, db, provider} from "../firebase-config"
import {sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut} from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom';
import { collection, doc, getDocs, setDoc, Timestamp } from 'firebase/firestore';

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading,setLoading] = useState(true);

  const [usersList, setUsersList] = useState([]);
  const usersCollection = collection(db,"users");

// get users from firebase
  useEffect(()=> {
    const getUsers = async () =>{
      const data = await getDocs(usersCollection);
      setUsersList(data.docs.map((doc) => ({...doc.data(),id: doc.id})));
    };
    getUsers();

  })
//check if user an exist
  const notExist =(userId)=>{
    let check = true;
    usersList.forEach(user=>{
      if(user.uid===userId){
        check = false;
      }
    })
    return check;
  }

// sign in with email and password
  const signIn = () =>{
    setLoading(false)
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    setLoading(true)
    // Signed in 
    const user = userCredential.user;
      alert("connected");
      navigate('/');
    // ...
  })
  .catch((error) => {
    setLoading(true)
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorCode)
  });
}
  let navigate = useNavigate();

  //sign in with google
  const signInWithGoogle = () => {
    signInWithPopup(auth,provider).then((result) => {
      alert("connected");
      navigate('/');
      if(notExist(auth.currentUser.uid)){
         setDoc(doc(db,'users', auth.currentUser.uid),{
          uid: auth.currentUser.uid,
          name:auth.currentUser.displayName,
          email:auth.currentUser.email,
          photoURL:auth.currentUser.photoURL,
          phone:"",
          birthDay:"",
          createdAt: Timestamp.fromDate(new Date()),
        })
        navigate('/complete');
      }
    });
  };




  return (
    <div className='container'>
    <br/>
    <img width="90%" src={Logo2} className="animate__animated animate__jello" alt="..."/>
    <h4 className='animate__animated animate__flipInX'>ברוכים הבאים לExchanges התחברו ותתחילו לבצע חילופים עם אנשים אחרים.</h4><br/>
    <div dir='ltr' className="card" style={{maxWidth: "60rem", margin:"auto", padding:"25px"}}>
    <h1 className='title'>התחברות</h1>
      <div className="form-floating mb-3 mt-3">
        <input onChange={(e)=>{setEmail(e.target.value)}} type="text" name='email' className="form-control" placeholder="email@example.com"/>
        <label htmlFor='email'>Email</label>
      </div>
      <div className="form-floating mb-3 mt-3" style={{textAlign:"left"}}>
        <input onChange={(e)=>{setPassword(e.target.value)}} type="password" name='pswd' placeholder="password" className="form-control" id="password"/><br/>
        <label htmlFor="password">Password</label>
        <Link to="/forget">שכחתי סיסמה</Link><br/>
      <div>   
    </div>
  </div>
  <button style={{width:"200px",margin:"auto"}} className='btn btn-primary' onClick={signIn}>{loading ? "התחבר" : "מתחבר..."}</button>
  
  <br/>
  <h3><u>כניסה באמצעות</u></h3><br/>

  <button style={{width:"200px",margin:"auto"}} className='btn btn-primary' onClick={signInWithGoogle}>Google <i className="fa fa-google"></i></button><br/><br/>
  
  <Link to='/register'>חשבון חדש</Link>
    </div>
    </div>

  )
}

export default Login;