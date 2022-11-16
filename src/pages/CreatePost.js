import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {auth, db, storage} from '../firebase-config';
import {v4} from "uuid";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

const initialState = {
  itemName:"",
  tags: [],
  worth:"",
  status:"",
  location:"",
  description:"",
  money:false
};

function CreatePost() {


  const [form, setForm] = useState(initialState);
  const [images, setImages] = useState([]);
  const [urls, setUrls] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading,setLoading] = useState(false);

  const [minPrice,setMinPrice]= useState(0);
  const [maxPrice,setMaxPrice]= useState(100);

  console.log(minPrice)
  console.log(typeof(minPrice))
  console.log(maxPrice)


//save images on array
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
  const {itemName,tags,location,worth,status,description,money} = form; 


  const [itemError,setItemError] = useState("");
  const [descriptionError,setDescriptionError] = useState("");



  const postCollection = collection(db,"posts");
  let navigate = useNavigate();

  //create post
  const createPost = async () =>{
    if(itemName!="" && description!=""){
      if(money){
        if((minPrice>=0)&&(maxPrice>=minPrice)&&(!isNaN(minPrice))){
    try {
      await addDoc(postCollection,{
        ...form,
        author: {name: auth.currentUser.displayName, id: auth.currentUser.uid, photo: auth.currentUser.photoURL, email:auth.currentUser.email},
        createdAt: Timestamp.fromDate(new Date()).toDate(),
        urls:urls,
        minPrice:minPrice,
        maxPrice:maxPrice,
        })
      Swal.fire({
        icon: 'success',
        title: 'נוצר',
      })
        navigate("/");
    } catch (error) {
      console.log(error);
    }
  }
  else{
    if (minPrice>maxPrice) {
      console.log("big")
    }
    if(minPrice<0){
      console.log("low")
    }
  }
  }
  else{
    try {
      await addDoc(postCollection,{
        ...form,
        author: {name: auth.currentUser.displayName, id: auth.currentUser.uid, photo: auth.currentUser.photoURL, email:auth.currentUser.email},
        createdAt: Timestamp.fromDate(new Date()).toDate(),
        urls:urls,
        })
      Swal.fire({
        icon: 'success',
        title: 'נוצר',
      })
        navigate("/");
    } catch (error) {
      console.log(error);
    }
  }
  }
  else{
    if(itemName==""){setItemError("חובה לתת שם לפריט");}
    if(description==""){setDescriptionError("חובה לתת תיאור לפריט");}
    
  }
 
  }
// handle onChanges
  const handleItemName = (e) => {
    setForm({ ...form, itemName: e.target.value });
  };
  const handleWorth = (e) => {
    setForm({ ...form, worth: e.target.value });
  };
  const handleTags = (tags) => {
    setForm({ ...form, tags });
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

  const handleMoney = () => {
    setForm({ ...form, money: !money });
  };

  return (
    <div className='container'>
      <h1 className='title'>פרסם פריט</h1>
      <h5>שים לב! ככל שתמלא יותר פרטים ככה תמשוך יותר אנשים להתעניין בפרסום שלך</h5>
      <div className="card" style={{maxWidth: "60rem", margin:"auto", padding:"25px"}}>
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
  <div className="col-md-6">
    <label className="form-label">מצב</label>
    <select className="form-select" onChange={handleStatus}>
      <option selected>בחר...</option>
      <option value={"חדש"}>חדש</option> 
      <option value={"כמו חדש"}>כמו חדש</option>
      <option value={"ישן"}>ישן</option>
      <option value={"משומש"}>משומש</option>
    </select>
  </div>
  
  <div className="col-6">
    <label className="form-label">מיקום</label>
    <input type="text" className="form-control" placeholder="City...,Street..." onChange={handleLocation}/>
  </div>
  <div className="mb-3">
  <label className="form-label">תיאור</label>
  <textarea className="form-control" rows="3" maxLength="500" onChange={handleDescription}></textarea>
  <p style={{color: 'red'}}>{descriptionError}</p>
</div>
  <div className="col-12 py-3">
  הוסף תחומי עניין קשורים (למשל: ספורט, מוזיקה וכו')
                <ReactTagInput
                  tags={tags}
                  placeholder="Tags"
                  onChange={handleTags}
                />
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
      <div className="form-check form-switch form-check-reverse">
  <input style={{fontSize:"20px",marginRight:"3%"}} className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" onChange={handleMoney} />
  <label className="form-check-label" htmlFor="flexSwitchCheckChecked"> מקבל גם תמורה כספית </label><br/><br/>
  {money&&<div className='row g-3'><div className="col-md-4">
    <label for="validationDefault01" className="form-label">סכום מינימלי</label>
    <input type="number" className="form-control" id="validationDefault01" value={minPrice} onChange={(e)=>setMinPrice(e.target.valueAsNumber)}/>
    {((minPrice<0)||(minPrice>maxPrice)||(isNaN(minPrice))) ? <p style={{color:"red"}}> חובה לציין סכום. הסכום המינימלי לא יכול להיות קטן מ0 או גדול מהסכום המקסימלי</p>:""}
  </div>
  
  <div className="col-md-4">
    <label for="validationDefault02" className="form-label">סכום מקסימלי</label>
    <input type="number" className="form-control" id="validationDefault02" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.valueAsNumber)}/>
    {(maxPrice===0 || isNaN(maxPrice)) ? <p style={{color:"red"}}>הסכום המקסימלי לא יכול להיות 0.</p>:""}
  </div></div> }
</div>
</div>
  <div className="col-12">
    <button disabled={loading ? true : false} onClick={createPost} className="btn btn-primary">{loading ? "טוען קבצים..." : "שתף"}</button>
  </div>
  </div>
</div>
    </div>
  )
}

export default CreatePost