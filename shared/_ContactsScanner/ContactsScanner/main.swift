//

import Foundation
import Contacts

enum AddressType: String, Encodable {
  case phone, email
}

struct LBContact: Encodable {
  let title: String
  let subtitle: String
  let badge: String
  let type: AddressType
  let actionArgument: String
  let action = "choice.sh"
  let icon = "font-awesome:fa-address-card"
}

if CommandLine.arguments.count == 0 { exit(0) }
let query = CommandLine.arguments[1]

let fetchKeys = [
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

let fetchReuqest = CNContactFetchRequest(keysToFetch: fetchKeys)

let semaphore = DispatchSemaphore(value: 0)

let contactsStore = CNContactStore()
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
  exit(EXIT_SUCCESS)
case .authorized:
  fallthrough
@unknown default:
  break
}

func makeBadge(_ txt: String?) -> String {
  var label = ""
  if let txt = txt, !txt.isEmpty {
    label = "\(txt.filter { $0.isLetter || $0.isNumber }): "
  }
  return label
}

var allContacts: [LBContact] = []

try? contactsStore.enumerateContacts(with: fetchReuqest) { (contact, _) in
  let firstName = contact.givenName
  let nickname = contact.nickname
  let lastName = contact.familyName
  let jobTitle = contact.jobTitle
  let company = contact.organizationName
  let isCompany = contact.contactType == .organization

  let haystack = [firstName, lastName, nickname, jobTitle, company]
    .joined()
    .filter { $0.isLetter || $0.isNumber }
  if haystack.range(of: query, options: [.caseInsensitive, .diacriticInsensitive]) == nil { return }

  let title = isCompany ? company : [firstName, nickname.isEmpty ? "" : "“\(nickname)”", lastName]
    .filter { !$0.isEmpty }
    .joined(separator: " ")
    .trimmingCharacters(in: .whitespacesAndNewlines)

  let subtitle = [jobTitle, company]
    .filter { !$0.isEmpty }
    .joined(separator: ", ")
    .trimmingCharacters(in: .whitespacesAndNewlines)

  for email in contact.emailAddresses {
    let value = String(email.value)
    let badge = makeBadge(email.label) + value
    let contact = LBContact(title: title, subtitle: subtitle, badge: badge, type: .email, actionArgument: value)
    allContacts.append(contact)
  }

  for phone in contact.phoneNumbers {
    let value = phone.value.stringValue
    let badge = makeBadge(phone.label) + value
    let contact = LBContact(title: title, subtitle: subtitle, badge: badge, type: .phone, actionArgument: value)
    allContacts.append(contact)
  }
}

let json = try JSONEncoder().encode(allContacts)
let jsonString = String(data: json, encoding: .utf8)!
print(jsonString)

// https://gist.github.com/mafellows/417acc60566fc8e8e9db8700c61ce06f

// struct Contact {
//   let name: String
//   init?(_ contact: CNContact) {
//     guard let name = CNContactFormatter.string(from: contact, style: .fullName) else { return nil }
//     self.name = name
//   }
// }

// let formatter = CNContactFormatter()
// let predicate = CNContact.predicateForContacts(matchingName: "")
// let nameKey = CNContactFormatter.descriptorForRequiredKeys(for: .fullName)
// let additionalKeys = [CNContactNicknameKey, CNContactJobTitleKey]
// do {
//   let contacts: [Contact] = try contactsStore
//     .unifiedContacts(matching: predicate, keysToFetch: [nameKey])
//     .compactMap { Contact($0) }
//   print(contacts)
// } catch {
//   print(error)
// }
//
