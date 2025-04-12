import React from 'react'
import SmallTic from './SmallTic'
import boders from './boader'
import Strikeline from './Strikeline'


const BigTic = ({boards,activeBoard,handlemove,bigwinner,currentplayer,playersymbol,strikeline}) => {
  const playertohover=currentplayer===playersymbol?currentplayer:null
  return (
    <div className='big-board'>
         {
          boards.map((board,index)=>
            ( 
            <div key={index} className={`smallcells  ${boders[index]}`}>
             <div className={` activecontainer ${(activeBoard===null && !bigwinner )||(activeBoard===index && !bigwinner )?"active":"inactive"}`}>
              {board.winner?(<div className='winner'>{board.winner}</div>):
              (<SmallTic 
                key={index}
                board={board.cells}
                oncellclick={(cellindex)=>handlemove(index,cellindex)}
                isActive={activeBoard===null||activeBoard===index}
                winner={board.winner}
                playertohover={playertohover}
                
                />)}
            </div>
            </div>

            ))
         }
         <Strikeline strikeclass={strikeline} bigwinner={bigwinner}/>
    </div>
  )
}

export default BigTic