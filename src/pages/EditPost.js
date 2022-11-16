import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { auth, db, storage } from '../firebase-config';



export default function EditPost() {
    let params = useParams();

    const [post,setPost] = useState();
    const docRef = doc(db, "posts", params.id);

  useEffect(()=> { 
    const getPost = async () =>{
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPost(docSnap.data());

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    getPost();
  })  
  //for Changes
  const [itemName,setItemName] = useState("");
  const [description,setDescription] = useState("");
  const [worth,setWorth] = useState("");
  const [location,setLocation] = useState("");
  const [status,setStatus] = useState("");
  const [tags,setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [urls, setUrls] = useState([]);
  const [progress, setProgress] = useState(null);

  const [loading,setLoading] = useState(false);

//array of new images
  const handleChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setImages((prevState) => [...prevState, newImage]);
    }
  };
//upload new images
  const handleUpload = () => {
    const promises = [];
    images.map((image) => {
      const storageRef = ref(storage, `images/${auth.currentUser.uid}/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      promises.push(storageRef);
      uploadTask.on(
              "state_changed", 
              (snapshot) => { 
                setLoading(true);
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
                if (progress=="uploading: 100%"){
                  setLoading(false);
                }
              },
              (error) => {
                console.log(error);
              },
        async () => {
          await 
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            updateDoc(docRef,{
              urls: arrayUnion(downloadUrl)
            })       
          });
           
        }
      ); 
    });

    Promise.all(promises) 
      .then(() => console.log("All images uploaded"))
      .catch((err) => console.log(err)); 
  };

//update name
  const updateItemName = async() =>{
    if(itemName!=""){
       await updateDoc(docRef, {
        itemName: itemName
      });
      alert("התעדכן");
    }
    else{
      alert("עליך לתת שם פריט")
    }
  }

  //update description
  const updateDescription = async() =>{
    if(description!=""){
       await updateDoc(docRef, {
        description: description
      });
      alert("התעדכן");
    }
    else{
      alert("עליך לרשום תיאור")
    }
  }
  //update location
  const updateLocation = async() =>{
    
       await updateDoc(docRef, {
        location: location
      });
      alert("התעדכן");
    
   
  }
  //update worth
  const updateWorth = async() =>{
       await updateDoc(docRef, {
        worth: worth
      });
      alert("התעדכן");

  }
//update tags
  const updateTags = async() =>{
       await updateDoc(docRef, {
        tags: tags
      });
      alert("התעדכן");

  }
//update status
  const updateStatus = async() =>{
    await updateDoc(docRef, {
     status: status
   });
   alert("התעדכן");

}
const handleTags = (tags) => {
  setTags( tags );
}; 

//delete image
const deleteImage= async(url) =>{
  // eslint-disable-next-line no-restricted-globals
  if(confirm("האם אתה בטוח שברצונך למחוק?")){
  await updateDoc(docRef,{
    urls: arrayRemove(url)
  })
}
};

return (
    <div className='container'>
      <h1 className='title'>עריכת פריט</h1>
      {post&&<div className='card' style={{padding:"10px"}}>
        <h2>שם פריט: {post.itemName} <i className='fa fa-pencil' style={{color:"orangered"}} data-bs-toggle="collapse" href="#itemName" role="button" aria-expanded="false" aria-controls="collapseExample"/></h2>
        <div className="collapse" id="itemName">
        <div className="input-group">
          <input type="text" className="form-control" onChange={(e)=> setItemName(e.target.value)} placeholder="שם הפריט" />
          <button className="btn btn-primary" type="button" onClick={updateItemName}>שמור</button>
        </div>
        </div>
        <p>תיאור: {post.description} <i className='fa fa-pencil' style={{color:"orangered"}} data-bs-toggle="collapse" href="#description" role="button" aria-expanded="false" aria-controls="collapseExample"/></p>
        <div className="collapse" id="description">
        <div className="input-group">
          <input type="text" className="form-control" onChange={(e)=> setDescription(e.target.value)} placeholder="תיאור"/>
          <button className="btn btn-primary" type="button" onClick={updateDescription}>שמור</button>
        </div>
        </div>
        <p>שווי: {post.worth} <i className='fa fa-pencil' style={{color:"orangered"}} data-bs-toggle="collapse" href="#worth" role="button" aria-expanded="false" aria-controls="collapseExample"/></p>
        <div className="collapse" id="worth">
        <div className="input-group">
          <input type="text" className="form-control" onChange={(e)=> setWorth(e.target.value)} placeholder="שווי"/>
          <button className="btn btn-primary" type="button" onClick={updateWorth}>שמור</button>
        </div>
        </div>
        <p>מיקום: {post.location} <i className='fa fa-pencil' style={{color:"orangered"}} data-bs-toggle="collapse" href="#location" role="button" aria-expanded="false" aria-controls="collapseExample"/></p>
        <div className="collapse" id="location">
        <div className="input-group">
          <input type="text" className="form-control" onChange={(e)=> setLocation(e.target.value)} placeholder="מיקום..."/>
          <button className="btn btn-primary" type="button" onClick={updateLocation}>שמור</button>
        </div>
        </div>
        <p>מצב: {post.status} <i className='fa fa-pencil' style={{color:"orangered"}} data-bs-toggle="collapse" href="#status" role="button" aria-expanded="false" aria-controls="collapseExample"/></p>
        <div className="collapse" id="status">
        <div className="input-group">
          <select className="form-select"onChange={(e)=> setStatus(e.target.value)}>
            <option selected>בחר...</option>
            <option value={"חדש"}>חדש</option> 
            <option value={"כמו חדש"}>כמו חדש</option>
            <option value={"ישן"}>ישן</option>
            <option value={"משומש"}>משומש</option>
          </select>
          <button className="btn btn-primary" type="button" onClick={updateStatus}>שמור</button>
        </div>
        </div>
        <p>תגיות: {post.tags.map((tag)=>(
          <>
          <span>  </span>
          <a style={{"color":"blue"}}>#{tag}</a>
          </>
        ))} <i className='fa fa-pencil' style={{color:"orangered"}} data-bs-toggle="collapse" href="#tags" role="button" aria-expanded="false" aria-controls="collapseExample"/></p>
        <div className="collapse" id="tags">
        <div className="input-group">
        <ReactTagInput
                  tags={tags}
                  placeholder="הוסף תחומי עניין..."
                  onChange={handleTags}
                />
          <button className="btn btn-primary" type="button" onClick={updateTags}>שמור</button>
        </div>
        </div>
        <br/>
        <div>
          <h3>תמונות</h3>
          <p>{progress}</p>
  {post.urls.map((url, i) => (
    <>
        <img 
          key={i}
          style={{ width: "100px" }}
          src={url || "http://via.placeholder.com/300"}
          alt="firebase-image" 
        />
        
        <button className='btn' onClick={()=>deleteImage(url)}><i className='fa fa-trash' style={{color:"red",fontSize:"x-large"}}/></button>
        </>
      ))}<br/><br/>
          <div className="mb-3">
  <label className="form-label">העלאת תמונות נוספות</label>
  <input className="form-control" type="file" accept='image/*' multiple onChange={handleChange}/> 
  <button className='btn btn-info'><i style={{color:"white"}} className='fa fa-cloud-upload' onClick={handleUpload}/></button></div>
        </div>
         </div>}
    </div>
  )
}
