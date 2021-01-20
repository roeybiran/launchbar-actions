//
//  Contact.swift
//  ContactsScanner
//
//  Created by Roey Biran on 23/12/2020.
//

import Foundation

struct LBContact: Encodable {
    let title: String
    let subtitle: String
    let badge: String
    let type: AddressType
    let actionArgument: String
    let action = "choice.sh"
    let icon = "font-awesome:fa-address-card"
}
