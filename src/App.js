import React, { useState } from 'react';
import './App.css';
import {BrowserRouter ,Routes, Route, Link} from "react-router-dom";
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import Offers from './pages/Offers';
import Header from './components/Header';
import Login from './pages/Login';
import { signOut } from 'firebase/auth';
import {auth} from './firebase-config';
import Register from './pages/Register';
import SendOffer from './pages/SendOffer';
import NotFound from './components/NotFound';
import AuthProvider from './context/auth';
import EditPost from './pages/EditPost';
import CompleteDetails from './components/CompleteDetails';
import Post from './components/Post';
import Saved from './pages/Saved';
import ForgetMyPassword from './components/ForgetMyPassword';
import MyPosts from './pages/MyPosts';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import UserPage from './pages/UserPage';

function App() {

  const [search,setSearch]=useState("");

//sign out
  const signUserOut = () => {
    signOut(auth).then(()=>{
      localStorage.clear();
      alert("log out")
      window.location.pathname="/login";
    })
  }

 
  return (
    //router 
    <AuthProvider>
    <BrowserRouter>
    <Header  
      signUserOut = {signUserOut}
      setSearch={setSearch}
    /><br></br><br/><br/><br/>
      <Routes>
        <Route path='/' element={<Home search={search} setSearch={setSearch}/>}/>
        <Route path='/createpost' element={<CreatePost/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/saved' element={<Saved/>}/>
        <Route path='/myposts' element={<MyPosts/>}/>
        <Route path='/offers' element={<Offers/>}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/sendoffer/:id' element={<SendOffer/>}/>
        <Route path='/edit/:id' element={<EditPost/>}/> 
        <Route path='/complete' element={<CompleteDetails/>}/>
        <Route path='/forget' element={<ForgetMyPassword/>}/>
        <Route path='/userpage/:id' element={<UserPage/>}/>
        <Route path='*' element={<NotFound/>}/>

      </Routes>
    </BrowserRouter><br/>
    <p style={{position:"fixed", bottom:"0", margin:"auto",backgroundColor:"white", width:"100%", borderTop:"grey solid 1px"}}>זכויות שמורות ©</p>
    </AuthProvider>
  );
}

export default App;
