import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/loginPage"
import CreateRequestPage from "./pages/createRequestPage"
import PrivateRoute from "./routes/privateRoutes"
import Navbar from "./components/nav-bar/navBar"
import { ToastContainer } from "react-toastify"
import "./App.scss"
import NotFoundPage from "./pages/notFoundPage"
import { AuthProvider } from "./contexts/AuthContext"

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="content-container">
            <Routes>
              <Route path="/" element={<PrivateRoute component={LoginPage}/>} />
              <Route
                path="/create-request"
                element={<PrivateRoute component={CreateRequestPage} />}
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
