import { useEffect, useState } from 'react'
import {Routes,Route, useLocation, useNavigate} from 'react-router-dom'
import MasterTic from './Gamepage/MasterTic'
import Homepage from './HomePage/Homepage'
import LoadingPage from './loadingPage/LoadingPage'
import NavBarlayout from './HomePage/NavLayout/NavBarlayout'
import About from './HomePage/Pages/About'
import Explore from './HomePage/Pages/Explore'
import Contacts from './HomePage/Pages/Contacts'
import { Analytics } from '@vercel/analytics/react';


function App() {
  const location=useLocation()
  const navigate=useNavigate()

// Any page which is not home at inital reload redirect to home page

  useEffect(()=>{
    if(location.pathname!=='/'){
      navigate('/')
    }
  },[])
  useEffect(() => {
    // This runs only on the client after the component mounts
    if (window.self !== window.top) {
      document.body.classList.add("in-iframe");
    }
  }, []);

  return (
    <>
      <Routes>
        {/* with navbar routing for home about explore contatcs pages */}

        <Route element={<NavBarlayout/>}>
        <Route path='/about' element={<About/>}/>
        <Route path='/explore' element={<Explore/>}/>
        <Route path='/contacts' element={<Contacts/>}/>

        </Route>
        {/* homepage with its navbar  */}
        <Route path='/' element={<Homepage/>}/>
          {/* without navbar routing for loading and game pages */}
        <Route path='/loading/:roomid/:username' element={<LoadingPage/>}/>
        <Route path='/game/:roomid/:username' element={<MasterTic/>}/>

      </Routes>

      {/* For analysis of vercel online counts */}
      <Analytics/>

    
    </>
    
   
  )
}

export default App
