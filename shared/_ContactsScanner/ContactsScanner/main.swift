import Foundation
import Contacts

// https://gist.github.com/mafellows/417acc60566fc8e8e9db8700c61ce06f

if CommandLine.arguments.count == 0 { exit(0) }
let query = CommandLine.arguments[1]

let formatter = PersonNameComponentsFormatter()
formatter.style = .long

let semaphore = DispatchSemaphore(value: 0)
let contactsStore = CNContactStore()
let fetchReuqest = CNContactFetchRequest(
	keysToFetch: [
		CNContactGivenNameKey,
		CNContactFamilyNameKey,
		CNContactNicknameKey,
		CNContactJobTitleKey,
		CNContactOrganizationNameKey,
		CNContactDepartmentNameKey,
		CNContactEmailAddressesKey,
		CNContactPhoneNumbersKey,
		CNContactTypeKey
	]
		.map { $0 as CNKeyDescriptor }
)

let status = CNContactStore.authorizationStatus(for: .contacts)

switch status {
case .notDetermined:
  contactsStore.requestAccess(for: .contacts) { (success, error) in
    if !success {
      print(error?.localizedDescription ?? "Error")
      exit(EXIT_SUCCESS)
    }
    semaphore.signal()
  }
  semaphore.wait()
case .denied, .restricted:
  print("Authorization Error")
  exit(EXIT_FAILURE)
case .authorized:
  fallthrough
@unknown default:
  break
}

var allContacts: [Contact] = []

try? contactsStore.enumerateContacts(with: fetchReuqest) { (contact, _) in
  let firstName = contact.givenName
  let nickname = contact.nickname
  let lastName = contact.familyName
  let jobTitle = contact.jobTitle
  let company = contact.organizationName
  let isCompany = contact.contactType == .organization

	let addresses = contact
		.emailAddresses
		.map {
			Contact.Info(label: $0.label ?? "", value: $0.value as String, type: .email)
		}
	+
		contact
		.phoneNumbers
		.map {
			Contact.Info(label: $0.label ?? "", value: $0.value.stringValue, type: .phone)
		}

  let haystack = [firstName, lastName, nickname, jobTitle, company]
    .joined()
    .filter { $0.isLetter || $0.isNumber }
		.range(of: query, options: [.caseInsensitive, .diacriticInsensitive])

	if haystack == nil { return }

	let title: String
	if isCompany {
		title = company
	} else {
		title = formatter.string(
			from: PersonNameComponents(
				givenName: firstName,
				familyName: lastName,
				nickname: nickname
			)
		)
	}

  let subtitle = [jobTitle, company]
    .filter { !$0.isEmpty }
    .joined(separator: ", ")
    .trimmingCharacters(in: .whitespacesAndNewlines)

	allContacts.append(
		.init(
			title: title,
			subtitle: subtitle,
			addresses: addresses
		)
	)
}

let json = try JSONEncoder().encode(allContacts)
let jsonString = String(data: json, encoding: .utf8)!
print(jsonString)
