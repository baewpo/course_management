import { useState, useEffect } from 'react'
import axios from 'config/axiosConfig'
import Course from 'models/course'
import { Loading } from 'components/general/loading'
import './trackStatusTable.scss'
import { showToast } from 'components/general/toast'
import dayjs from '../../config/dayjsConfig'
import lodash from 'lodash'
import Select from 'react-select'
import qs from 'qs'
import { customSelectStyles } from './customSelectStyles'
import Pagination from 'components/general/pagination'
import { useNavigate } from 'react-router-dom'

const TrackStatusTable = () => {
	const user = JSON.parse(localStorage.getItem('user'))?.user
	const [isLoading, setIsLoading] = useState(false)
	const [request, setRequest] = useState([])
	const [selectedStatuses, setSelectedStatuses] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const navigate = useNavigate()

	const statusOptions = [
		{ value: 'pending', label: 'Pending' },
		{ value: 'approved', label: 'Approved' },
		{ value: 'rejected', label: 'Rejected' },
	]

	useEffect(() => {
		const queryParams = new URLSearchParams(window.location.search)
		const page = parseInt(queryParams.get('page'), 10)
		if (!page) {
			updateQueryParams({ page: 1, status: selectedStatuses.join(',') })
		} else if (currentPage !== page) {
			setCurrentPage(page)
		} else {
			fetchData(selectedStatuses)
		}
	}, [currentPage, selectedStatuses])

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
		setSelectedStatuses(selectedOptions || [])
		const statuses = selectedOptions?.map(option => option.value).join(',') || ''
		updateQueryParams({ page: 1, status: statuses })
	}

	const fetchData = async (selectedOptions = []) => {
		try {
			setIsLoading(true)
			const response = await axios.get(`/api/courses/request/user/${user.id}`, {
				params: {
					status: selectedOptions.map(option => option.value),
					sortBy: 'updatedAt',
					sortOrder: 'desc',
					page: currentPage,
					pageSize: 1,
				},
				paramsSerializer: params => {
					return qs.stringify(params, { arrayFormat: 'comma' })
				},
			})

			setRequest(response.data.entities)
			setTotalPages(response.data.totalPages)
		} catch (error) {
			console.error(error)
			showToast('error', error.response?.data?.message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="track-status">
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

			<div className="track-status-container">
				<table className="track-status-table">
					<thead className="track-status-table-thead">
						<tr className="track-status-table-tr">
							<th className="track-status-table-th updated-at">Updated At</th>
							<th className="track-status-table-th code">Code</th>
							<th className="track-status-table-th name">Name</th>
							<th className="track-status-table-th description">Description</th>
							<th className="track-status-table-th type">Type</th>
							<th className="track-status-table-th status">Status</th>
						</tr>
					</thead>
					<tbody className="track-status-table-tbody">
						{request.length ? (
							request.map(item => (
								<tr className="track-status-table-body-tr" key={item.id}>
									<td className="track-status-table-td updated-at">
										{dayjs(item.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
									</td>
									<td className="track-status-table-td code">{item.course.courseCode}</td>
									<td className="track-status-table-td name">{item.course.name}</td>
									<td className="track-status-table-td description">
										{item.course.description}
									</td>
									<td className="track-status-table-td type">
										{lodash.capitalize(item.type)}
									</td>
									<td className="track-status-table-td status">
										<span className={`status-tag ${item.status}`}>
											{lodash.capitalize(item.status)}
										</span>
									</td>
								</tr>
							))
						) : (
							<tr className="track-status-table-body-tr">
								<td className="track-status-table-td no-data" colSpan="6">
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
		</div>
	)
}

export default TrackStatusTable
