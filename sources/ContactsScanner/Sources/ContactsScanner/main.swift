import Foundation
import Contacts


if CommandLine.arguments.count <= 1 { exit(0) }
let query = CommandLine.arguments[1]
let semaphore = DispatchSemaphore(value: 0)

let fetchKeys = [CNContactGivenNameKey, CNContactFamilyNameKey, CNContactNicknameKey, CNContactJobTitleKey,
                 CNContactOrganizationNameKey, CNContactDepartmentNameKey, CNContactEmailAddressesKey,
                 CNContactPhoneNumbersKey, CNContactTypeKey].map { $0 as CNKeyDescriptor }
let fetchReuqest = CNContactFetchRequest(keysToFetch: fetchKeys)

let contactsStore = CNContactStore()
let status = CNContactStore.authorizationStatus(for: .contacts)
switch status {
case .notDetermined:
    contactsStore.requestAccess(for: .contacts) { (success, error) in
        if !success {
            print("Did not authorize")
            exit(EXIT_SUCCESS)
        }
        semaphore.signal()
    }
    semaphore.wait()
case .denied, .restricted:
    print("Authorization Error")
    exit(EXIT_SUCCESS)
default:
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

try? contactsStore.enumerateContacts(with: fetchReuqest, usingBlock: { (contact, _) in
    let firstName = contact.givenName
    let nickname = contact.nickname.isEmpty ? " " : " \"\(contact.nickname)\" "
    let lastName = contact.familyName
    let jobTitle = contact.jobTitle
    let company = contact.organizationName
    let isCompany = contact.contactType.rawValue == 1

    let searchPool = [firstName, lastName, nickname, jobTitle, company]
        .reduce("", +)
        .filter { $0.isLetter || $0.isNumber }
    if searchPool.range(of: query, options: .caseInsensitive) == nil { return }

    var title = [firstName, nickname, lastName]
        .reduce("", +)
        .trimmingCharacters(in: .whitespacesAndNewlines)
    var subtitle = "\(jobTitle)\(company)"
    if !jobTitle.isEmpty && !company.isEmpty {
        subtitle = "\(jobTitle), \(company)"
    }

    if isCompany {
        title = company
        subtitle = ""
    }

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
})
let json = try JSONEncoder().encode(allContacts)
let jsonString = String(data: json, encoding: .utf8)!
print(jsonString)


