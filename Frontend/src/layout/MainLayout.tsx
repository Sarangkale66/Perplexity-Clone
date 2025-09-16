import { Outlet } from 'react-router-dom'
import Sidebar from '../component/Sidebar'
import "./MainLayout.css"
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { connectSocket, disconnectSocket } from '../feature/socketReducer/SocketSlice'

const MainLayout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(connectSocket("http://localhost:3000"));
    return () => {
      dispatch(disconnectSocket());
    }
  }, [dispatch])
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
