import React from 'react'
import Moment from "react-moment";


export default function Post({setSearch,id,name,description,worth,location,author,status,tags,images,createdAt}) {
// post component  
  return (
    <div >
      <div className="row g-0" dir='rtl'>
        <div className="col-md-4" style={{"margin":"auto"}}>
          <div><button type="button" className="btn btn btn-outline-info" data-bs-toggle="modal" data-bs-target={"#"+id}><img width={200} style={{padding:"3px"}} src={images[0]} className="img-fluid rounded-start" alt="..."/><h4 style={{position:"relative",top:"50%",right:"15%"}} className='count'>{images.length}+</h4></button></div>
          <div className="modal fade" id={id} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content modal-dialog-centered">
                <div className="modal-header">
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner">
                  {images.map((image)=>(
                    <div className="carousel-item active">
                      <img src={image} className="d-block w-100" alt="..."/>
                    </div>))}
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      <div className="col-md-8">
      <div className="card-body" style={{textAlign:"right"}}>
        <h3 className="card-title">{name}</h3><br/>
        <h6 className="card-text">{description}</h6><br/> 
        <p className="card-text">שווי: {worth}</p>
        <p className="card-text">מיקום: {location}</p>
        <p className="card-text">מצב: {status}</p>
        {tags&&<p style={{maxWidth:"50%"}} className="card-text">{tags.map((tag)=>(
          <>
          <span>  </span>
          <a onClick={()=>setSearch(tag)} style={{"color":"blue"}}>#{tag}</a>
          </>
        ))}</p>}
       {createdAt&&<p className="card-text"><small dir='ltr' className="text-muted"><Moment fromNow>{createdAt.toDate()}</Moment></small></p>}
        

      </div>
    </div>
  </div>
</div>
  )
}
