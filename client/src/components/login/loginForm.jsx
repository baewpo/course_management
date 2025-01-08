import React, { useState } from "react"
import axios from "../../config/axiosConfig"
import "./loginForm.scss"
import { showToast } from "../general/toast"
import { useAuth } from "../../contexts/AuthContext"

const LoginForm = () => {
	const { handleLoginSuccess } = useAuth()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const handleSubmit = async event => {
		event.preventDefault()
		const userData = { email, password }
		try {
			const response = await axios.post("/api/users/login", userData)
			handleLoginSuccess(response.data)
			showToast("success", response.data.message)
		} catch (error) {
			showToast("error", error.response.data.message)
			console.error(error.message)
		}
	}

	return (
		<div id="loginFormComponent">
			<h2 className="login-header">Login</h2>
			<form onSubmit={handleSubmit} className="login-form">
				<div className="form-field">
					<input
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
						className="form-input"
						id="email"
						placeholder=""
					/>
					<label htmlFor="email" className="form-label">
						Email
					</label>
				</div>
				<div className="form-field">
					<input
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
						className="form-input"
						id="password"
						placeholder=""
					/>
					<label htmlFor="password" className="form-label">
						Password
					</label>
				</div>
				<button type="submit" className="login-button">
					Login
				</button>
			</form>
		</div>
	)
}

export default LoginForm
