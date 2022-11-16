import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/auth'
import { auth } from '../firebase-config'
import logo from '../Logo.png' 

function Header({signUserOut,setSearch}) {
  
  const {user} = useContext(AuthContext);
  const [s,setS]= useState("");
  //set search
  const handleSearch = (e) => {
    setS( e.target.value );
  };
  return (
    //header
    <nav className="navbar navbar-expand-lg bg-gradient fixed-top">
  <div className="container-fluid">
    <Link onClick={()=>setSearch("")} to="/" className="navbar-brand"><img width={150} src={logo}></img></Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
      <li className="nav-item">
          {user && <li className="nav-item dropdown"> 
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <img className='avatar' style={{borderRadius:"40px"}} src={auth.currentUser.photoURL}></img> 
           {` ${auth.currentUser.displayName} `}
          </a> 
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><Link to="/profile" className="dropdown-item" href="#">פרופיל</Link></li>
            <li><Link to="/saved" className="dropdown-item" href="#">פרסומים שאהבתי</Link></li> 
            <li><Link to="/myposts" className="dropdown-item" href="#">הפרסומים שלי</Link></li> 
            <li><hr className="dropdown-divider"/></li>
            <li><a className="dropdown-item" href="#" onClick={signUserOut}>התנתק</a></li>
          </ul>
        </li> ||  <Link to="/login" className="nav-link">התחבר</Link>}
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link" onClick={()=>setSearch("")}>ראשי <i className='fa fa-home'/></Link>
        </li>
        {user&& <li className="nav-item">
          <Link to='/offers' className="nav-link" href="#">הצעות <i className="fa fa-handshake-o"></i></Link>
        </li>}
        {user&&<li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            קטגוריות
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><Link to="/" className="dropdown-item" href="#" onClick={()=>setSearch("לבית")}>לבית</Link></li>
            <li><Link to="/" className="dropdown-item" href="#" onClick={()=>setSearch("אלקטרוניקה")}>אלקטרוניקה</Link></li>
            <li><Link to="/" className="dropdown-item" href="#" onClick={()=>setSearch("ספר")}>ספרים</Link></li>
            <li><Link to="/" className="dropdown-item" href="#" onClick={()=>setSearch("גיימינג")}>גיימינג</Link></li>
            <li><Link to="/" className="dropdown-item" href="#" onClick={()=>setSearch("ספורט")}>ספורט</Link></li>
            <li><Link to="/" className="dropdown-item" href="#" onClick={()=>setSearch("מוזיקה")}>מוזיקה</Link></li>
            <li><Link to="/" className="dropdown-item" href="#" onClick={()=>setSearch("רכב")}>רכב</Link></li>
            <li><Link to="/" className="dropdown-item" href="#" onClick={()=>setSearch("אספנות")}>אספנות</Link></li>
            <li><hr className="dropdown-divider"/></li>
            <li>אחר</li>
          </ul>
        </li>}
      </ul>
        
      <div className="d-flex">
        <input className="form-control me-2" type="text" placeholder="חפש..." onChange={handleSearch}/>
        <button className="btn btn-secondary" onClick={()=>setSearch(s)} ><i className='fa fa-search'></i></button>
      </div>
    </div>
  </div>
</nav>
  )
}

export default Header