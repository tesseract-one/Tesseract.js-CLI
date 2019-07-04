---
to: <%= h.changeCase.paramCase(name) %>/<%= h.changeCase.pascalCase(name) %>/Wallet.swift
---
//
//  Wallet.swift
//  <%= h.changeCase.pascalCase(name) %>
//
//  Created by Yehor Popovych on 3/17/19.
//  Copyright © 2019 Daniel Leping. All rights reserved.
//

import Foundation
import Tesseract
import Serializable

extension UserDefaults {
    public var account: String? {
        get {
            return self.string(forKey: "ACTIVE_ACCOUNT")
        }
        set(account) {
            self.set(account, forKey: "ACTIVE_ACCOUNT")
        }
    }
}

class Wallet {
    typealias AccountRequest = (id: Int, method: String, cb: (Int, Swift.Result<SerializableValueEncodable, SerializableError>) -> Void)
    
    private let web3: Web3
    private weak var webState: TesWebStateSink?
    
    private static var encoder = JSONEncoder()
    private static var decoder = JSONDecoder()
    
    let settings = UserDefaults.standard
    
    private var _account: Address? = nil
    
    public var account: Address? {
        get {
            return _account
        }
        set (account) {
            if let account = account {
                webState?.setState(key: "selectedAddress", value: account.hex(eip55: false))
                settings.account = account.hex(eip55: false)
            } else {
                webState?.setState(key: "selectedAddress", value: nil)
                settings.account = nil
            }
            _account = account
        }
    }
    
    private var pendingAccountsRequests: Array<AccountRequest> = []
    
    init(web3: Web3, netId: UInt64, webState: TesWebStateSink) {
        self.web3 = web3
        self.webState = webState
        if let str = settings.account, let account = try? Address(hex: str, eip55: false) {
            self.account = account
        }
    }
    
