import React, { useState } from "react"
import { Link } from "react-router-dom"
import "./navbar.scss"
import { useAuth } from "../../contexts/AuthContext"

const Navbar = () => {
	const { isLoggedIn, username, handleLogout, role } = useAuth()
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const toggleMenu = () => {
		setIsMenuOpen(prev => !prev)
	}

	return (
		<nav className="navbar">
			<div className="navbar-logo">SCI-TU</div>
			{isLoggedIn && (
				<>
					<button className="menu-toggle-btn" onClick={toggleMenu}>
						{isMenuOpen ? "Close" : "Menu"}
					</button>
					<ul className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
						{role === "student" && (
							<>
								<li className="navbar-item">
									<Link className="navbar-link" to="/create-request" onClick={toggleMenu}>
										Create Request
									</Link>
								</li>
								<li className="navbar-item">
									<Link className="navbar-link" to="/my-request" onClick={toggleMenu}>
										My Request
									</Link>
								</li>
							</>
						)}
						{role === "admin" && (
							<li className="navbar-item">
								<Link className="navbar-link" to="/student-request" onClick={toggleMenu}>
									Student Requests Management
								</Link>
							</li>
						)}
					</ul>
					<div className="navbar-right">
						<span className="username-display">{username}</span>
						<button className="logout-btn" onClick={handleLogout}>
							Logout
						</button>
					</div>
				</>
			)}
		</nav>
	)
}

export default Navbar
