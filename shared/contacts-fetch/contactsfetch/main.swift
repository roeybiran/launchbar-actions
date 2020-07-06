//
//  main.swift
//  contactsfetch
//
//  Created by Roey Biran on 28/05/2020.
//  Copyright © 2020 Roey Biran. All rights reserved.
//

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
do {
    try contactsStore.enumerateContacts(with: fetchReuqest, usingBlock: { (contact, _) in
        let firstName = contact.givenName
        let nickname = contact.nickname.isEmpty ? " " : " \"\(contact.nickname)\" "
        let lastName = contact.familyName
        let jobTitle = contact.jobTitle
        let company = contact.organizationName
        let isCompany = contact.contactType.rawValue == 1

        let searchPool = [firstName, lastName, nickname, jobTitle, company]
            .reduce("", +)
            .filter { $0.isLetter || $0.isNumber }
        let range = searchPool.range(of: query, options: .caseInsensitive)
        if range == nil {
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

        func extractValues<T>(addresses: [CNLabeledValue<T>], keyPath: KeyPath<CNLabeledValue<T>, T>, type: AddressType) {
            addresses.forEach( { print($0[keyPath: keyPath]) })
            let contacts = addresses.map({ address in
                let value = address.value
                let badge = address[keyPath: keyPath]
            })
        }

        // extractValues(addresses: contact.emailAddresses, keyPath: \.value, type: .email)

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
} catch let error {
    print(error.localizedDescription)
}

// func extractValues<T>(type: AddressType, from contact: [CNLabeledValue<T>], keyPath: KeyPath<CNLabeledValue<T>, T>) -> [LBContact] {
//     return contact.map {
//         let value = $0[keyPath: keyPath]
//         let badge = $0.label.formattedAsLBBadge() + value
//         return LBContact(title: title, subtitle: subtitle, badge: badge, type: type, actionArgument: value)
//     }
// }
//
//
//
// let a = extractValues(type: .email, from: contact.emailAddresses.first!, keyPath: \.value)
// print("keypath" + String(a))
// extension Sequence {
//     func map<T>(_ keyPath: KeyPath<Element, T>) -> [T] {
//         return map { $0[keyPath: keyPath] }
//     }
// }

// func extractValues<T>(type: AddressType,
//                       addresses: [CNLabeledValue<T>],
//                       closure: ([CNLabeledValue<T>]) -> [(value: String, badge: String?)]) -> [LBContact] {
//     return closure(addresses).map { address in
//         return LBContact(title: title, subtitle: subtitle, badge: address.badge.formattedAsLBBadge() + address.value, type: type, actionArgument: address.value)
//     }
// }
//
// extractValues(type: .email, addresses: contact.emailAddresses, closure: { addresses in
//     return addresses.map { (String($0.value), $0.label) }
// })
//
//
// allContacts.append(contentsOf:
//     contact.emailAddresses.map {
//         let value = String($0.value)
//         let badge = $0.label.formattedAsLBBadge() + value
//         return LBContact(title: title, subtitle: subtitle, badge: badge, type: .email, actionArgument: value)
//     }
// )
