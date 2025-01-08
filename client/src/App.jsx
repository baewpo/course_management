import Navbar from "components/nav-bar/navBar"
import { AuthProvider } from "contexts/AuthContext"
import CreateRequestPage from "pages/createRequestPage"
import LoginPage from "pages/loginPage"
import NotFoundPage from "pages/notFoundPage"
import TrackStatusPage from "pages/trackStatusPage"
import React from "react"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import PrivateRoute from "routes/privateRoutes"
import "./App.scss"
import StudentRequestPage from "pages/studentRequestPage"

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<div className="app-container">
					<Navbar />
					<div className="content-container">
						<Routes>
							<Route path="/" element={<PrivateRoute component={LoginPage} />} />
							<Route
								path="/create-request"
								element={
									<PrivateRoute requiredRole="student" component={CreateRequestPage} />
								}
							/>
							<Route
								path="/my-request"
								element={
									<PrivateRoute requiredRole="student" component={TrackStatusPage} />
								}
							/>
							<Route
								path="/student-request"
								element={
									<PrivateRoute requiredRole="admin" component={StudentRequestPage} />
								}
							/>
							<Route path="*" element={<NotFoundPage />} />
						</Routes>
					</div>
				</div>
				<ToastContainer />
			</Router>
		</AuthProvider>
	)
}

export default App
