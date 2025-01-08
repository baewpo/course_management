const { Op } = require("sequelize")

/**
 * ฟังก์ชันการคำนวณ pagination
 * @param {Object} model - Sequelize model ที่จะใช้
 * @param {Object} conditions - เงื่อนไขการกรองข้อมูล
 * @param {Array} include - ตัวแปรที่ใช้ include (optional)
 * @param {Object} reqQuery - query params จาก request
 * @returns {Promise<Object>} ผลลัพธ์ที่ paginated
 */
const pagable = async ({ model, conditions, include = [], reqQuery }) => {
	const { page = 1, pageSize = 10, sortBy, sortOrder } = reqQuery
	const offset = (parseInt(page) - 1) * parseInt(pageSize)
	const order = sortBy && sortOrder ? [[sortBy, sortOrder]] : undefined
	const { rows, count } = await model.findAndCountAll({
		where: conditions,
		include: include,
		limit: parseInt(pageSize),
		offset: offset,
		order: order,
	})
	const totalPages = Math.ceil(count / parseInt(pageSize)) || 1

	return {
		total: count,
		totalPages,
		currentPage: parseInt(page),
		pageSize: parseInt(pageSize),
		entities: rows,
	}
}

module.exports = { pagable }
