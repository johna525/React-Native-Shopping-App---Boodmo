BetaOut.callbackID = 0;

BetaOut.delegateCallURL = function() {
    if (!arguments.length) {
        throw new Error("BetaOut.delegateCallURL expects at least one function argument");
    }
    
    var argumentsArray = Array.prototype.slice.call(arguments);
    
    //treat the first arguments as the command name
    var name = argumentsArray[0];
    
    //the rest are path arguments and query options
    var args = argumentsArray.slice(1);
    
    var uri = [];
    var dict = null;
    
    // get arguments and dictionary
    for (var i = 0; i < args.length; i++) {
        
        var arg = args[i];
        
        if (arg === undefined || arg === null) {
            arg = '';
        }
        
        if (typeof(arg) == 'object') {
            dict = arg;
        } else {
            uri.push(encodeURIComponent(arg));
        }
    }
    
    // flatten arguments into url
    var url = "betaout://" + name + "/" + uri.join("/");
    
    // flatten dictionary into url
    if (dict !== null) {
        var query_args = [];
        for (var name in dict) {
            query_args.push(encodeURIComponent(name) + "=" + encodeURIComponent(dict[name]));
        }
        
        if (query_args.length > 0) {
            url += "?" + query_args.join("&");
        }
    }
    
    return url;
}

BetaOut.invoke = function(url) {
    var frame = document.createElement('iframe');
    frame.style.display = 'none';
    frame.src = url;
    
    document.body.appendChild(frame);
    frame.parentNode.removeChild(frame);
}

BetaOut.runAction = function(actionName, argument, callback) {
    
    var opt = {};
    
    BetaOut.callbackID++;
    var callbackKey = 'bo-cb-' + (BetaOut.callbackID);
    
    //argument = decodeURIComponent(argument.replace(/\+/g, " "));
    opt[actionName] = JSON.stringify(argument);
    
    var url = BetaOut.delegateCallURL('run-action-cb', callbackKey, opt);
    
    window[callbackKey] = onready;
    
    function onready(err, data) {
        delete window[callbackKey];
        
        if (!callback) {
            return;
        }
        
        if(err) {
            callback(err);
        } else {
            callback(null, data);
        }
    }
    
    BetaOut.invoke(url);
    
    //var x = document.getElementsByTagName('p');
    //x[0].innerHTML =  'success' + url;
}

BetaOut.finishAction = function(err, data, callbackKey) {
    if (callbackKey in window) {
        var cb = window[callbackKey];
        cb(err, data);
    };
}

BetaOut.close = function() {
    BetaOut.runAction('__close_window_action', null, null);
}

BetaOut.isReady = true;

//var boLibraryReadyEvent = document.createEvent('Event');
//boLibraryReadyEvent.initEvent('bolibraryready', true, true);
//document.dispatchEvent(boLibraryReadyEvent);