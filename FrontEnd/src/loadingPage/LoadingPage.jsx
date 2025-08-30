import React, { useEffect, useState } from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import {  toast } from 'react-toastify';
import netflixloader from './LoadingAssests/netflixloader.mp4'
import socket from '../../socket'
import './LoadingPage.css'

const LoadingPage = () => {
  const {roomid,username}=useParams()
  const [showtadum,setshowtadum]=useState(false)
  const navigate=useNavigate()
  const socket=getSocket()
  
  // initial join request to sever
  
useEffect(()=>{

socket.emit('join-game',{roomid,username})

socket.on('roomfull',()=>{
  toast.info("Room Full. Try new ID",{
    autoClose: 1000,
  })
  setTimeout(() => {
    navigate('/')
  }, 1500);
})

socket.on('gamestarted',()=>{
  //animation should start
  setshowtadum(true)
  setTimeout(() => {
    navigate(`/game/${roomid}/${username}`)
  }, 5020);
})
return ()=>{
  socket.off('gamestarted');
  socket.off('roomfull');
}

},[roomid,navigate])

  return (
    <div className='loadingpage'>
      {!showtadum?(
      <>
      <div id="loader" class="nfLoader">       
      </div>
      <div className='message'>waiting for other player...</div>
      </>):
      (
        <video src={netflixloader} autoPlay className='video-container'/>
     )}
    </div>
  )
}

export default LoadingPage