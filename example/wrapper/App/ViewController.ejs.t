---
to: <%= h.changeCase.paramCase(name) %>/<%= h.changeCase.pascalCase(name) %>/ViewController.swift
---
//
//  ViewController.swift
//  <%= h.changeCase.pascalCase(name) %>
//
//  Created by Daniel Leping on 06/09/2018.
//  Copyright © 2018 Daniel Leping. All rights reserved.
//

import UIKit
import WebKit
import Tesseract

public let TESSERACT_ETHEREUM_ENDPOINTS: Dictionary<UInt64, String> = [
    1: "https://mainnet.infura.io/v3/f20390fe230e46608572ac4378b70668",
    2: "https://ropsten.infura.io/v3/f20390fe230e46608572ac4378b70668",
    3: "https://kovan.infura.io/v3/f20390fe230e46608572ac4378b70668",
    4: "https://rinkeby.infura.io/v3/f20390fe230e46608572ac4378b70668"
]

class ViewController: UIViewController, WKUIDelegate, WKNavigationDelegate {
    var appUrl: URL? = nil
    var netVersion: UInt64? = nil
    
    var wallet:Wallet? = nil
    
    var loadingView: UIImageView?
    
    func webView(_ webView: WKWebView,
                 didFailProvisionalNavigation navigation: WKNavigation!,
                 withError error: Error) {
        print("Provisional navigation error:", error)
    }
    
    func webView(_ webView: WKWebView,
                 didFail navigation: WKNavigation!,
                 withError error: Error) {
        print("Navigation error:", error)
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        guard let loadingView = self.loadingView else { return }
        
        self.loadingView = nil
        
        UIView.animate(
            withDuration: 0.5,
            animations: { loadingView.alpha = 0 }
        ) { _ in
            loadingView.removeFromSuperview()
        }
    }
    
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        print("JSLOG:", message)
        completionHandler()
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
        let installed = Tesseract.Ethereum.isKeychainInstalled
        
        for view in self.view.subviews {
            view.removeFromSuperview()
        }
        
        let netVersion: UInt64 = 1
        let appUrl = URL(string:"https://beta.cent.co")
        
        let webView = TesWebView(
            frame: self.view.frame,
            installed: installed,
            networkId: netVersion,
            account: UserDefaults.standard.account
        )
        

        let endpoint = TESSERACT_ETHEREUM_ENDPOINTS[netVersion]!
        
        wallet = Wallet(
            web3: Tesseract.Ethereum.Web3(rpcUrl: endpoint),
            netId: netVersion,
            webState: webView
        )
        
        let myRequest = URLRequest(url: appUrl!)
        
        title = appUrl?.host
    
        wallet?.link(web: webView)
        
        self.view.addSubview(webView)
        
        webView.translatesAutoresizingMaskIntoConstraints = false
        let attributes: [NSLayoutConstraint.Attribute] = [.bottom, .top, .right, .left]
        NSLayoutConstraint.activate(attributes.map {
            NSLayoutConstraint(item: webView, attribute: $0, relatedBy: .equal, toItem: webView.superview, attribute: $0, multiplier: 1, constant: 0)
        })
        
        webView.uiDelegate = self
        webView.navigationDelegate = self
        webView.load(myRequest)
        
        let imageView = UIImageView(image: UIImage(named: "SplashImage"))
        imageView.contentMode = .scaleToFill
        
        self.view.addSubview(imageView)
        
        imageView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate(attributes[1...].map {
            NSLayoutConstraint(item: imageView, attribute: $0, relatedBy: .equal, toItem: imageView.superview!.safeAreaLayoutGuide, attribute: $0, multiplier: 1, constant: 0)
        })
        NSLayoutConstraint.activate([NSLayoutConstraint(item: imageView, attribute: .bottom, relatedBy: .equal, toItem: imageView.superview!, attribute: .bottom, multiplier: 1, constant: 0)
        ])
        loadingView = imageView
        // Do any additional setup after loading the view, typically from a nib.
        changeStatusBarBackground()
    }
    
    private func changeStatusBarBackground() {
        let statusBarView = UIView(frame: UIApplication.shared.statusBarFrame)
        let statusBarColor = UIColor(red: <%= red %>, green: <%= green %>, blue: <%= blue %>, alpha: 1.0)
        statusBarView.backgroundColor = statusBarColor
        statusBarView.autoresizingMask = [.flexibleWidth, .flexibleTopMargin]
        view.addSubview(statusBarView)
    }
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return <%= barStyle %>
    }
}

