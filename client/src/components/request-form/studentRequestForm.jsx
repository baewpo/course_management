import { Loading } from "components/general/loading"
import React, { useEffect, useState } from "react"
import "./studentRequestForm.scss"
import dayjs from "config/dayjsConfig"
import lodash from "lodash"
import Pagination from "components/general/pagination"
import { useLocation, useNavigate } from "react-router-dom"
import { showToast } from "components/general/toast"
import axios from "config/axiosConfig"
import { customSelectStyles } from "components/track-status/customSelectStyles"
import Select from "react-select"
import qs from "qs"
import GeneralConfirmModal from "components/general/generalConfirmmodal"

const statusOptions = [
	{ value: "pending", label: "Pending" },
	{ value: "approved", label: "Approved" },
	{ value: "rejected", label: "Rejected" },
]

const StudentRequestForm = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [request, setRequest] = useState([])
	const [selectedStatuses, setSelectedStatuses] = useState([statusOptions[0]])
	const [isShowModal, setIsShowModal] = useState(false)
	const [updatedStatus, setUpdatedStatus] = useState({})
	const navigate = useNavigate()
	const location = useLocation()

	useEffect(() => {
		const queryParams = new URLSearchParams(window.location.search)
		const page = parseInt(queryParams.get("page"), 10)
		if (!page) {
			updateQueryParams({ page: 1 })
			fetchData(selectedStatuses)
		} else if (currentPage !== page) {
			setCurrentPage(page)
		} else {
			fetchData(selectedStatuses)
		}
	}, [currentPage, selectedStatuses, location])

	const updateQueryParams = (newParams = {}) => {
		const queryParams = new URLSearchParams(window.location.search)
		Object.keys(newParams).forEach(key => {
			if (newParams[key]) {
				queryParams.set(key, newParams[key])
			} else {
				queryParams.delete(key)
			}
		})
		navigate(`?${queryParams.toString()}`, { replace: true })
	}

	const handlePageChange = newPage => {
		setCurrentPage(newPage)
		updateQueryParams({ page: newPage })
	}

	const handleStatusChange = selectedOptions => {
		let updatedSelectedStatuses = selectedOptions
		if (selectedOptions.length === 0) {
			updatedSelectedStatuses = [statusOptions[0]]
		}
		setSelectedStatuses(updatedSelectedStatuses || [])
		const statuses = updatedSelectedStatuses?.map(option => option.value).join(",") || ""
		updateQueryParams({ page: 1, status: statuses })
	}

	const fetchData = async (selectedOptions = []) => {
		try {
			setIsLoading(true)
			const response = await axios.get("/api/courses/request", {
				params: {
					status: selectedOptions.map(option => option.value),
					sortBy: "updatedAt",
					sortOrder: "desc",
					page: currentPage,
					pageSize: 10,
				},
				paramsSerializer: params => {
					return qs.stringify(params, { arrayFormat: "comma" })
				},
			})
			setRequest(response.data.entities)
			setTotalPages(response.data.totalPages)
		} catch (error) {
			console.error(error)
			showToast("error", error.response?.data?.message)
		} finally {
			setIsLoading(false)
		}
	}

	const handleUpdateStatus = (id, status) => {
		setIsShowModal(true)
		setUpdatedStatus({ id, status })
	}

	const confirmUpdate = async updatedStatus => {
		try {
			setIsLoading(true)
			await axios.put("/api/courses/request/update-status", [
				{
					id: updatedStatus.id,
					status: updatedStatus.status,
				},
			])
			setIsShowModal(false)
			fetchData(selectedStatuses)
			showToast("success", "Request deleted successfully")
		} catch (error) {
			console.error(error)
			showToast("error", error.response.messages)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="student-form">
			<Loading showLoading={isLoading} />
			<div className="table-controls">
				<div className="filter-controls">
					<Select
						isMulti
						options={statusOptions}
						value={selectedStatuses}
						onChange={handleStatusChange}
						className="filter-dropdown"
						placeholder="Filter by status..."
						styles={customSelectStyles}
					/>
				</div>
				<button className="refresh-button" onClick={() => fetchData(selectedStatuses)}>
					<i className="fas fa-refresh" aria-hidden="true"></i>
				</button>
			</div>
			<div className="student-form-container">
				<table className="student-form-table">
					<thead className="student-form-table-thead">
						<tr className="student-form-table-tr">
							<th className="student-form-table-th updated-at">Updated At</th>
							<th className="student-form-table-th code">Code</th>
							<th className="student-form-table-th name">Name</th>
							<th className="student-form-table-th type">Type</th>
							<th className="student-form-table-th status">Status</th>
							<th className="student-form-table-th request-by">Request By</th>
							<th className="student-form-table-th action">Action</th>
						</tr>
					</thead>
					<tbody className="student-form-table-tbody">
						{request.length ? (
							request.map(item => (
								<tr className="student-form-table-body-tr" key={item.id}>
									<td className="student-form-table-td updated-at">
										{dayjs(item.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
									</td>
									<td className="student-form-table-td code">{item.course.courseCode}</td>
									<td className="student-form-table-td name">{item.course.name}</td>
									<td className="student-form-table-td type">
										{lodash.capitalize(item.type)}
									</td>
									<td className="student-form-table-td status">
										<span className={`status-tag ${item.status}`}>
											{lodash.capitalize(item.status)}
										</span>
									</td>
									<td className="student-form-table-td request-by">{item.user.name}</td>
									<td className="student-form-table-td action">
										<button
											className="action-button approve"
											type="button"
											onClick={() => handleUpdateStatus(item.id, "approved")}
											disabled={item.status === "approved"}>
											<i className="fas fa-check" aria-hidden="true"></i>
										</button>
										<button
											className="action-button reject"
											type="button"
											onClick={() => handleUpdateStatus(item.id, "rejected")}
											disabled={item.status === "rejected"}>
											<i className="fas fa-times" aria-hidden="true"></i>
										</button>
									</td>
								</tr>
							))
						) : (
							<tr className="student-form-table-body-tr">
								<td className="student-form-table-td no-data" colSpan="6">
									No Data Available
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={handlePageChange}
			/>
			<GeneralConfirmModal
				show={isShowModal}
				onClose={() => setIsShowModal(false)}
				onConfirm={() => confirmUpdate(updatedStatus)}
				text={"Are you sure to update this request?"}
			/>
		</div>
	)
}

export default StudentRequestForm
