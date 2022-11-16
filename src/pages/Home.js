import { arrayUnion, collection, deleteDoc, doc, getDocs, increment, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import '../App.css'
import { db,auth } from '../firebase-config';
import Post from '../components/Post';
import { AuthContext } from '../context/auth';
function Home({search,setSearch}) {
  
  
  const {user} = useContext(AuthContext);

  const [postList, setPostList] = useState([]);
  const postCollection = collection(db,"posts");

  const q = query(postCollection, orderBy("createdAt","desc"));


//get posts from firebase
  useEffect(()=> { 
    const getPosts = async () =>{
      const data = await getDocs(q);
      setPostList(data.docs.map((doc) => ({...doc.data(),id: doc.id})));
    };
    getPosts();
    
  },[])
   if (!auth.currentUser){
    const myTimeout = setTimeout(welcome, 5000);
    function welcome (){
      Swal.fire({
        title: 'ברוכים הבאים לExchanges!',
        text: "כדי לבצע חילופים לשמור פוסטים או להציע תמורות עליכם להתחבר",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '<a style="color:white" href="/login">התחבר</a>',
        cancelButtonText: 'אח"כ'
      }).then((result) => {
        if (result.isConfirmed) {
          
        }
      })
      clearTimeout(myTimeout)
      
    }
  }

  

  // like function
  const Like = async(postId) =>{
    updateDoc(doc(db,'users', auth.currentUser.uid),{
      postThatILike: arrayUnion(postId)
    })
    Swal.fire({
  title: 'נוסף לרשימת הפרסומים שאהבת',
  text: 'תוכל לצפות בפרסום  זה שוב מתי שתרצה',
  icon: 'success',
  confirmButtonText: 'אישור'
})
  }
  
  //delete post
  const deletePost = async (id) =>{
   
    Swal.fire({
      title: 'האם אתה בטוח שברצונך למחוק?',
      showCancelButton: false,
      confirmButtonText: 'אישור',
      cancelButtonText: 'ביטול',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
     
      icon: 'warning'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('הפוסט נמחק', '', 'success');
        const postDoc = doc(db, "posts",id);
        deleteDoc(postDoc); 
        
      } 
    })
  }
  return (
    <div className='container'>
    <br/>
      {user && <Link to='/createpost'><button type="button" className="btn btn-primary btn-lg">פרסום חדש</button></Link>}
      <br/><br/>
      {postList.map((post) => ( 
        (post.itemName.includes(search)||post.description.includes(search) || post.tags.includes(search)) &&
        <>
        <div style={{padding:"10px", textAlign:"right",maxWidth:"250px"}}><Link style={{color:"black"}} to={`/userpage/${post.author.id}`}>
        <img className='avatar' style={{borderRadius:"40px"}} src={post.author.photo}/>
        <h5 style={{display:"inline-block",padding:"10px"}} >{post.author.name}</h5>
        </Link>
        </div>
        <div className="card mb-3 shadow bg-body rounded" key={post.id}>
        {user && post.author.id===user.uid && (<><button style={{width:"100px",margin:"auto", position:"absolute", left:"3%",bottom:"70px"}} type="button" className="btn btn-danger" onClick={()=> {deletePost(post.id)}}>
        <i className="fa fa-trash"/>
        </button> <Link style={{width:"100px", position:"absolute", left:"3%",bottom:"3%"}} className='btn btn-warning' to={`/edit/${post.id}`}><i className='fa fa-pencil'></i></Link></>)}
          <Post
          setSearch={setSearch}
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
          {user && post.author.id!==user.uid && (<><Link style={{width:"150px",margin:"auto", position:"absolute", left:"3%",bottom:"70px"}} to={`/sendoffer/${post.id}`} className='btn btn-primary' target='_top'>הצע תמורה</Link>          <button className='btn btn-info' style={{width:"100px", position:"absolute", left:"3%",bottom:"3%"}} onClick={()=>Like(post.id)}><i className="fa fa-heart"></i></button>
          <a href='' style={{color:"red"}} data-bs-toggle="modal" data-bs-target={"#report"+post.id}>דווח על פוסט זה</a>
          {/* <!-- Modal --> */}
          <div className="modal fade" id={"report"+post.id} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">דווח</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        <h3>איזו בעיה מצאת בפרסום? </h3>
                        <p style={{color:"grey"}}>סמן נושא מתאים ותאר את הבעיה בה נתקלת. אנו נבדוק את הפרטים ובמידת הצורך נפעל כדי לפתור אותה</p>
                        <form style={{"textAlign":"right", paddingRight:"10%"}}>
                          <input type="radio" id="report1" name="report" value="אלימות"/>
                          <label htmlFor="report1">אלימות</label><br/>
                          <input type="radio" id="report2" name="report" value="הטרדה"/>
                          <label htmlFor="report2">הטרדה</label><br/>
                          <input type="radio" id="report3" name="report" value="מידע לא נכון"/>
                          <label htmlFor="report3">מידע לא נכון</label><br/>
                          <input type="radio" id="report4" name="report" value="עירום"/>
                          <label htmlFor="report4">עירום</label><br/>
                          <input type="radio" id="report5" name="report" value="ספאם"/>
                          <label htmlFor="report5">ספאם</label><br/>
                          <input type="radio" id="report6" name="report" value="דברי שטנה"/>
                          <label htmlFor="report6">דברי שטנה</label><br/>
                          <input type="radio" id="report7" name="report" value="משהו אחר"/>
                          <label htmlFor="report7">משהו אחר</label><br/><br/>
                          <textarea rows="4" cols="35" placeholder='תאר כאן...'/>
                        </form> 
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">סגור</button>
                        <button type="button" className="btn btn-primary">דווח</button>
                      </div>
                    </div>
                  </div>
                </div>
          </>)}
        </div>
        <br/>

        </>
      ))}

    </div>
  )
}

export default Home