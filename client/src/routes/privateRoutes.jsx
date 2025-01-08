import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const PrivateRoute = ({ component: Component, requiredRole, ...rest }) => {
	const { isLoggedIn, role } = useAuth()
	const location = useLocation()

	if (!isLoggedIn && location.pathname !== "/") {
		return <Navigate to="/" />
	}

	if (isLoggedIn && location.pathname === "/") {
		if (role === "admin") {
			return <Navigate to="/student-request" />
		} else return <Navigate to="/create-request" />
	}

	if (requiredRole && role !== requiredRole) {
		return <Navigate to="/404" />
	}

	return <Component {...rest} />
}

export default PrivateRoute
