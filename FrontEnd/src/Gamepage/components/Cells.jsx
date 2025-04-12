import React from 'react'

const Cells = ({playertohover,value,onclick,border}) => {
  let hoverclass=null;
  if(value==null&&playertohover!=null){
    hoverclass=`${playertohover.toLowerCase()}-hover`
  }
  return (
    <div className={`cell ${border} ${hoverclass}`} onClick={onclick} disabled={value!==null}>{value}</div>
  )
}

export default Cells
