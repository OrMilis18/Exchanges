import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Post from '../components/Post';
import { auth, db } from '../firebase-config';

export default function MyPosts() {
    const [postList, setPostList] = useState([]);
    const postCollection = collection(db,"posts");
  
    const [usersList, setUsersList] = useState([]);
    const usersCollection = collection(db,"users");
    
    const [user,setUser] = useState();
    
     
    //get my posts from firebase
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

    //delete post
    const deletePost = async (id) =>{
        // eslint-disable-next-line no-restricted-globals
        if(confirm("האם אתה בטוח שברצונך למחוק?")){
          const postDoc = doc(db, "posts",id);
          await deleteDoc(postDoc); 
        }
    }
  
  return (
    <div className='container'>
        <h1 className='title'>הפרסומים שלי</h1>
        <br/>
        {user&& postList.map((post)=>(
          post.author.id===auth.currentUser.uid&&
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
          <><button style={{width:"100px",margin:"auto", position:"absolute", left:"3%",bottom:"70px"}} type="button" className="btn btn-danger" onClick={()=> {deletePost(post.id)}}>
        <i className="fa fa-trash"/>
        </button> <Link style={{width:"100px", position:"absolute", left:"3%",bottom:"3%"}} className='btn btn-warning' to={`/edit/${post.id}`}><i className='fa fa-pencil'></i></Link></>
          </div>
        ))}
    </div>
  )
}
