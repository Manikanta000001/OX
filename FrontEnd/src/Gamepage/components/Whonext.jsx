

const Whonext = ({currentplayer,playersymbol,bigwinner,username,gameplayers,datatheme}) => {
   const opponent=gameplayers?gameplayers.find((player)=>player.userNickname!==username) :null
 
  return (
    <div className="movecontainer">
      {!bigwinner? ( <>
        <div className={`left ${currentplayer===playersymbol?"yourmove":""}`}><span>{username.charAt(0).toUpperCase() + username.slice(1)}</span></div>
        <div className={`right ${currentplayer!==playersymbol?"yourmove":""}`}><span>{opponent&&opponent.userNickname?(opponent.userNickname.charAt(0).toUpperCase() + opponent.userNickname.slice(1)):"Disconnected"}</span></div>
        </>) :<div className="gotwinner yourmove"><span>{bigwinner} wins</span></div>}
    </div>
  )
}

export default Whonext