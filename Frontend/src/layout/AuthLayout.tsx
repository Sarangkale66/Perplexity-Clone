import { Outlet } from 'react-router-dom'
import { Quote } from '../component/Quote'

const AuthLayout = () => {
  return (
    <div className="h-screen w-full flex">
      <Outlet />
      <Quote />
    </div>
  )
}

export default AuthLayout
