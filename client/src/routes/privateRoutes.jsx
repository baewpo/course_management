import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isLoggedIn } = useAuth()
  const location = useLocation()

  if (!isLoggedIn && location.pathname !== "/") {
    return <Navigate to="/" />
  }

  if (isLoggedIn && location.pathname === "/") {
    return <Navigate to="/create-request" />
  }

  return <Component {...rest} />
}

export default PrivateRoute
