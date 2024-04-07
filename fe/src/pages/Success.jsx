import React, { useEffect } from 'react'
import Home from './Home';


const Success = () => {
 
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get(`token`)

  useEffect(()=>{
    if(token){
      localStorage.setItem(`auth`, JSON.stringify(token))
    }
  },[])

  return (
    <Home/>
  );
};

export default Success;