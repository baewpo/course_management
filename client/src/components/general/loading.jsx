import React from "react"
import "./loading.scss"

const Loading = ({ showLoading }) => {
	if (!showLoading) return null
	return (
		<div className="loading-popup">
			<div className="loading-content">
				<div className="spinner"></div>
				<p className="loading-text">Loading...</p>
			</div>
		</div>
	)
}

export { Loading }
