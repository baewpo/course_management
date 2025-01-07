import React from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const DEFAULT_OPTIONS = {
	position: "top-right",
	autoClose: 3000,
	closeOnClick: true,
}

const showToast = (type, message, options = {}) => {
	const config = { ...DEFAULT_OPTIONS, ...options }

	switch (type) {
		case "success":
			toast.success(message, config)
			break
		case "error":
			toast.error(message, config)
			break
		case "info":
			toast.info(message, config)
			break
		case "warning":
			toast.warning(message, config)
			break
		default:
			toast(message, config)
			break
	}
}

export { showToast }
