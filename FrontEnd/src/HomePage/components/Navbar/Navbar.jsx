import { Link } from 'react-router-dom'
import './Navbar.css'
const showsidebar=()=>{
  const sidebar=document.querySelector('.nav-menu.sidebar')
  sidebar.classList.add("sidebar-active")
}
const hidesidebar=()=>{
  const sidebar=document.querySelector('.nav-menu.sidebar')
  sidebar.classList.remove("sidebar-active")
}
const Navbar = () => {
  return (
    <div className='nav'>
    <ul className='nav-menu'>
      <li className="nav-logo"><Link to='/'>OX</Link> </li>
      <li className='hideonmobile'><Link to='/'>Home</Link></li>
      <li className='hideonmobile'><Link to='/explore'>Explore</Link></li>
      <li className='hideonmobile'><Link to='/about'>About</Link></li>
      <li className='menu-contacts hideonmobile'><Link to='/contacts'>Contacts</Link></li>
      <li className='menu-bar' onClick={()=>showsidebar()}><div><i class="fa-solid fa-bars"></i></div></li>
    </ul>
    <ul className='nav-menu sidebar '>
      <li className="leavebtn"><i onClick={()=>hidesidebar()}  class="fa-solid fa-right-from-bracket"></i></li>
      <li><Link to='/'>Home</Link></li>
      <li><Link to='/explore'>Explore</Link></li>
      <li><Link to='/about'>About</Link></li>
      <li className='menu-contacts'><Link to='/contacts'>Contacts</Link></li>
    </ul>
  </div>
  )
}

export default Navbar