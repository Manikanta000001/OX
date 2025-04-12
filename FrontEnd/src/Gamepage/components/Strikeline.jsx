import './Strikeline.css'
import React from 'react'
import gamewinasset from "../../Audio/winning.mp3"
import { useRef } from 'react'

const gameoversound=new Audio(gamewinasset)
gameoversound.volume=0.5

const Strikeline = ({strikeclass,bigwinner}) => {
  const hasPlayedRef = useRef(false);
  if(!bigwinner){
    hasPlayedRef.current=false
  }
  if(strikeclass&&!hasPlayedRef.current){
    gameoversound.currentTime=0
    gameoversound.play()
    hasPlayedRef.current = true;
  }
  return (
    <div className={`strike ${strikeclass} `}></div>
  )
}

export default Strikeline