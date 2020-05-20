import Foundation
import Contacts

if CommandLine.arguments.count <= 1 { exit(EXIT_SUCCESS) }
let query = CommandLine.arguments[1]
let semaphore = DispatchSemaphore(value: 0)

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

let fetchKeys = [CNContactGivenNameKey, CNContactFamilyNameKey, CNContactNicknameKey, CNContactJobTitleKey,
                 CNContactOrganizationNameKey, CNContactDepartmentNameKey, CNContactEmailAddressesKey,
                 CNContactPhoneNumbersKey, CNContactTypeKey].map { $0 as CNKeyDescriptor }
let fetchReuqest = CNContactFetchRequest(keysToFetch: fetchKeys)

let contactsStore = CNContactStore()
contactsStore.requestAccess(for: .contacts) { (didAuthorize, error) in
    if !didAuthorize {
        print("Authorization Error")
        exit(EXIT_SUCCESS)
    }
    semaphore.signal()
}

semaphore.wait()

extension String {
    func removingArtifacts() -> String {
        return self.replacingOccurrences(of: #"\W|_"#, with: "", options: .regularExpression)
    }
}

extension Optional where Wrapped == String {
    func formattedAsLBBadge() -> String {
        var label = ""
        if let self = self, !self.isEmpty {
            label = self.removingArtifacts() + ": "
        }
        return label
    }
}

var allContacts: [LBContact] = []
do {
    try contactsStore.enumerateContacts(with: fetchReuqest, usingBlock: { (contact, _) in
        let firstName = contact.givenName
        let nickname = contact.nickname.isEmpty ? " " : " \"\(contact.nickname)\" "
        let lastName = contact.familyName
        let jobTitle = contact.jobTitle
        let company = contact.organizationName
        let isCompany = contact.contactType.rawValue == 1

        let searchPool = [firstName, nickname, lastName, jobTitle, company]
            .reduce("", +)
            .removingArtifacts()
        if searchPool.range(of: query, options: .caseInsensitive) == nil {
            return
        }

        var title = ""
        var subtitle = ""
        if isCompany {
            title = company
        } else {
            title = "\(firstName)\(nickname)\(lastName)".trimmingCharacters(in: .whitespacesAndNewlines)
            if !jobTitle.isEmpty && !company.isEmpty {
                subtitle = "\(jobTitle), \(company)"
            } else {
                subtitle = "\(jobTitle)\(company)"
            }
        }

        for email in contact.emailAddresses {
            let value = String(email.value)
            let badge = email.label.formattedAsLBBadge() + value
            let contact = LBContact(title: title, subtitle: subtitle, badge: badge, type: .email, actionArgument: value)
            allContacts.append(contact)
        }

        for phone in contact.phoneNumbers {
            let value = phone.value.stringValue
            let badge = phone.label.formattedAsLBBadge() + value
            let contact = LBContact(title: title, subtitle: subtitle, badge: badge, type: .phone, actionArgument: value)
            allContacts.append(contact)
        }
    })
    let json = try JSONEncoder().encode(allContacts)
    let jsonString = String(data: json, encoding: .utf8)!
    print(jsonString)
} catch let error {
    print(error.localizedDescription)
}

