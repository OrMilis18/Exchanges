import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import Post from '../components/Post';
import { auth, db } from '../firebase-config';
import emailjs from 'emailjs-com';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

function Offers() {
  const [offerList, setOfferList] = useState([]);
  const offerCollection = collection(db,"offers");

  const [postList, setPostList] = useState([]);
  const postCollection = collection(db,"posts");

  const [tab,setTab] = useState("my");

  const [usersList, setUsersList] = useState([]);
   const usersCollection = collection(db,"users"); 
    
   let navigate = useNavigate();

    let user = usersList.find(user => user.uid===auth.currentUser.uid); 
  
//get offers,posts and current user
  useEffect(()=> {
    const getOffers = async () =>{
      const data = await getDocs(offerCollection);
      setOfferList(data.docs.map((doc) => ({...doc.data(),id: doc.id})));
    };
    getOffers();

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
    
  })

//delete offer
  const deleteOffer = async (id) =>{
   
    Swal.fire({
      title: 'לדחות את ההצעה?',
      text:"ברגע שתדחה את ההצעה לא תוכל להתחרט",
      showCancelButton: false,
      confirmButtonText: 'אישור',
      cancelButtonText: 'ביטול',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      icon: 'warning'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('ההצעה נדחתה', '', 'success');
        const docRef = doc(db, "offers", id);
        updateDoc(docRef, {
        offerStatus: false
      });
      } 
    })
  }
  // lets make a deal function
  const deal = async (name,email,id) =>{

    const docRef = doc(db, "offers", id);
    await updateDoc(docRef, {
      offerStatus: true,
      contact:{
        name:user.name,
        phone:user.phone,
        email:user.email
      }
    });

    emailjs.send("service_yvef34f","template_ia8miic",{
      user:user.name,
      name:name,
      phone:user.phone,
      email:user.email,
      to_email: email

    },"NIMKJhNj_44DiicDP").then(res=>{
      console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'הפרטים נשלחו',
        text:'פרטי יצירת קשר נשלחו למייל של מציע התמורה. המתן שיצור איתך קשר ובצעו את ההחלפה כמתוכנן'
      })
    }).catch(err=> console.log(err));
  }
  
  return (
    <div className='container'><br/>
    <h1 className='title'>הצעות</h1><br/>

    <a className={tab=="my" && "title"} style={{margin:"50px",fontSize:"20px"}} onClick={()=>setTab("my")}>הציעו לי</a> <a className={tab=="others" && "title"} style={{margin:"50px",fontSize:"20px"}} onClick={()=>setTab("others")}> אני הצעתי </a><br/>
      <br/>
      {tab=="my"&&postList.map((post)=>(
        
        post.author.id===auth.currentUser.uid &&

        <div className="accordion" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#"+post.id} aria-expanded="true" aria-controls="collapseOne">
                 <img style={{padding:"1%",maxHeight:"100px"}} src={post.urls[0]} /> <h4>{post.itemName}</h4> <h4 className='count'> {offerList.filter((offer)=>(
                  (offer.to===auth.currentUser.uid && offer.toPost===post.id)
                )).length}</h4>
              </button>
            </h2>
            <div id={post.id} className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                {offerList.map((offer)=>(
                  (offer.to===auth.currentUser.uid && offer.toPost===post.id)&&
                  <>
                  <div style={{padding:"10px", textAlign:"right"}}>
        <img className='avatar' style={{borderRadius:"40px"}} src={offer.author.photo}/>
        <h5 style={{display:"inline-block",padding:"10px"}} >{offer.author.name}</h5>
         
        </div>
                  <div className='card mb-3 shadow bg-body rounded' style={{padding:"30px"}}>
         {offer&&!offer.money&&<Post
          author={offer.author.name} 
          name={offer.itemName}
          description={offer.description}
          worth={offer.worth}
          location={offer.location} 
          status={offer.status}
          images={offer.urls}
          createdAt={offer.createdAt}
         />||<h1>תמורה כספית: {offer.amount}</h1>}
          {offer.offerStatus==="waiting"?<div>
          <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target={"#"+offer.id} >עשינו עסק</button> |
          <button className='btn btn-secondary' onClick={()=>deleteOffer(offer.id)}>לא תודה</button>
          </div>: offer.offerStatus? <div className="alert alert-success" role="alert">
  קיבלת את ההצעה - נשלחו פרטי יצירת קשר
</div>: <div className="alert alert-danger" role="alert">
  דחית הצעה זו
</div>}
         </div> 
         {/* <!-- Modal --> */}
          <div className="modal fade" id={offer.id} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">ביצוע החלפה</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <h4>איזה כיף! אתה עומד לבצע חילוף עם {offer.author.name}</h4>
                  <p>ברגע שתאשר ישלחו פרטי יצירת הקשר שהגדרת (טלפון ומייל), ונותר רק להמתין שהמשתמש יצור עמך קשר.</p><br/>
                  <p><b>שים לב!</b> הפרסום שלך ישאר באתר עד שתבצעו את החילוף בניכם באופן סופי ואז כדאי למחוק את הפרסום כדי להמנע מפניות לא רלוונטיות.</p><br/>
                  <p>כדאי לוודא שכל הפרטים מהימנים לפני ביצוע החילוף ושהוא אכן מתאים לשני הצדדים.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">ביטול</button>
                  <button type="button" className="btn btn-primary" onClick={()=>deal(offer.author.name,offer.author.email,offer.id)}>אישור</button>
                </div>
              </div>
            </div>
          </div>       
         </>))}
              </div>
            </div>
          </div>
        </div>
     

      ))}
      {tab=="others"&&
        <div>
        <table className="table">
            <thead>
              <tr>
                <th scope="col">תאריך</th>
                <th scope="col">הצעת</th>
                <th scope="col">למי</th>
                <th scope="col">תמורת</th>
                <th scope="col">סטטוס</th>
              </tr>
            </thead>
            <tbody>
      {offerList.map((offer)=>(
        (offer.author.id==auth.currentUser.uid)&&
              <tr>
                <td>{offer.createdAt.toDate().toLocaleDateString()}</td>
                <td>{offer.itemName&& offer.itemName||<p>{offer.amount} <i className='fa fa-ils'/></p>}</td>
                <td>{postList.find((post)=>post.id==offer.toPost).author.name}</td>
                <td>{postList.find((post)=>post.id==offer.toPost).itemName} </td>
                <td>{offer.offerStatus==="waiting"? <p > ממתין <i style={{color:"orange"}} className='fa fa-clock-o'></i> </p> : 
                offer.offerStatus? 
                <div>
                <p> התקבלה <i className='fa fa-check-circle-o' style={{color:"green"}}/></p>
                <a href=''  data-bs-toggle="modal" data-bs-target={"#contact"+offer.id}>פרטים</a>
                {/* <!-- Modal --> */}
                <div className="modal fade" id={"contact"+offer.id} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">פרטי יצירת קשר</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        <h1>{offer.contact.name}</h1>
                        <p>נייד: {offer.contact.phone}</p>
                        <p>מייל: {offer.contact.email}</p>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">אישור</button>
                      </div>
                    </div>
                  </div>
                </div>
                      </div> : <p> נדחתה <i className='fa fa-close' style={{color:"red"}}/></p> }</td>
              </tr>
      ))}
            </tbody>
          </table>
        </div>
      
      }
    </div>
  )
}

export default Offers