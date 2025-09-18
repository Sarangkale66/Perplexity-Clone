import { Outlet } from 'react-router-dom'
import Sidebar from '../component/Sidebar'
import "./MainLayout.css"
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { connectSocket, disconnectSocket, getSocketInstance } from '../feature/socketReducer/SocketSlice'
import type { AppDispatch } from '../store/store'

const MainLayout = () => {
  const socket = getSocketInstance();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(connectSocket("http://localhost:3000"));

    return () => {
      socket?.off("ai-response")
      dispatch(disconnectSocket());
    }
  }, [dispatch, socket]);
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
