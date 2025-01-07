import React, { useEffect, useState } from "react"
import "./requestForm.scss"
import User from "models/user"
import CourseRequest from "models/courseRequest"
import axios from "config/axiosConfig"
import { showToast } from "components/general/toast"
import { Loading } from "components/general/loading"
import ConfirmModal from "./confirmModal"
import { useNavigate } from "react-router-dom"
import qs from "qs"

const RequestForm = () => {
	const [user, setUser] = useState(new User())
	const [coursesRequest, setCoursesRequest] = useState([new CourseRequest()])
	const [searchStates, setSearchStates] = useState(["search"])
	const [readOnlyStates, setReadOnlyStates] = useState([false])
	const [isLoading, setIsLoading] = useState(false)
	const [isShowModal, setIsShowModal] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		const fetchUserData = async () => {
			setIsLoading(true)
			try {
				const userData = JSON.parse(localStorage.getItem("user"))?.user
				if (userData) {
					setUser(userData)
				}
			} catch (error) {
				console.error("Error parsing user data:", error)
			}
			setTimeout(() => {
				setIsLoading(false)
			}, 500)
		}
		fetchUserData()
	}, [])

	const handleAddRow = () => {
		setCoursesRequest(prevCourses => {
			const newRequest = [...prevCourses, new CourseRequest()]
			updateSearchAndReadOnlyStates(newRequest)
			return newRequest
		})
	}

	const handleRemoveRow = index => {
		if (coursesRequest.length > 1) {
			setCoursesRequest(prevCourses => {
				const updatedCourses = [...prevCourses]
				updatedCourses.splice(index, 1)
				updateSearchAndReadOnlyStates(updatedCourses)
				return updatedCourses
			})
		}
	}

	const handleCourseChange = (index, field, value) => {
		setCoursesRequest(prevCourses =>
			prevCourses.map((course, idx) => (idx === index ? { ...course, [field]: value } : course))
		)
	}

	const updateSearchAndReadOnlyStates = courses => {
		setSearchStates(courses.map(course => (course.name ? "clear" : "search")))
		setReadOnlyStates(courses.map(course => Boolean(course.name)))
	}

	const handleClearSearch = async index => {
		setCoursesRequest(prev => {
			const updated = [...prev]
			updated[index] = new CourseRequest()
			updateSearchAndReadOnlyStates(updated)
			return updated
		})
	}

	const handleCourseSearch = async (courseCode, index) => {
		if (
			!courseCode ||
			coursesRequest.some((course, idx) => course.code === courseCode && idx !== index)
		) {
			showToast("error", "Course code must not be empty or duplicate.")
		} else {
			await handleSearch(courseCode, index)
		}
	}

	const handleSearch = async (courseCode, index) => {
		try {
			setIsLoading(true)
			const response = await axios.get(`/api/courses?course_code=${courseCode}`)
			if (response.data.length > 0) {
				setCoursesRequest(prev => {
					const updated = [...prev]
					updated[index] = { ...updated[index], ...response.data[0] }
					updateSearchAndReadOnlyStates(updated)
					return updated
				})
			} else {
				showToast("error", "Course not found.")
			}
		} catch (error) {
			showToast("error", error.response?.data?.message)
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async e => {
		e.preventDefault()
		if (searchStates.every(state => state === "clear")) {
			setIsShowModal(true)
		} else {
			showToast("error", "Please insert required fields before submitting.")
		}
	}

	const handleShowModalConfirm = async () => {
		try {
			const { data } = await axios.get(`/api/courses/request/user/${user.id}`, {
				params: {
					courseCode: coursesRequest.map(({ courseCode }) => courseCode),
					status: "pending",
				},
				paramsSerializer: params => qs.stringify(params, { arrayFormat: "comma" }),
			})

			if (data.entities.length) {
				const existingCourses = data.entities.map(item => item.course.courseCode).join(", ")
				showToast(
					"error",
					`Pending request exists for: ${existingCourses}. Please cancel or wait for status update.`
				)
				return
			}

			const request = coursesRequest.map(({ type, id }) => ({
				type,
				courseId: id,
				userId: user.id,
			}))

			const response = await axios.post("/api/courses/request/create", request)
			showToast("success", response.data.message)
			setIsShowModal(false)
			navigate("/my-request")
		} catch (error) {
			showToast("error", error.response?.data?.message || "Error occurred")
			console.error(error)
		}
	}

	return (
		<>
			<Loading showLoading={isLoading} />
			<form className="request-form">
				<div className="request-form-group">
					<div className="request-form-item">
						<label className="request-form-label">Name:</label>
						<input
							className="request-form-input"
							type="text"
							value={user.name || ""}
							readOnly
						/>
					</div>
					<div className="request-form-item">
						<label className="request-form-label">Student Number:</label>
						<input
							className="request-form-input"
							type="text"
							value={user.studentNumber || ""}
							readOnly
						/>
					</div>
					<div className="request-form-item">
						<label className="request-form-label">Class Year:</label>
						<input
							className="request-form-input"
							type="text"
							value={user.classYear || ""}
							readOnly
						/>
					</div>
					<div className="request-form-item">
						<label className="request-form-label">Email:</label>
						<input
							className="request-form-input"
							type="email"
							value={user.email || ""}
							readOnly
						/>
					</div>
					<div className="request-form-item">
						<label className="request-form-label">Tel:</label>
						<input
							className="request-form-input"
							type="text"
							value={user.tel || ""}
							readOnly
						/>
					</div>
					<div className="request-form-item">
						<label className="request-form-label">Major:</label>
						<input
							className="request-form-input"
							type="text"
							value={user.major.name || ""}
							readOnly
						/>
					</div>
				</div>
				<label className="course-table-label">Request Add/Drop Courses</label>
				<div className="course-table-container">
					<table className="course-table">
						<thead className="course-table-thead">
							<tr className="course-table-tr">
								<th className="course-table-th code">Code</th>
								<th className="course-table-th name">Name</th>
								<th className="course-table-th description">Description</th>
								<th className="course-table-th credits">Credits</th>
								<th className="course-table-th instructor">Instructor</th>
								<th className="course-table-th type">Type</th>
								<th className="course-table-th action">Action</th>
							</tr>
						</thead>
						<tbody className="course-table-tbody">
							{coursesRequest.map((course, index) => (
								<tr className="course-table-body-tr" key={index}>
									<td className="course-table-td code">
										<div className="input-with-icon">
											<input
												className="input-field code"
												type="text"
												value={course.code || ""}
												onChange={e => {
													handleCourseChange(
														index,
														"code",
														e.target.value.toLowerCase()
													)
												}}
												onKeyDown={e => {
													if (e.key === "Enter") {
														handleCourseSearch(course.code, index)
													}
												}}
												title={course.code}
												readOnly={readOnlyStates[index]}
											/>
											<button
												type="button"
												className={`search-icon ${
													searchStates[index] === "clear" ? "clear-icon" : ""
												}`}
												onClick={() =>
													searchStates[index] === "clear"
														? handleClearSearch(index)
														: handleCourseSearch(course.code, index)
												}>
												<i
													className={`fas ${
														searchStates[index] === "clear" ? "fa-times" : "fa-search"
													}`}
													aria-hidden="true"></i>
											</button>
										</div>
									</td>
									<td className="course-table-td name">
										<input
											className="input-field"
											type="text"
											value={course.name}
											title={course.name}
											readOnly
										/>
									</td>
									<td className="course-table-td description">
										<input
											className="input-field"
											type="text"
											value={course.description}
											title={course.description}
											readOnly
										/>
									</td>
									<td className="course-table-td credits">
										<input
											className="input-field"
											type="text"
											value={course.credits}
											title={course.credits}
											readOnly
										/>
									</td>
									<td className="course-table-td instructor">
										<input
											className="input-field"
											type="text"
											value={course.instructor}
											title={course.instructor}
											readOnly
										/>
									</td>
									<td className="course-table-td type">
										<select
											className="input-field type"
											value={course.type}
											onChange={e => handleCourseChange(index, "type", e.target.value)}>
											<option value="add">Add</option>
											<option value="drop">Drop</option>
										</select>
									</td>
									<td className="course-table-td action">
										{index === coursesRequest.length - 1 && (
											<button
												className="action-button add"
												type="button"
												onClick={() => handleAddRow()}>
												<i className="fas fa-plus" aria-hidden="true"></i>
											</button>
										)}
										<button
											className="action-button delete"
											type="button"
											onClick={() => handleRemoveRow(index)}
											disabled={coursesRequest.length === 1}>
											<i className="fas fa-trash-alt" aria-hidden="true"></i>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="submit-container">
					<button type="button" className="submit-button" onClick={handleSubmit}>
						Submit
					</button>
				</div>
			</form>
			<div>
				<ConfirmModal
					show={isShowModal}
					onClose={() => setIsShowModal(false)}
					data={coursesRequest}
					onConfirm={handleShowModalConfirm}
				/>
			</div>
		</>
	)
}

export default RequestForm
