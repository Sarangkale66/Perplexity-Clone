import MainLayout from '../layout/MainLayout'
import DynamicChat from '../screen/main/DynamicChat'
import ErrorPage from '../screen/error/ErrorPage'
import AuthLayout from '../layout/AuthLayout'
import Register from '../screen/auth/Register'
import Login from '../screen/auth/Login'
import Home from '../screen/main/Home'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import { requireAuthLoader } from '../loader/RequireAuthLoader'
import { preventAuthLoader } from '../loader/PreventAuthLoader'


const AppRouter = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      loader: requireAuthLoader,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: ":id",
          element: <DynamicChat />
        },
        {
          path: "ErrorPage",
          element: <ErrorPage />
        }
      ]
    },
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        {
          index: true,
          element: <Register />,
          loader: preventAuthLoader
        },
        {
          path: "login",
          element: <Login />,
          loader: preventAuthLoader
        }
      ]
    },
    {
      path: "*",
      element: <ErrorPage />
    }
  ])

  return <RouterProvider router={router} />
}

export default AppRouter
