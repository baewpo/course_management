export const customSelectStyles = {
	multiValue: (provided, state) => ({
		...provided,
		backgroundColor:
			state.data.value === "approved"
				? "#90ee90"
				: state.data.value === "rejected"
					? "#f5c6cb"
					: "#a3c9f7",
	}),
	multiValueLabel: (provided, state) => ({
		...provided,
		color:
			state.data.value === "approved"
				? "#006400"
				: state.data.value === "rejected"
					? "#8b0000"
					: "#004085",
	}),
	multiValueRemove: (provided, state) => ({
		...provided,
		color:
			state.data.value === "approved"
				? "#006400"
				: state.data.value === "rejected"
					? "#8b0000"
					: "#004085",
	}),
}
