//
//  Junk.swift
//  ContactsScanner
//
//  Created by Roey Biran on 23/12/2020.
//

import Foundation

// https://gist.github.com/mafellows/417acc60566fc8e8e9db8700c61ce06f

// struct Contact {
//     let name: String
//
//     init?(_ contact: CNContact) {
//         guard let name = CNContactFormatter.string(from: contact, style: .fullName) else { return nil }
//         self.name = name
//     }
// }
//
// let formatter = CNContactFormatter()
// let predicate = CNContact.predicateForContacts(matchingName: "rotem")
// let nameKey = CNContactFormatter.descriptorForRequiredKeys(for: .fullName)
// let additionalKeys = [CNContactNicknameKey, CNContactJobTitleKey]
// do {
//     let contacts: [Contact] = try contactsStore
//         .unifiedContacts(matching: predicate, keysToFetch: [nameKey])
//         .compactMap { Contact($0) }
//     print(contacts)
// } catch {
//     print(error)
// }
