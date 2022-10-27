"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _crypto = require('crypto');
var secret = "e20fb4927bb565826e219464905229d0";
function sha256(message) {
    return _crypto.createHash('sha256').update(message).digest('hex');
}
var API = /** @class */ (function () {
    function API() {
    }
    API.getBody = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var digest;
            return __generator(this, function (_a) {
                digest = sha256(body.payload + body.salt + secret);
                if (digest == body.digest) {
                    return [2 /*return*/, JSON.parse(body.payload)];
                }
                return [2 /*return*/];
            });
        });
    };
    return API;
}());
var fs = require('fs');
var http = require('http');
var mime = require('mime-types');
var LocalStorage = require("node-localstorage").LocalStorage;
var _localStorage = new LocalStorage('./scratch');
var rootDirectory = "../../html/";
var portNumber = 86;
var appRootPath = "/zlsspaceinvader";
function readJSON(request) {
    return new Promise(function (resolve, reject) {
        var data = "";
        request.on("data", function (chunk) {
            data += chunk.toString();
        });
        request.on("end", function () {
            resolve(JSON.parse(data));
        });
        request.on("error", function (e) {
            reject(e);
        });
    });
}
http.createServer(function (request, response) {
    var url = request.url;
    if (url.startsWith(appRootPath)) {
        url = url.substring(appRootPath.length);
        switch (url) {
            case "":
            case "/":
                response.end("\n            <head>\n                <meta http-equiv=\"Refresh\" content=\"0; URL=".concat(appRootPath, "/index.html\">\n            </head>\n            "));
                break;
            case "/leaderboard":
                Leaderboard.shared.handle(request, response);
                break;
            default:
                // The filename is simple the local directory and tacks on the requested url
                var filename = rootDirectory + decodeURI(url);
                // This line opens the file as a readable stream
                var readStream_1 = fs.createReadStream(filename);
                // This will wait until we know the readable stream is actually valid before piping
                readStream_1.on('open', function () {
                    response.setHeader("Content-Type", mime.lookup(url));
                    // This just pipes the read stream to the response object (which goes to the client)
                    readStream_1.pipe(response);
                });
                // This catches any errors that happen while creating the readable stream (usually invalid names)
                readStream_1.on('error', function (err) {
                    response.end(err.stack);
                });
                break;
        }
    }
    else {
        response.end("Unknown app.");
    }
}).listen(portNumber);
var Leaderboard = /** @class */ (function () {
    function Leaderboard() {
        this.records = JSON.parse(_localStorage.getItem(Leaderboard.recordsKey) || "[]");
    }
    Leaderboard.prototype.handle = function (request, response) {
        switch (request.method.toUpperCase()) {
            case "GET":
                response.writeHead(200);
                response.end(JSON.stringify(this.records));
                break;
            case "POST":
                this.handlePostRecord(request, response);
                break;
        }
    };
    Leaderboard.prototype.handlePostRecord = function (request, response) {
        var _this = this;
        readJSON(request).then(function (json) { return __awaiter(_this, void 0, void 0, function () {
            var body, name, score, wave;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, API.getBody(json)];
                    case 1:
                        body = _a.sent();
                        name = body.name;
                        score = body.score;
                        wave = body.wave;
                        if (typeof (name) == "string" &&
                            typeof (score) == "number" &&
                            name.match(/[A-Z]{3}/i) &&
                            name.length == 3) {
                            this.postRecord({
                                name: name,
                                score: score,
                                wave: wave,
                                time: Date.now()
                            });
                            response.writeHead(200);
                            response.end(JSON.stringify({ state: "OK" }));
                        }
                        else {
                            response.writeHead(400);
                            response.end(JSON.stringify({ state: "FAIL" }));
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Leaderboard.prototype.postRecord = function (record) {
        this.records.push(record);
        this.records.sort(function (a, b) { return b.score - a.score; });
        if (this.records.length > Leaderboard.maxRecord)
            this.records.length = Leaderboard.maxRecord;
        _localStorage.setItem(Leaderboard.recordsKey, JSON.stringify(this.records));
    };
    Leaderboard.maxRecord = 500;
    Leaderboard.recordsKey = "Leaderboard.records";
    Leaderboard.shared = new Leaderboard();
    return Leaderboard;
}());
