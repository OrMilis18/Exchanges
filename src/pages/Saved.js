import { arrayRemove, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Post from '../components/Post';
import { AuthContext } from '../context/auth';
import { auth, db } from '../firebase-config';

export default function Saved() {

  const [postList, setPostList] = useState([]);
  const postCollection = collection(db,"posts");

  const [usersList, setUsersList] = useState([]);
  const usersCollection = collection(db,"users");
  
  const [user,setUser] = useState();
  
   
  // get the posts that i like
  useEffect(()=> { 
    const getPosts = async () =>{
      const data = await getDocs(postCollection);
      setPostList(data.docs.map((doc) => ({...doc.data(),id: doc.id})));
    };
    getPosts();
    const getUsers = async () =>{
        const data = await getDocs(usersCollection);
        setUsersList(data.docs.map((doc) => ({...doc.data(),id: doc.id})));
      };
      getUsers();
      setUser(usersList.find(user => user.uid===auth.currentUser.uid));
  })

//unlike post
  const unLike = async(postId) =>{
    updateDoc(doc(db,'users', auth.currentUser.uid),{
      postThatILike: arrayRemove(postId)
    })
    alert("press");
  } 
  return (
    <div className='container'>
        <h1 className='title'>פרסומים שאהבתי</h1>
        {user&&user.postThatILike && postList.map((post)=>(
          user.postThatILike.includes(post.id)&&
          <>
          <div style={{padding:"10px", textAlign:"right"}}>
        <img className='avatar' style={{borderRadius:"40px"}} src={post.author.photo}/>
        <h5 style={{display:"inline-block",padding:"10px"}} >{post.author.name}</h5>
         
        </div>
          <div className="card mb-3 shadow bg-body rounded" key={post.id}>
          <Post
          id={post.id} 
          author={post.author.name} 
          name={post.itemName}
          description={post.description}
          worth={post.worth}
          location={post.location} 
          tags={post.tags}
          status={post.status}
          images={post.urls}
          createdAt={post.createdAt}
          />
          
           {user && post.author.id!==user.uid && (<><Link style={{width:"200px",margin:"auto", position:"absolute", left:"3%",bottom:"70px"}} to={`/sendoffer/${post.id}`} className='btn btn-primary'>הצע תמורה</Link>          <button className='btn btn-info' style={{width:"100px", position:"absolute", left:"3%",bottom:"3%"}} onClick={()=>unLike(post.id)} >הסר</button></>
)}
          </div>
          </>
        )) }
        
    </div>
  )
}
