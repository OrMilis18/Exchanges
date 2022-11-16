import { addDoc, collection, getDocs, Timestamp } from 'firebase/firestore';
import { deleteObject,getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { auth, db, storage } from '../firebase-config';
import {v4} from "uuid";
import Post from '../components/Post';
import Switch from '../assets/switch.png';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';


const initialState = {
  itemName:"",
  worth:"",
  status:"",
  location:"",
  description:"",
};

export default function SendOffer() {
  
  let params = useParams();

 
  const [postList, setPostList] = useState([]);
  const postCollection = collection(db,"posts");

//get the post i want to offer a reward for 
  useEffect(()=> { 
    const getPosts = async () =>{
      const data = await getDocs(postCollection);
      setPostList(data.docs.map((doc) => ({...doc.data(),id: doc.id})));
    };
    getPosts();
    
  })

  let post = postList.find(post => post.id===params.id); 


//handle changes
  const [form, setForm] = useState(initialState);
  const [images, setImages] = useState([]);
  const [urls, setUrls] = useState([]);
  const [progress, setProgress] = useState(null);
  const [offerMoney,setOfferMoney] = useState(false);
  const [amount,setAmount] = useState();

  const handleChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setImages((prevState) => [...prevState, newImage]);
    }
  };

  //upload images
  const handleUpload = () => {
    const promises = [];
    images.map((image) => {
      const storageRef = ref(storage, `images/${auth.currentUser.uid}/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      promises.push(storageRef);
      uploadTask.on(
              "state_changed", 
              (snapshot) => { 
                const progress ="uploading: "+
                  Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100 )+"%";
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
        async () => {
          await 
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            toast.info("Image upload to firebase successfully");
            setUrls((prevState) => [...prevState, downloadUrl]);            
          });
        }
      ); 
    });

    Promise.all(promises) 
      .then(() => console.log("All images uploaded"))
      .catch((err) => console.log(err)); 
  };

  //delete image
  const deleteImage= (img,u) =>{
    console.log(img) 
    const desertRef = ref(storage, `images/${auth.currentUser.uid}/${img}`);
  deleteObject(desertRef).then(() => { 
    alert("delete");
    setUrls(urls.filter(url=>url!==u)); 
    setImages(images.filter(image=>image.name!==img));
    // File deleted successfully
  }).catch((error) => {
    // Uh-oh, an error occurred!
  });
  }
  const {itemName,location,worth,status,description} = form; 

  const [itemError,setItemError] = useState("");
  const [descriptionError,setDescriptionError] = useState("");
  const [amountError,setAmountError] = useState("");

  const offersCollection = collection(db,"offers");
  let navigate = useNavigate();

//send mail to user about offer request
  const sendMail = () =>{

    emailjs.send("service_yvef34f","template_0y15uzi",{
      name:post.author.name,
      to_email:post.author.email,
      itemName:post.itemName
    },"NIMKJhNj_44DiicDP").then(res=>{
      console.log(res);
    }).catch(err=> console.log(err));
  }

  //send the offer
  const createOffer = async () =>{
    try {
      if(offerMoney){
        if(amount>0 && amount>=post.minPrice&& amount<=post.maxPrice){
        await addDoc(offersCollection,{
          amount:amount,
          money:offerMoney,
          createdAt: Timestamp.fromDate(new Date()),
          author: {name: auth.currentUser.displayName, id: auth.currentUser.uid, photo: auth.currentUser.photoURL, email: auth.currentUser.email},
          to: post.author.id,
          toPost: post.id,
          offerStatus: "waiting",
        urls:urls});
        Swal.fire({
          icon: 'success',
          title: 'ההצעה נשלחה בהצלחה',
          text: 'נותר לחכות לתגובת המפרסם. תוכל לעקוב אחר סטטוס ההצעה בדף ההצעות',
        })
          navigate("/");
          sendMail();
        }
        else{
          setAmountError("חובה למלא סכום בטווח המוגדר")
        }
      }
      else{
        if(itemName!="" && description!=""){
      await addDoc(offersCollection,{
        ...form,
        money:offerMoney,
        createdAt: Timestamp.fromDate(new Date()),
        author: {name: auth.currentUser.displayName, id: auth.currentUser.uid, photo: auth.currentUser.photoURL, email: auth.currentUser.email},
        to: post.author.id,
        toPost: post.id,
        offerStatus: "waiting",
      urls:urls});
      Swal.fire({
        icon: 'success',
        title: 'ההצעה נשלחה בהצלחה',
        text: 'נותר לחכות לתגובת המפרסם. תוכל לעקוב אחר סטטוס ההצעה בדף ההצעות',
      })
        navigate("/");
        sendMail();

      }
      else{
        if(itemName==""){setItemError("חובה לתת שם לפריט");}
        if(description==""){setDescriptionError("חובה לתת תיאור לפריט");}
      }
      }
    } catch (error) {
      alert(error.message);
    }
 
  }

  //handle changes
  const handleItemName = (e) => {
    setForm({ ...form, itemName: e.target.value });
  };
  const handleWorth = (e) => {
    setForm({ ...form, worth: e.target.value });
  };
  
  const handleStatus = (e) => {
    setForm({ ...form, status: e.target.value });
  };
  const handleLocation = (e) => {
    setForm({ ...form, location: e.target.value });
  };
  const handleDescription = (e) => {
    setForm({ ...form, description: e.target.value });
  };
  const handleAmount = (e) => {
    setAmount( e.target.value );
  };

  
  return (
    <div className='container'> 
    <br></br> 
         {post && <h1 className='title'>הצע תמורה ל{post.itemName} של {post.author.name}</h1>}

         <div className='container'>
         <div className='card' style={{padding:"30px"}}>
         {post&&<Post
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
         />}
         </div>
         {post&&post.money&& <div><h3>מפרסם הפוסט מקבל גם תמורה כספית</h3><button className='btn btn-outline-secondary' onClick={()=>setOfferMoney(!offerMoney)}>{offerMoney? "הצע פריט כתמורה":<p>הצע תמורה כספית <i style={{color:"green"}} className='fa fa-money'/></p>} </button></div>}
         
         <img style={{margin:"10px"}} width="100px" src={Switch}/>
         {offerMoney? <div className="col-md-3 container">
         <h3>הצעה כספית</h3>

         <p>הסכום המינימלי הוא: {post.minPrice} <br></br>הסכום המקסימלי הוא: {post.maxPrice}</p>
    <label className="form-label">סכום: </label>
    <input type="number" className="form-control" onChange={handleAmount}/><br/>
    <p style={{color: 'red'}}>{amountError}</p>
  </div>:<>
      <div className="row g-3">
  <div className="col-md-6">
    <label className="form-label">שם מוצר</label>
    <input type="text" className="form-control" onChange={handleItemName}/>
    <p style={{color: 'red'}}>{itemError}</p>
  </div>
  <div className="col-md-6">
    <label className="form-label">שווי</label>
    <input type="text" className="form-control" onChange={handleWorth}/>
  </div>
  <div className="col-md-4">
    <label className="form-label">מצב</label>
    <select className="form-select" onChange={handleStatus}>
      <option selected>בחר...</option>
      <option value={"חדש"}>חדש</option> 
      <option value={"כמו חדש"}>כמו חדש</option>
      <option value={"ישן"}>ישן</option>
      <option value={"משומש"}>משומש</option>
    </select>
  </div>
  <div className="col-12">
    <label className="form-label">מיקום</label>
    <input type="text" className="form-control" placeholder="City...,Street..." onChange={handleLocation}/>
  </div>
  <div className="mb-3">
  <label className="form-label">תיאור</label>
  <textarea className="form-control" rows="3" onChange={handleDescription}></textarea>
  <p style={{color: 'red'}}>{descriptionError}</p>
</div>
  
  <div className="mb-3">
  <label className="form-label">העלה תמונות</label>
  <input className="form-control" type="file" accept='image/*' multiple onChange={handleChange}/> 
  <button className='btn btn-info' onClick={handleUpload}><i style={{color:"white"}} className='fa fa-cloud-upload'/></button>
  <p>{progress}</p>
  {urls.map((url, i) => (
    <>
        <img 
          key={i}
          style={{ width: "100px" }}
          src={url || "http://via.placeholder.com/300"}
          alt="firebase-image" 
        />
        
        <button className='btn' onClick={()=>deleteImage(images[i].name,url)}><i className='fa fa-trash' style={{color:"red",fontSize:"x-large"}}/></button>
        </>
      ))}
  
</div>
  
 
</div>
 </>}
 <div className="col-12">
    <button onClick={createOffer} className="btn btn-primary">הצע תמורה</button> 
  </div>
  <br/><br/>
    </div>
</div>
  )
}
