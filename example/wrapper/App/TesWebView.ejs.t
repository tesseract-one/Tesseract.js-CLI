---
to: <%= h.changeCase.paramCase(name) %>/<%= h.changeCase.pascalCase(name) %>/TesWebView.swift
---
//
//  TesWebView.swift
//  <%= h.changeCase.pascalCase(name) %>
//
//  Created by Daniel Leping on 15/09/2018.
//  Copyright © 2018 Daniel Leping. All rights reserved.
//

import Foundation
import WebKit
import Tesseract
import Serializable


public enum TesWebMessage {
    case message(id: Int, method: String, message: Data)
    case open(url: String)
    case unknown(name: String, data: Any)
}

private struct MessageHeader: Codable {
    let id: Int
    let method: String
    
    static let decoder = JSONDecoder()
}

private extension WKScriptMessage {
    var tes:TesWebMessage {
        get {
            switch (self.name, self.body) {
            case ("tes", let string as String):
                let data = string.data(using: .utf8)
                return data
                    .flatMap { try? MessageHeader.decoder.decode(MessageHeader.self, from: $0) }
                    .map { header in
                        return .message(id: header.id, method: header.method, message: data!)
                    }!
            case ("open", let url as String):
                return .open(url: url)
            case (let name, let body):
                return .unknown(name: name, data: body)
            }
        }
    }
}

public protocol TesWebSink: AnyObject {
    func reply(id: Int, result: Swift.Result<SerializableValueEncodable, SerializableError>)
}

public protocol TesWebStateSink: AnyObject {
    func setState(key: String, value: SerializableValueEncodable?)
}

typealias TesWebRecepient = (TesWebSink, TesWebMessage) -> Void

private class TesWebViewMessageHandler: NSObject, WKScriptMessageHandler {
    var recepients = [TesWebRecepient]()
    weak var sink:TesWebSink? = nil
    
    public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let sink = sink else {
            fatalError()
        }
        
        let msg = message.tes
        
        for recepient in recepients {
            recepient(sink, msg)
        }
    }
}

public class TesWebView : WKWebView, TesWebSink, TesWebStateSink {
    private let messageHandler = TesWebViewMessageHandler()
    
    private static let encoder = JSONEncoder()
    
    public init(frame: CGRect, installed: Bool, networkId: UInt64, account: String?) {
        //let js = try! assembleJS(files: ["Web3Provider"])
        let serializable: SerializableValue = [
            "_network": Int(networkId),
            "_account": account ?? SerializableValue.nil,
            "installed": installed,
            "provider": SerializableValue.nil
        ]
        var js = "\nwindow.tesseract = " + String(data: try! TesWebView.encoder.encode(serializable), encoding: .utf8)!
        js += ";\n"
        js += try! String(contentsOfFile: Bundle.main.path(forResource: "web3.min", ofType: "js")!, encoding: .utf8)
        js += "\n"
        js += try! String(contentsOfFile: Bundle.main.path(forResource: "Web3Provider", ofType: "js")!, encoding: .utf8)
        
        let userScript = WKUserScript(source: js, injectionTime: .atDocumentStart, forMainFrameOnly: true)
        
        let contentController = WKUserContentController()
        contentController.addUserScript(userScript)
        
        contentController.add(messageHandler, name: "tes")
        contentController.add(messageHandler, name: "open")
        
        let webViewConfiguration = WKWebViewConfiguration()
        webViewConfiguration.preferences.setValue(true, forKey: "developerExtrasEnabled")
        webViewConfiguration.userContentController = contentController
        
        super.init(frame: frame, configuration: webViewConfiguration)
        
        self.allowsBackForwardNavigationGestures = true
        
        messageHandler.sink = self
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
    }
    
    public func addMessage(recepient:@escaping (TesWebSink, TesWebMessage)->Void) {
        messageHandler.recepients.append(recepient)
    }
    
    private func serialize(object: SerializableValueEncodable?) -> String? {
        return object
            .flatMap { $0.serializable.jsonData }
            .flatMap { String(data: $0, encoding: .utf8) }
            .flatMap { $0.replacingOccurrences(of: "'", with: "\\'") }
    }
    
    private func assembleMessageCall(id:Int, error: SerializableValueEncodable?, result: SerializableValueEncodable?) -> String {
        let err = error.flatMap(serialize) ?? "null"
        let res = result.flatMap(serialize) ?? "null"
        return "window.tesseract.provider._tes_accept(\(id), '\(err)', '\(res)');"
    }
    
    public func setState(key: String, value: SerializableValueEncodable?) {
        let k = serialize(object: key)!
        let v = value.flatMap(serialize) ?? "null"
        let js = "window.tesseract.provider._tes_setState('\(k)', '\(v)');"
        DispatchQueue.main.async {
            self.evaluateJavaScript(js)
        }
    }
    
    public func reply(id: Int, result: Swift.Result<SerializableValueEncodable, SerializableError>) {
        var js: String
        switch result {
        case .failure(let err):
            js = assembleMessageCall(id: id, error: err, result: nil)
        case .success(let val):
            js = assembleMessageCall(id: id, error: nil, result: val)
        }
        //print(js)
        DispatchQueue.main.async {
            self.evaluateJavaScript(js)
        }
    }
}
