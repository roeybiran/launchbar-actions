#!/usr/bin/swift

import Foundation

let input = "parcel"

let semaphore = DispatchSemaphore(value: 0)

struct Response: Decodable {
    let items: [ResponseItem]
}

struct ResponseItem: Decodable {
    let name: String
    let description: String?
    let html_url: String
    let stargazers_count: Int
    let owner: Owner

    struct Owner: Decodable {
        let login: String
    }
}

struct LBItem: Encodable {
    let title: String
    let subtitle: String
    let url: String
    let label: String
    let badge: String
    let icon = "font-awesome:fa-github-square"
    let actionRunsInBackground = true
    let quickLookURL: String

    init(title: String, subtitle: String, url: String, stars: Int, owner: ResponseItem.Owner) {
        self.title = title
        self.subtitle = subtitle
        self.url = url
        self.badge = "⭐️ \(stars)"
        self.label = owner.login
        self.quickLookURL = url + "#readme"
    }
}

var urlComponents = URLComponents()
urlComponents.scheme = "https"
urlComponents.host = "api.github.com"
urlComponents.path = "/search/repositories"
urlComponents.queryItems = [
    URLQueryItem(name: "q", value: input),
    URLQueryItem(name: "sort", value: "desc"),
]

enum Error: Swift.Error {
    case castError
    case unknownError
}

let task = URLSession.shared.dataTask(with: URLRequest(url: urlComponents.url!)) { (data, _, err) in
    semaphore.signal()
    do {
        switch (data, err) {
        case (let data?, _):
            let response = try JSONDecoder().decode(Response.self, from: data)
            let output: [LBItem] = response.items.map({
                LBItem(title: $0.name, subtitle: $0.description ?? "", url: $0.html_url, stars: $0.stargazers_count, owner: $0.owner)
            })
            let jsonOutput = try JSONEncoder().encode(output)
            guard let jsonString = String(data: jsonOutput, encoding: .utf8) else { throw Error.castError }
            print(jsonString)
        case (_, let err?):
            throw err
        default:
            throw Error.unknownError
        }
    } catch {
        print(error)
        exit(0)
    }

}

task.resume()
semaphore.wait()

