---
to: <%= h.changeCase.paramCase(name) %>/<%= h.changeCase.pascalCase(name) %>/Web3Provider.js
---
(function(window) {
  class Web3Provider {
    constructor() {
      this.networkVersion = undefined
      this.selectedAddress = undefined
      // private
      this.callId = 1
      this._events = {}
      this._callbacks = {}
    }

    isConnected() {
      return true
    }

    enable({ force } = {}) {
      const id = this.callId++;
      return new Promise((resolve, reject) => {
        this.sendAsync({ id, jsonrpc:'2.0', method: 'eth_requestAccounts', params: [force] }, (error, response) => {
          if (error) {
            reject(error)
          } else {
            resolve(response.result)
          }
        })
      })
    }

    send(request, callback) {
      if (callback) {
        this.sendAsync(request, callback)
      } else {
        this._emulateSync(request)
      }
    }

    sendAsync(request, callback) {
      if (Array.isArray(request)) {
        this._processBatch(request, callback);
      } else {
        this._processRequest(request, callback);
      }
    }

    on(type, handler) {
        (this._events[type] || (this._events[type] = [])).push(handler);
    }

    off(type, handler) {
        if (this._events[type]) {
            this._events[type].splice(this._events[type].indexOf(handler) >>> 0, 1);
        }
    }

    emit(type, evt) {
        (this._events[type] || []).slice().map((handler) => { handler(evt); });
        (this._events['*'] || []).slice().map((handler) => { handler(type, evt); });
    }

    _emulateSync(request) {
      var response = null;
      alert("SYNC REQUEST: " + JSON.stringify(request));
      switch (request.method) {
        case "net_version":
          response = this.networkVersion || null;
          break;
        case "eth_accounts":
          response = this.selectedAddress ? [this.selectedAddress] : [];
          break;
        case "eth_coinbase":
          response = this.selectedAddress ? this.selectedAddress : null;
          break;
        case "eth_uninstallFilter":
          this.sendAsync(request, () => {});
          response = true;
          break;
        default:
          throw new Error("Sync call " + request.method + " is not supported.");
      }

      return { id: request.id, jsonrpc: request.jsonrpc, result: response };
    }

    _processRequest(request, callback) {
      const origId = request.id;
      const id = this.callId++;
      request.id = id;
      if (!request.jsonrpc) {
        request.jsonrpc = "2.0";
      }

      this._callbacks[id] = (error, result) => {
        delete this._callbacks[id];

        if (error) {
          var reply = { id: origId, jsonrpc: request.jsonrpc, error: error };
          alert(JSON.stringify(reply));
          callback(reply, null);
        } else {
          var reply = { id: origId, jsonrpc: request.jsonrpc, result: result };
          callback(null, reply);
        }
      };

      const jsonRequest = JSON.stringify(request);
      window.webkit.messageHandlers.tes.postMessage(jsonRequest);
    }

    _processBatch(requests, callback) {
      const batchSize = requests.length;
      var context = { isResponded: false, responses: [] };
      requests.forEach(request => {
        this._processRequest(request, (error, result) => {
          if (context.isResponded) return;
          if (error) {
            callback(error, null);
            context.isResponded = true;
          } else {
            context.responses.push(result);
            if (context.responses.length === batchSize) {
              context.isResponded = true;
              callback(null, context.responses);
            }
          }
        });
      });
    }

    _tes_setState(key, value) {
      this[key] = value
      switch (key) {
        case 'networkVersion': {
          window.tesseract._network = this.networkVersion
          this.emit('networkChanged', this.networkVersion)
          break;
        }
        case 'selectedAddress': {
          window.tesseract._account = this.selectedAddress
          if (window.web3.eth) {
              window.web3.eth.defaultAccount = this.selectedAddress
          }
          this.emit('accountsChanged', this.selectedAddress)
          break;
        }
      }
    }

    _tes_accept(id, error, result) {
      const callback = this._callbacks[id];

      if (callback) {
        const err = JSON.parse(error);
        const res = JSON.parse(result);
        callback(err, res);
      } else {
        alert("WTF! UNKNOWN ID: "+id)
      }
    }
  }

  window.tesseract.logout = function () {
    return new Promise((resolve, reject) => {
      this.provider.sendAsync({ method: "tes_logout", params: [] }, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
      })
    })
  }
 
  window.tesseract.open = function (url) {
    window.webkit.messageHandlers.open.postMessage(url);
  }
 
  const provider = new Web3Provider();
  window.tesseract.provider = provider;
  window.web3 = new window.Web3(provider);
  provider._tes_setState("networkVersion", window.tesseract._network);
  provider._tes_setState("selectedAddress", window.tesseract._account);

  function handleTargetBlank(event) {
    let el = event.target

    while (el.tagName.toLowerCase() !== 'a' || el.target !== '_blank') {
      el = el.parentNode
      if (el.tagName.toLowerCase() === 'body') { return }
    }

    window.tesseract.open(el.href);
  }
 
   window.addEventListener('touchend', handleTargetBlank);
})(window);