    //rewrite to processors
    func request(
        id: Int, method:String, message: Data, callback: @escaping (Int, Swift.Result<SerializableValueEncodable, SerializableError>) -> Void
        ) {
        print("REQ", String(data: message, encoding: .utf8) ?? "UNKNOWN")
        switch method {
        case "eth_requestAccounts": fallthrough
        case "eth_accounts": fallthrough
        case "eth_coinbase":
            if let account = self.account {
                if method == "eth_coinbase" {
                    callback(id, .success(account.hex(eip55: false)))
                } else {
                    callback(id, .success([account.hex(eip55: false)]))
                }
            } else {
                pendingAccountsRequests.append((id: id, method: method, cb: callback))
                if pendingAccountsRequests.count == 1 {
                    web3.eth.accounts() { res in
                        switch res {
                        case .success(let accounts):
                            self.account = accounts.first
                            self._respondToAccounts(response: .success(accounts))
                        case .failure(let err): self._respondToAccounts(response: .failure(.error(err)))
                        }
                    }
                }
            }
        case "eth_signTypedData": fallthrough
        case "eth_signTypedData_v3": fallthrough
        case "personal_signTypedData": fallthrough
        case "personal_signTypedData_v3":
            let params = try! Wallet.decoder.decode(RPCRequest<SignTypedDataCallParams>.self, from: message).params
            web3.eth.signTypedData(account: params.account, data: params.data) { res in
                self._handleError(id, res.map { $0.hex }, callback)
            }
        case "personal_sign":
            let params = try! Wallet.decoder.decode(RPCRequest<[Ethereum.Value]>.self, from: message).params
            let account = try! Address(ethereumValue: params[1])
            web3.personal.sign(message: params[0].data!, account: account, password: "") { res in
                self._handleError(id,  res.map { $0.hex }, callback)
            }
        case "eth_sign":
            let params = try! Wallet.decoder.decode(RPCRequest<[Ethereum.Value]>.self, from: message).params
            let account = try! Address(ethereumValue: params[0])
            web3.eth.sign(account: account, message: params[1].data!) { res in
                self._handleError(id, res.map { $0.hex }, callback)
            }
        case "eth_sendTransaction":
            let tx = try! Wallet.decoder.decode(RPCRequest<[Transaction]>.self, from: message).params[0]
            web3.eth.sendTransaction(transaction: tx) { res in
                self._handleError(id, res.map { $0.hex }, callback)
            }
        case "eth_newFilter":
            let params = try! Wallet.decoder.decode(RPCRequest<[NewFilterParams]>.self, from: message).params[0]
            web3.eth.newFilter(fromBlock: params.fromBlock, toBlock: params.toBlock, address: params.address, topics: params.topics) { res in
                self._handleError(id, res.map { $0.hex }, callback)
            }
        case "eth_newPendingTransactionFilter":
            web3.eth.newPendingTransactionFilter() { res in
                self._handleError(id, res.map { $0.hex }, callback)
            }
        case "eth_newBlockFilter":
            web3.eth.newBlockFilter() { res in
                self._handleError(id, res.map { $0.hex }, callback)
            }
        case "eth_getFilterLogs":
            let quantity = try! Wallet.decoder.decode(RPCRequest<[Ethereum.Value]>.self, from: message).params[0]
            web3.eth.getFilterLogs(id: quantity.quantity!) { res in
                self._handleError(id, res.map { self._asJsonObject(obj: $0) }, callback)
            }
            
        case "eth_getFilterChanges":
            let quantity = try! Wallet.decoder.decode(RPCRequest<[Ethereum.Value]>.self, from: message).params[0]
            web3.eth.getFilterChanges(id: quantity.quantity!) { res in
                self._handleError(id, res.map { self._asJsonObject(obj: $0) }, callback)
            }
        case "eth_uninstallFilter":
            let quantity = try! Wallet.decoder.decode(RPCRequest<[Ethereum.Value]>.self, from: message).params[0]
            web3.eth.uninstallFilter(id: quantity.quantity!) { res in
                self._handleError(id, res.map{ $0 }, callback)
            }
        case "eth_call":
            var params = try! Wallet.decoder.decode(RPCRequest<CallParams>.self, from: message).params
            if params.from == nil, let account = self.account {
                let call = Call(
                    from: account, to: params.to, gas: params.gas,
                    gasPrice: params.gasPrice, value: params.value, data: params.data
                )
                params = CallParams(call: call, block: params.block)
            }
            web3.eth.call(call: params.call, block: params.block) { res in
                self._handleError(id, res.map { $0.hex }, callback)
            }
        case "tes_logout":
            self.account = nil
            callback(id, .success(true))
        default:
            var req = try! Wallet.decoder.decode(SerializableValue.self, from: message).object!
            req["id"] = web3.rpcId.serializable
            web3.provider.dataProvider.send(data: SerializableValue(req).jsonData) { result in
                let res: Swift.Result<SerializableValueEncodable, SerializableError> = result
                    .map { res in
                        let js = try! Wallet.decoder.decode(SerializableValue.self, from: res)
                        return js.object!["result"]
                    }
                    .mapError { .error($0) }
                callback(id, res)
            }
        }
    }
    
    private func _handleError(_ id: Int, _ result: Swift.Result<SerializableValueEncodable, ProviderError>, _ callback: @escaping (Int, Swift.Result<SerializableValueEncodable, SerializableError>) -> Void) {
        switch result {
        case .success(let val): callback(id, .success(val))
        case .failure(let err):
            if case .signProviderError(let signError) = err, case .accountDoesNotExist(_) = signError {
                self.account = nil
            }
            callback(id, .failure(.error(err)))
        }
    }
    
    private func _respondToAccounts(response: Swift.Result<[Address], SerializableError>) {
        switch response {
        case .failure(let err):
            for req in pendingAccountsRequests {
                req.cb(req.id, .failure(err))
            }
        case .success(let accs):
            let accounts = accs.map{$0.hex(eip55: false)}
            for req in pendingAccountsRequests {
                if req.method == "eth_coinbase" {
                    req.cb(req.id, .success(accounts.first))
                } else {
                    req.cb(req.id, .success(accounts))
                }
            }
            account = accs.first
        }
        pendingAccountsRequests.removeAll()
    }
    
    private func _asJsonObject<E: Encodable>(obj: E) -> SerializableValue {
        let data = try! Wallet.encoder.encode(obj)
        return try! Wallet.decoder.decode(SerializableValue.self, from: data)
    }
}


extension Wallet {
    func process(sink:TesWebSink, webMessage:TesWebMessage) -> Void {
        guard case .message(id: let id, method: let method, message: let message) = webMessage else {
            return
        }
        request(id: id, method: method, message: message) { id, result in
            sink.reply(id: id, result: result)
        }
    }
    
    func link(web: TesWebView) {
        web.addMessage(recepient: process)
    }
}
