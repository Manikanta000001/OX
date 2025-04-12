import React from 'react'
import './model.css'
import video2 from '../../../HomePage/assets/walkz.mp4'

const model = ({open,handleAcceptRematch,handleRejectRematch,username,gameplayers}) => {

    if (!open) return null
    const opponent=gameplayers?gameplayers.find((player)=>player.userNickname!==username) :null
    
  return (
    <div className='overlay'>
        <div className="modelcontainer" data-theme="light">
            <video src={video2} autoPlay loop muted></video>
            <div className="modelright">
                <div className="content">
                    <h1>{opponent&&opponent.userNickname?opponent.userNickname:"Opponent"}</h1>
                    <p>Requested</p>
                    <p>for a rematach</p>
                </div>
                <div className="btncontainer">
                    <button className="accept" onClick={()=>handleAcceptRematch()}>
                        <span className='bold'>Accept</span>
                    </button>
                    <button className="Reject" onClick={()=>handleRejectRematch()}>
                        <span className='bold'>Reject</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default model