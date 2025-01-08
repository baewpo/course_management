import React from "react"
import "./pagination.scss"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	const handlePrevClick = () => {
		if (currentPage > 1) onPageChange(currentPage - 1)
	}

	const handleNextClick = () => {
		if (currentPage < totalPages) onPageChange(currentPage + 1)
	}

	const generatePageNumbers = () => {
		let startPage = currentPage - 1
		let endPage = currentPage + 1

		if (currentPage === 1) {
			startPage = 1
			endPage = 3
		} else if (currentPage === totalPages) {
			startPage = totalPages - 2
			endPage = totalPages
		}

		if (startPage < 1) startPage = 1
		if (endPage > totalPages) endPage = totalPages

		const pageNumbers = []
		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(i)
		}
		return pageNumbers
	}

	const handlePageClick = pageNumber => {
		if (pageNumber !== currentPage) {
			onPageChange(pageNumber)
		}
	}

	return (
		<div className="pagination-controls">
			<button
				className="pagination-button"
				onClick={handlePrevClick}
				disabled={currentPage === 1}>
				{"<"}
			</button>
			<div className="page-numbers">
				{generatePageNumbers().map(pageNumber => (
					<button
						key={pageNumber}
						className={`pagination-page-button ${currentPage === pageNumber ? "active" : ""}`}
						onClick={() => handlePageClick(pageNumber)}>
						{pageNumber}
					</button>
				))}
			</div>
			<button
				className="pagination-button"
				onClick={handleNextClick}
				disabled={currentPage === totalPages}>
				{">"}
			</button>
		</div>
	)
}

export default Pagination
