import { Outlet } from 'react-router-dom'
import Sidebar from '../component/Sidebar'
import "./MainLayout.css"

const MainLayout = () => {
  return (
    <div className='main'>
      <Sidebar />
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
