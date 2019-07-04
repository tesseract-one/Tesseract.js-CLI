---
to: <%= h.changeCase.paramCase(name) %>/<%= h.changeCase.pascalCase(name) %>/JSON.swift
---
//
//  JSON.swift
//  <%= h.changeCase.pascalCase(name) %>
//
//  Created by Yehor Popovych on 3/17/19.
//  Copyright © 2019 Daniel Leping. All rights reserved.
//

import Foundation
import Tesseract
import Serializable

extension SerializableValue {
    
    public var jsonData: Data {
        switch self {
        case .nil: return "null".data(using: .utf8)!
        case .bool(let bool): return (bool ? "true" : "false").data(using: .utf8)!
        case .int(let num): return "\(num)".data(using: .utf8)!
        case .float(let num): return "\(num)".data(using: .utf8)!
        case .string(let str):
            let fixed = str.replacingOccurrences(of: "\"", with: "\\\"")
            return "\"\(fixed)\"".data(using: .utf8)!
        default:
            return try! JSONEncoder().encode(self)
        }
    }
}

public typealias SerializableError = SerializableValue

extension SerializableError: Error {}

extension NSError: SerializableValueEncodable {
    
    public var serializable: SerializableValue {
        return [
            "code": code,
            "domain": domain,
            "debug": debugDescription.replacingOccurrences(of: "\"", with: "\\\""),
            "description": description.replacingOccurrences(of: "\"", with: "\\\"")
        ]
    }
}

extension SerializableError {
    static func error(_ err: Swift.Error) -> SerializableError {
        if let error = err as? ProviderError, case .rpcError(let rpc) = error {
            return [
                "code": rpc.code,
                "message": rpc.message.replacingOccurrences(of: "\"", with: "\\\"")
            ]
        }
        return [
            "code": (-32000),
            "message": err.localizedDescription.replacingOccurrences(of: "\"", with: "\\\""),
            "data": (err as NSError)
        ]
    }
    
    static func web3Error(code: Int, message: String) -> SerializableError {
        return [
            "code": code,
            "message": message.replacingOccurrences(of: "\"", with: "\\\"")
        ]
    }
}
