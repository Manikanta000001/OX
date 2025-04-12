import React from 'react'
import Cells from './cells'
import boders from './boader'

const SmallTic = ({board,isActive,oncellclick,winner,playertohover}) => {

    playertohover=isActive?playertohover:null
      return (
       <div className={`small-board  `}>
        {
             board.map((cell,index)=>{
                return  <Cells key={ index} playertohover={playertohover} value={cell} onclick={()=>oncellclick(index)} border={boders[index] }/> 
            })
        }
       </div>
      )
    }

export default SmallTic