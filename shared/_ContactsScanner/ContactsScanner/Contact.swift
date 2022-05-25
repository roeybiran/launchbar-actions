struct Contact: Encodable {
	let title: String
	let subtitle: String
	let addresses: [Info]

	struct Info: Encodable {
		let label: String
		let value: String
		let type: AddressType
	}

	enum AddressType: String, Encodable {
		case phone, email
	}
}
