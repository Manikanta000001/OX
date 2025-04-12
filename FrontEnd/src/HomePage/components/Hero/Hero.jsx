import { useRef } from 'react'
import './Hero.css'
const Hero = ({setplayerstauts,heroData,herocount,sethercount,playerstauts,setusername,setroomid,hadlejoin}) => {
  const usernameinput=useRef(null)
  const roominput=useRef(null)
  const joinbutton=useRef(null)
  const handlekeydownfirst=(e)=>{
    if(e.key==='Enter'){
      roominput.current.focus()
    }
  }
  const handlekeydownsecond=(e)=>{
    if(e.key==='Enter'){
      joinbutton.current.click()
    }
  }
  
  return (
    <div className='hero'>
      <div className="hero-text">
        <p>{heroData.text1}</p>
        <p>{heroData.text2}</p>
      </div>
      
       <div className="hero-explore">
        
            <div className="input-box">
               <input type="text" placeholder="Nickname"  onChange={(e)=>setusername(e.target.value)} ref={usernameinput} onKeyDown={handlekeydownfirst}  required/>
                <i className='bx bxs-user'></i>
            </div> 
            <div className="input-box">
                <input type="password" placeholder="Room Password"  onChange={(e)=>setroomid(e.target.value)} ref={roominput} onKeyDown={handlekeydownsecond} required/>
                <i className='bx bxs-lock-alt'></i>
            </div> 
            <button type="submit" onClick={()=>hadlejoin()} ref={joinbutton} className="btn">JOIN ROOM</button>
       
    </div>
      <div className="hero-dot-play">
        <ul className="hero-dots">
          <li onClick={()=>sethercount(0)} className={herocount===0?'hero-dot orange':'hero-dot'}></li>
          <li onClick={()=>sethercount(1)} className={herocount===1?'hero-dot orange':'hero-dot'}></li>
          <li onClick={()=>sethercount(2)} className={herocount===2?'hero-dot orange':'hero-dot'}></li>
        </ul>
        <div className="hero-play">
          <div className='play-pause' onClick={()=>setplayerstauts(!playerstauts)}>{playerstauts?<i className="fa-solid fa-pause"></i>:<i className="fa-solid fa-play"></i>}</div>
          <p className='hideonmobile'>Play Karo !</p>
        </div>

      </div>

    </div>
  )
}

export default Hero