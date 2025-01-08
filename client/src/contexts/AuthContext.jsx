import { createContext, useState, useContext } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const user = JSON.parse(localStorage.getItem("user"))
	const [isLoggedIn, setIsLoggedIn] = useState(!!user)
	const [username, setUsername] = useState(user ? user.user.name : "")
	const role = user ? user.user.role.name : ""

	const handleLoginSuccess = data => {
		setIsLoggedIn(true)
		setUsername(data.user.name)
		localStorage.setItem("user", JSON.stringify(data))
	}

	const handleLogout = () => {
		localStorage.removeItem("user")
		setIsLoggedIn(false)
		setUsername("")
		window.location.reload()
	}

	return (
		<AuthContext.Provider value={{ isLoggedIn, username, handleLoginSuccess, handleLogout, role}}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
