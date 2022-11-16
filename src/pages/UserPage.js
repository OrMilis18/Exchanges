import { arrayUnion, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Post from '../components/Post';
import { auth, db } from '../firebase-config';
import Swal from 'sweetalert2/dist/sweetalert2.js';


export default function UserPage() {
    let params = useParams();
    const docRef = doc(db, "users", params.id);
    const [user,setUser]= useState();

    const [postList, setPostList] = useState([]);
    const postCollection = collection(db,"posts");

    useEffect(()=> { 
        const getUser = async () =>{
            const docSnap = await getDoc(docRef);
          setUser(docSnap.data());
        };
        getUser();
        
        const getPosts = async () =>{
            const data = await getDocs(postCollection);
            setPostList(data.docs.map((doc) => ({...doc.data(),id: doc.id})));
          };
          getPosts();
      })
    
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
    
  return (
    <>{user&&<div className='container'>
        <img  className='avatar' style={{borderRadius:"40px"}} src={user.photoURL}/>
        <h2 style={{display:"inline-block",padding:"10px"}} >{user.name}</h2>
        <hr/>
        <h5>פרסומים</h5>
        {user&& postList.map((post)=>(
          post.author.id===params.id&&
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
          {auth.currentUser && post.author.id!==auth.currentUser.uid && (<><Link style={{width:"150px",margin:"auto", position:"absolute", left:"3%",bottom:"70px"}} to={`/sendoffer/${post.id}`} className='btn btn-primary' target='_top'>הצע תמורה</Link>          <button className='btn btn-info' style={{width:"100px", position:"absolute", left:"3%",bottom:"3%"}} onClick={()=>Like(post.id)}><i className="fa fa-heart"></i></button>
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
        ))}

    </div>}</>
  )
}
