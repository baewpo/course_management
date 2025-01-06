import React from "react"
import "./confirmModal.scss"
import lodash from "lodash"

const ConfirmModal = ({ show, onClose, data, onConfirm }) => {
  if (!show) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <label className="modal-label">Request Add/Drop Course Below:</label>
        <div className="modal-course-table-container">
          <table className="modal-course-table">
            <thead className="modal-course-table-thead">
              <tr className="modal-course-table-tr">
                <th className="modal-course-table-th code">Code</th>
                <th className="modal-course-table-th name">Name</th>
                <th className="modal-course-table-th type">Type</th>
              </tr>
            </thead>
            <tbody className="modal-course-table-tbody">
              {data.map((course, index) => (
                <tr className="modal-course-table-body-tr" key={index}>
                  <td className="modal-course-table-td" title={course.code}>
                    {course.code}
                  </td>
                  <td className="modal-course-table-td" title={course.name}>
                    {course.name}
                  </td>
                  <td className="modal-course-table-td" title={course.type}>
                    {lodash.capitalize(course.type)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="modal-actions">
          <button className="modal-button cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-button confirm" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
