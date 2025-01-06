import CourseRequest from './courseRequest'

class Course {
	constructor(id = '', type = '', status = '', updated_at = '', course = new CourseRequest()) {
		this.id = id
		this.type = type
		this.status = status
		this.updatedAt = updated_at
		this.course = course
	}
}

export default Course
