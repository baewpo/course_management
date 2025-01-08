class CourseRequest {
	constructor(
		id = "",
		name = "",
		course_code = "",
		description = "",
		credits = "",
		instructor = "",
		type = "add"
	) {
		this.id = id
		this.name = name
		this.courseCode = course_code
		this.description = description
		this.credits = credits
		this.instructor = instructor
		this.type = type
	}
}

export default CourseRequest
