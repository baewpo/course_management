import React from "react"
import "./generalConfirmModal.scss"

const GeneralConfirmModal = ({ show, onClose, text, onConfirm }) => {
	if (!show) return null

	return (
		<div className="general-modal-overlay">
			<div className="general-modal-content">
				<label className="general-modal-label">{text}</label>
				<div className="general-modal-actions">
					<button className="general-modal-button cancel" onClick={onClose}>
						Cancel
					</button>
					<button className="general-modal-button confirm" onClick={onConfirm}>
						Confirm
					</button>
				</div>
			</div>
		</div>
	)
}

export default GeneralConfirmModal
