"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var Vector2 = /** @class */ (function () {
        function Vector2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Vector2.prototype.clone = function () {
            return new Vector2(this.x, this.y);
        };
        Vector2.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
            return this;
        };
        Vector2.prototype.distance = function (v) {
            var dx = this.x - v.x;
            var dy = this.y - v.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        Vector2.prototype.set = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Vector2.prototype.add = function (v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        };
        Vector2.prototype.addScaled = function (v, scale) {
            this.x += v.x * scale;
            this.y += v.y * scale;
            return this;
        };
        Vector2.prototype.sub = function (v1, v2) {
            if (v2) {
                this.x = v1.x - v2.x;
                this.y = v1.y - v2.y;
            }
            else {
                this.x -= v1.x;
                this.y -= v1.y;
            }
            return this;
        };
        Vector2.prototype.multiply = function (n) {
            this.x *= n;
            this.y *= n;
        };
        Vector2.prototype.abs = function () {
            this.x = Math.abs(this.x);
            this.y = Math.abs(this.y);
        };
        Vector2.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };
        Vector2.prototype.normalize = function () {
            var l = this.length();
            if (l != 0)
                this.multiply(1 / l);
            return this;
        };
        Vector2.prototype.angle = function (v) {
            if (v === undefined) {
                // FROM: https://github.com/mrdoob/three.js/blob/dev/src/math/Vector2.js
                // computes the angle in radians with respect to the positive x-axis
                var angle = Math.atan2(-this.y, -this.x) + Math.PI;
                return angle;
            }
            else {
                return this.angle() - v.angle();
            }
        };
        // FROM: https://github.com/mrdoob/three.js/blob/dev/src/math/Vector2.js
        Vector2.prototype.rotateAround = function (angle) {
            var c = Math.cos(angle), s = Math.sin(angle);
            var x = this.x;
            var y = this.y;
            this.x = x * c - y * s;
            this.y = x * s + y * c;
            return this;
        };
        return Vector2;
    }());
    zlsSpaceInvader.Vector2 = Vector2;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var GameObject = /** @class */ (function () {
        function GameObject() {
            this.pos = new zlsSpaceInvader.Vector2;
            this.paused = false;
            this.renderHalf = true;
            this.renderOrder = 0;
            this.visible = true;
            this.waitPromises = [];
        }
        GameObject.prototype.update = function (deltaTime) {
            for (var _i = 0, _a = Array.from(this.waitPromises); _i < _a.length; _i++) {
                var w = _a[_i];
                w.time -= deltaTime;
                if (w.time <= 0) {
                    w.resolve(-w.time);
                    w.resolved = true;
                }
            }
            this.waitPromises = this.waitPromises.filter(function (w) { return !w.resolved; });
        };
        GameObject.prototype.render = function (deltaTime, ctx) { };
        GameObject.prototype.removeFromManager = function () {
            for (var _i = 0, _a = this.waitPromises; _i < _a.length; _i++) {
                var w = _a[_i];
                w.reject(new Error("Object removed."));
            }
            this.waitPromises.length = 0;
            this.manager && this.manager.remove(this);
        };
        GameObject.prototype.wait = function (time) {
            var _this = this;
            if (this.manager) {
                return new Promise(function (resolve, reject) {
                    _this.waitPromises.push({
                        time: time,
                        resolve: resolve,
                        reject: reject,
                        resolved: false
                    });
                });
            }
            else {
                return Promise.reject(new Error("Manager is undefined"));
            }
        };
        return GameObject;
    }());
    zlsSpaceInvader.GameObject = GameObject;
    var SpriteObject = /** @class */ (function (_super) {
        __extends(SpriteObject, _super);
        function SpriteObject(sprite) {
            var _this = _super.call(this) || this;
            _this.sprite = sprite;
            _this.pos = new zlsSpaceInvader.Vector2;
            return _this;
        }
        SpriteObject.prototype.render = function (deltaTime, ctx) {
            _super.prototype.render.call(this, deltaTime, ctx);
            ctx.drawImage(this.sprite, Math.floor(this.pos.x - this.sprite.width / 2), Math.floor(this.pos.y - this.sprite.height / 2));
        };
        return SpriteObject;
    }(GameObject));
    zlsSpaceInvader.SpriteObject = SpriteObject;
    var GameObjectManager = /** @class */ (function () {
        function GameObjectManager() {
            this.gameObjects = [];
        }
        GameObjectManager.prototype.add = function (o) {
            o.removeFromManager();
            this.gameObjects.push(o);
            o.manager = this;
        };
        GameObjectManager.prototype.remove = function (o) {
            if (o.manager === this) {
                this.gameObjects = this.gameObjects.filter(function (_o) { return _o !== o; });
                o.manager = undefined;
            }
        };
        GameObjectManager.prototype.update = function (deltaTime) {
            for (var _i = 0, _a = Array.from(this.gameObjects); _i < _a.length; _i++) {
                var o = _a[_i];
                if (!o.paused)
                    o.update(deltaTime);
            }
        };
        GameObjectManager.prototype.render = function (deltaTime, ctx) {
            for (var _i = 0, _a = this.gameObjects.filter(function (o) { return !o.renderHalf && o.visible; }).sort(function (a, b) { return a.renderOrder - b.renderOrder; }); _i < _a.length; _i++) {
                var o = _a[_i];
                o.render(deltaTime, ctx);
            }
        };
        GameObjectManager.prototype.renderHalf = function (deltaTime, ctx) {
            for (var _i = 0, _a = this.gameObjects.filter(function (o) { return o.renderHalf && o.visible; }).sort(function (a, b) { return a.renderOrder - b.renderOrder; }); _i < _a.length; _i++) {
                var o = _a[_i];
                o.render(deltaTime, ctx);
            }
        };
        return GameObjectManager;
    }());
    zlsSpaceInvader.GameObjectManager = GameObjectManager;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var v = new zlsSpaceInvader.Vector2;
    var EnemyFlight = /** @class */ (function (_super) {
        __extends(EnemyFlight, _super);
        function EnemyFlight(sprite, scorer, score, onHitPlayer) {
            if (score === void 0) { score = 100; }
            var _this = _super.call(this, sprite) || this;
            _this.scorer = scorer;
            _this.score = score;
            _this.onHitPlayer = onHitPlayer;
            _this.flashTime = 0;
            _this.hp = 3;
            _this.vel = new zlsSpaceInvader.Vector2;
            _this.rotate = 0;
            _this.invincible = false;
            _this.origSprite = sprite;
            _this.flashingSprite = document.createElement("canvas");
            _this.flashingSprite.width = sprite.width;
            _this.flashingSprite.height = sprite.height;
            var ctx = _this.flashingSprite.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, _this.flashingSprite.width, _this.flashingSprite.height);
            ctx.globalCompositeOperation = "destination-in";
            ctx.drawImage(sprite, 0, 0);
            return _this;
        }
        EnemyFlight.prototype.startFlyOff = function (cooperator, regroupPos) {
            if (!this.flyOff) {
                this.flyOff = new zlsSpaceInvader.EnemyFlyOff(this, regroupPos);
            }
        };
        Object.defineProperty(EnemyFlight.prototype, "isFlyingOff", {
            get: function () {
                return this.flyOff !== undefined;
            },
            enumerable: true,
            configurable: true
        });
        EnemyFlight.prototype.endFlyOff = function () {
            this.flyOff = undefined;
            this.vel.set(0, 0);
        };
        EnemyFlight.prototype.wrapAround = function () {
            var padding = 9;
            var w = this.scorer.stage.right - this.scorer.stage.left + padding * 2;
            var h = this.scorer.stage.bottom - this.scorer.stage.top + padding * 2;
            while (this.pos.x < this.scorer.stage.left - padding) {
                this.pos.x += w;
            }
            while (this.pos.x > this.scorer.stage.right + padding) {
                this.pos.x -= w;
            }
            while (this.pos.y < this.scorer.stage.top - padding) {
                this.pos.y += h;
                this.flyOff && this.flyOff.onWrapY();
            }
            while (this.pos.y > this.scorer.stage.bottom + padding) {
                this.pos.y -= h;
                this.flyOff && this.flyOff.onWrapY();
            }
        };
        EnemyFlight.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            this.pos.addScaled(this.vel, deltaTime);
            this.wrapAround();
            this.flashTime -= deltaTime;
            if (this.flashTime <= 0) {
                this.sprite = this.origSprite;
            }
            else {
                if (Math.floor(this.flashTime / 0.03) % 2 == 0) {
                    this.sprite = this.origSprite;
                }
                else {
                    this.sprite = this.flashingSprite;
                }
            }
            if (this.manager) {
                if (!this.invincible) {
                    var bs = this.manager.gameObjects.filter(function (b) { return b.isBullet; });
                    for (var _i = 0, bs_1 = bs; _i < bs_1.length; _i++) {
                        var b = bs_1[_i];
                        v.sub(this.pos, b.pos).abs();
                        if (v.x < 5 &&
                            v.y < 5.5) {
                            this.flashTime = 0.1;
                            b.removeFromManager();
                            this.hp -= 1;
                            if (this.hp <= 0) {
                                this.onDie();
                            }
                        }
                    }
                }
                var playerFlight = this.manager && this.manager.gameObjects.filter(function (o) { return o.isPlayerFlight; })[0];
                if (playerFlight) {
                    if (this.flyOff) {
                        this.flyOff.update(deltaTime, playerFlight);
                    }
                    else {
                        this.rotate -= Math.sign(this.rotate) * Math.min(Math.abs(this.rotate), deltaTime * Math.PI * 2);
                    }
                    if (playerFlight.invincibleTime <= 0) {
                        for (var i = 0; i < playerFlight.flightUnits.length; i++) {
                            var u = playerFlight.flightUnits[i];
                            v.sub(this.pos, playerFlight.pos)
                                .sub(u.pos)
                                .abs();
                            if (v.x < 9 &&
                                v.y < 9) {
                                this.onHitPlayer(this, playerFlight, i);
                                break;
                            }
                        }
                    }
                }
            }
        };
        EnemyFlight.prototype.onDie = function () {
            if (this.manager) {
                var ex = new zlsSpaceInvader.Explosion;
                ex.pos.copy(this.pos);
                this.manager.add(ex);
                this.removeFromManager();
                this.flyOff && this.flyOff.onDie();
                this.scorer.score += this.score;
            }
        };
        EnemyFlight.prototype.render = function (deltaTime, ctx) {
            ctx.save();
            var x = Math.floor(this.pos.x);
            var y = Math.floor(this.pos.y);
            ctx.translate(x, y);
            var rotateStep = Math.PI / 8;
            ctx.rotate(Math.round(this.rotate / rotateStep) * rotateStep);
            ctx.translate(-x, -y);
            _super.prototype.render.call(this, deltaTime, ctx);
            ctx.restore();
        };
        return EnemyFlight;
    }(zlsSpaceInvader.SpriteObject));
    zlsSpaceInvader.EnemyFlight = EnemyFlight;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var v = new zlsSpaceInvader.Vector2;
    var turningSpeed = Math.PI;
    var moveSpeed = 36;
    var padding = 4.5;
    var EnemyFlyOff = /** @class */ (function () {
        function EnemyFlyOff(enemy, regroupPos) {
            this.enemy = enemy;
            this.regroupPos = regroupPos;
            this.direction = new zlsSpaceInvader.Vector2(0, -1);
            this.state = "homing";
            this.time = 0;
            zlsSpaceInvader.Audio.play(zlsSpaceInvader.Audio.sounds.shipFly, 1);
        }
        EnemyFlyOff.prototype.update = function (deltaTime, playerFlight) {
            this.time += deltaTime;
            var targetPos;
            switch (this.state) {
                case "homing":
                    targetPos = playerFlight.pos;
                    break;
                case "regroup":
                    targetPos = this.regroupPos;
                    break;
                case "stop":
                    targetPos = v.set(this.enemy.pos.x, this.enemy.pos.y + 100);
                    break;
            }
            if (targetPos) {
                v.sub(targetPos, this.enemy.pos);
                if (this.time < 2.5 ||
                    this.state === "regroup" ||
                    this.state === "stop") {
                    var angle = v.angle(this.direction);
                    if (angle < -Math.PI) {
                        angle += Math.PI * 2;
                    }
                    var turningAngle = Math.min(Math.abs(angle), turningSpeed * deltaTime);
                    this.direction.rotateAround(Math.sign(angle) * turningAngle);
                    this.enemy.rotate = this.direction.angle() - Math.PI / 2;
                }
                else {
                    switch (this.state) {
                        case "homing":
                            this.state = "goStraight";
                            break;
                    }
                }
                switch (this.state) {
                    case "regroup":
                        v.sub(this.regroupPos, this.enemy.pos);
                        if (v.length() < padding) {
                            this.enemy.endFlyOff();
                        }
                }
            }
            switch (this.state) {
                case "stop":
                    this.enemy.vel.set(0, 0);
                    break;
                default:
                    this.enemy.vel.copy(this.direction).multiply(moveSpeed);
                    break;
            }
        };
        EnemyFlyOff.prototype.onWrapY = function () {
            this.state = "regroup";
        };
        EnemyFlyOff.prototype.onDie = function () { };
        return EnemyFlyOff;
    }());
    zlsSpaceInvader.EnemyFlyOff = EnemyFlyOff;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var Constant = /** @class */ (function () {
        function Constant() {
        }
        Constant.maxTimeStep = 1 / 15;
        Constant.playerMoveSpeed = 120;
        Constant.playerFireInterval = 0.16;
        Constant.bulletSpeed = 120;
        Constant.volume = 0.02;
        return Constant;
    }());
    zlsSpaceInvader.Constant = Constant;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var v1 = new zlsSpaceInvader.Vector2;
    var KidnapperFlyOff = /** @class */ (function (_super) {
        __extends(KidnapperFlyOff, _super);
        function KidnapperFlyOff(cooperator, enemy, regroupPos) {
            var _this = _super.call(this, enemy, regroupPos) || this;
            _this.cooperator = cooperator;
            _this.kidnapBeamState = "canShot";
            _this.beamTime = 0;
            return _this;
        }
        KidnapperFlyOff.prototype.update = function (deltaTime, playerFlight) {
            _super.prototype.update.call(this, deltaTime, playerFlight);
            this.beamTime += deltaTime;
            switch (this.state) {
                case "goStraight":
                case "homing":
                    switch (this.kidnapBeamState) {
                        case "canShot":
                            if (this.enemy.pos.y > playerFlight.pos.y - 40)
                                this.shotBeam(playerFlight);
                            break;
                    }
                    break;
            }
        };
        KidnapperFlyOff.prototype.shotBeam = function (playerFlight) {
            return __awaiter(this, void 0, void 0, function () {
                var wave, time, captured, _a, padding, e_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.enemy.manager) return [3 /*break*/, 12];
                            this.state = "stop";
                            this.kidnapBeamState = "shootingBeam";
                            this.beamTime = 0;
                            wave = new CaptureWave();
                            wave.pos.copy(this.enemy.pos);
                            wave.pos.y += 4.5;
                            this.enemy.manager.add(wave);
                            zlsSpaceInvader.Audio.play(zlsSpaceInvader.Audio.sounds.captureBeam, 1);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 10, 11, 12]);
                            return [4 /*yield*/, this.enemy.wait(1)];
                        case 2:
                            _b.sent();
                            time = 0;
                            captured = false;
                            _b.label = 3;
                        case 3:
                            if (!(time < 2 && !captured)) return [3 /*break*/, 5];
                            _a = time;
                            return [4 /*yield*/, this.enemy.wait(0)];
                        case 4:
                            time = _a + _b.sent();
                            padding = 4.5 + playerFlight.flightUnits.length * 9 / 2;
                            if (Math.abs(playerFlight.pos.x - this.enemy.pos.x) < padding &&
                                playerFlight.invincibleTime <= 0) {
                                captured = true;
                            }
                            return [3 /*break*/, 3];
                        case 5:
                            if (!captured) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.capture(playerFlight, wave)];
                        case 6:
                            _b.sent();
                            return [3 /*break*/, 9];
                        case 7:
                            wave.state = "shorten";
                            return [4 /*yield*/, this.enemy.wait(1.5)];
                        case 8:
                            _b.sent();
                            this.kidnapBeamState = "beamEnd";
                            this.state = "goStraight";
                            this.beamTime = 0;
                            _b.label = 9;
                        case 9: return [3 /*break*/, 12];
                        case 10:
                            e_1 = _b.sent();
                            return [3 /*break*/, 12];
                        case 11:
                            wave.removeFromManager();
                            return [7 /*endfinally*/];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        KidnapperFlyOff.prototype.capture = function (player, wave) {
            return __awaiter(this, void 0, void 0, function () {
                var rotFlight, txt, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enemy.manager) return [3 /*break*/, 8];
                            this.cooperator.allowFlyOff = false;
                            this.state = "stop";
                            this.beamTime = 0;
                            this.enemy.invincible = true;
                            rotFlight = new RotatingPlayerFlight(player, player.flightUnits, this.enemy, this.cooperator);
                            this.enemy.manager.add(rotFlight);
                            this.enemy.kidnapped = rotFlight;
                            zlsSpaceInvader.Audio.stop(1);
                            zlsSpaceInvader.Audio.play(zlsSpaceInvader.Audio.sounds.captureBeam2, 2);
                            player.invincibleTime = 9000; // large enough interval
                            player.visible = false;
                            player.paused = true;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, 7, 8]);
                            return [4 /*yield*/, this.enemy.wait(1)];
                        case 2:
                            _a.sent();
                            wave.state = "shorten";
                            return [4 /*yield*/, this.enemy.wait(0.5)];
                        case 3:
                            _a.sent();
                            this.enemy.kidnapped.state = "stop";
                            return [4 /*yield*/, this.enemy.wait(3)];
                        case 4:
                            _a.sent();
                            this.kidnapBeamState = "beamEnd";
                            this.state = "regroup";
                            zlsSpaceInvader.Audio.play(zlsSpaceInvader.Audio.sounds.capturedSuccess, 2);
                            txt = new zlsSpaceInvader.FloatingText("MEMBER CAPTURED");
                            this.enemy.manager.add(txt);
                            return [4 /*yield*/, this.enemy.wait(5)];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 8];
                        case 6:
                            e_2 = _a.sent();
                            throw e_2;
                        case 7:
                            this.cooperator.allowFlyOff = true;
                            player.invincibleTime = 0;
                            // player.visible = true
                            player.paused = false;
                            player.flightUnits.length = 0;
                            player.next = true;
                            this.enemy.invincible = false;
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        return KidnapperFlyOff;
    }(zlsSpaceInvader.EnemyFlyOff));
    var RotatingPlayerFlight = /** @class */ (function (_super) {
        __extends(RotatingPlayerFlight, _super);
        function RotatingPlayerFlight(player, units, enemy, cooperator) {
            var _this = _super.call(this) || this;
            _this.player = player;
            _this.enemy = enemy;
            _this.cooperator = cooperator;
            _this.rotate = 0;
            _this.state = "rotating";
            _this.spacing = 9;
            _this.units = Array.from(units);
            _this.pos.copy(player.pos);
            return _this;
        }
        RotatingPlayerFlight.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            switch (this.state) {
                case "stop":
                case "followBack":
                case "stickBack":
                    this.spacing = Math.max(0, this.spacing - deltaTime * 50);
                    break;
                case "free":
                case "combine":
                    this.spacing = Math.min(9, this.spacing + deltaTime * 50);
                    break;
            }
            switch (this.state) {
                case "rotating":
                case "free":
                    this.rotate += deltaTime * Math.PI * 8;
                    break;
                case "stop":
                case "followBack":
                case "combine":
                    this.rotate = 0;
                    break;
                case "stickBack":
                    this.rotate = this.enemy.rotate;
                    break;
            }
            switch (this.state) {
                case "stickBack":
                    this.pos.copy(this.enemy.pos);
                    this.pos.y -= 14;
                    break;
                case "free":
                case "combine":
                    break;
                default:
                    v1.copy(this.enemy.pos);
                    switch (this.state) {
                        case "followBack":
                            v1.y -= 14;
                            break;
                        default:
                            v1.y += 10;
                            break;
                    }
                    v1.sub(this.pos);
                    var l = v1.length();
                    if (l < 1 && this.state == "followBack") {
                        this.state = "stickBack";
                    }
                    v1.normalize();
                    v1.multiply(Math.min(l, 50 * deltaTime));
                    this.pos.add(v1);
                    break;
            }
        };
        RotatingPlayerFlight.prototype.followBack = function () {
            this.state = "followBack";
        };
        RotatingPlayerFlight.prototype.render = function (deltaTime, ctx) {
            _super.prototype.render.call(this, deltaTime, ctx);
            for (var i = this.spacing > 0 ? 0 : this.units.length - 1; i < this.units.length; i++) {
                var u = this.units[i];
                ctx.save();
                ctx.translate(Math.floor((-(this.units.length - 1) / 2 + i) * this.spacing + this.pos.x), Math.floor(this.pos.y));
                ctx.rotate(this.rotate);
                ctx.drawImage(u.sprite, Math.floor(-u.sprite.width / 2), Math.floor(-u.sprite.height / 2));
                ctx.restore();
            }
        };
        RotatingPlayerFlight.prototype.setFree = function () {
            return __awaiter(this, void 0, void 0, function () {
                var posXSet, dt, numFlight, leftMost, targetX, dx, targetX2, dx2, posYSet, dt, dy, e_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.state = "free";
                            this.player.invincibleTime = 9000; // large enough number
                            this.player.canShoot = false;
                            this.cooperator.allowFlyOff = false;
                            this.cooperator.invincible = true;
                            this.cooperator.allowEnd = false;
                            zlsSpaceInvader.Audio.play(zlsSpaceInvader.Audio.sounds.capturedSuccess, 2);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 10, 11, 12]);
                            return [4 /*yield*/, this.wait(3)];
                        case 2:
                            _a.sent();
                            this.state = "combine";
                            this.player.paused = true;
                            posXSet = false;
                            _a.label = 3;
                        case 3:
                            if (!!posXSet) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.wait(0)];
                        case 4:
                            dt = _a.sent();
                            numFlight = this.player.flightUnits.length + this.units.length;
                            leftMost = -9 * (numFlight - 1) / 2;
                            targetX = leftMost - this.player.flightUnits[0].pos.x;
                            dx = targetX - this.player.pos.x;
                            this.player.pos.x += Math.sign(dx) * Math.min(100 * dt, Math.abs(dx));
                            targetX2 = targetX + (this.player.flightUnits.length + this.units.length) * 9 / 2;
                            dx2 = targetX2 - this.pos.x;
                            this.pos.x += Math.sign(dx2) * Math.min(100 * dt, Math.abs(dx2));
                            posXSet = dx == 0 && dx2 == 0;
                            return [3 /*break*/, 3];
                        case 5:
                            posYSet = false;
                            _a.label = 6;
                        case 6:
                            if (!!posYSet) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.wait(0)];
                        case 7:
                            dt = _a.sent();
                            dy = this.player.pos.y - this.pos.y;
                            this.pos.y += Math.sign(dy) * Math.min(100 * dt, Math.abs(dy));
                            posYSet = dy == 0;
                            return [3 /*break*/, 6];
                        case 8:
                            this.visible = false;
                            this.player.add(this.units);
                            return [4 /*yield*/, this.wait(2)];
                        case 9:
                            _a.sent();
                            return [3 /*break*/, 12];
                        case 10:
                            e_3 = _a.sent();
                            return [3 /*break*/, 12];
                        case 11:
                            this.player.invincibleTime = 0;
                            this.player.paused = false;
                            this.player.canShoot = true;
                            this.cooperator.allowFlyOff = true;
                            this.cooperator.invincible = false;
                            this.cooperator.allowEnd = true;
                            this.removeFromManager();
                            return [7 /*endfinally*/];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        return RotatingPlayerFlight;
    }(zlsSpaceInvader.GameObject));
    var Kidnapper = /** @class */ (function (_super) {
        __extends(Kidnapper, _super);
        function Kidnapper() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Kidnapper.prototype.startFlyOff = function (cooperator, regroupPos) {
            if (!this.flyOff) {
                if (!this.kidnapped)
                    this.flyOff = new KidnapperFlyOff(cooperator, this, regroupPos);
                else
                    _super.prototype.startFlyOff.call(this, cooperator, regroupPos);
            }
        };
        Kidnapper.prototype.endFlyOff = function () {
            _super.prototype.endFlyOff.call(this);
            if (this.kidnapped &&
                this.kidnapped.state == "stop") {
                this.kidnapped.followBack();
            }
        };
        Kidnapper.prototype.onDie = function () {
            if (this.kidnapped) {
                this.kidnapped.setFree();
            }
            _super.prototype.onDie.call(this);
        };
        Kidnapper.prototype.setCapture = function (player, flightUnit, cooperator) {
            if (this.manager) {
                var rotFlight = new RotatingPlayerFlight(player, [flightUnit], // FIXME: bullet color
                this, cooperator);
                rotFlight.state = "stickBack";
                this.manager.add(rotFlight);
                this.kidnapped = rotFlight;
            }
        };
        return Kidnapper;
    }(zlsSpaceInvader.EnemyFlight));
    zlsSpaceInvader.Kidnapper = Kidnapper;
    var CaptureWave = /** @class */ (function (_super) {
        __extends(CaptureWave, _super);
        function CaptureWave() {
            var _this = _super.call(this) || this;
            _this.frames = [
                zlsSpaceInvader.Sprites.shared.images.captureWave0,
                zlsSpaceInvader.Sprites.shared.images.captureWave1,
                zlsSpaceInvader.Sprites.shared.images.captureWave2,
            ];
            _this.time = 0;
            _this.height = 0;
            _this.state = "elongate";
            _this.renderOrder = 1;
            return _this;
        }
        CaptureWave.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            this.time += deltaTime;
            switch (this.state) {
                case "elongate":
                    this.height = Math.min(1, this.height + deltaTime);
                    break;
                case "shorten":
                    this.height = Math.max(0, this.height - deltaTime);
                    break;
            }
        };
        CaptureWave.prototype.render = function (deltaTime, ctx) {
            _super.prototype.render.call(this, deltaTime, ctx);
            var frame = this.frames[Math.floor(this.time / 0.1) % this.frames.length];
            var h = Math.floor(this.height / 0.2) * 0.2;
            h = Math.floor(frame.height * h);
            ctx.drawImage(frame, 0, 0, frame.width, h, Math.floor(this.pos.x - frame.width / 2), this.pos.y, frame.width, h);
        };
        return CaptureWave;
    }(zlsSpaceInvader.GameObject));
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var Palette = /** @class */ (function () {
        function Palette() {
        }
        Palette.bgColor = "#2C1F22";
        Palette.font = "7px Trebuchet MS";
        Palette.BulletColor0 = "#E545FF";
        Palette.BulletColor1 = "#C62D3E";
        Palette.BulletColor2 = "#FFB950";
        Palette.BulletColor3 = "#3851FF";
        Palette.BulletColor4 = "#D1E0E3";
        Palette.BulletColor5 = "#FF2C61";
        Palette.BulletColor6 = "#FFEB48";
        Palette.BulletColor7 = "#3FEE3B";
        return Palette;
    }());
    zlsSpaceInvader.Palette = Palette;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var paths = {
        0: "./images/0.png",
        1: "./images/1.png",
        2: "./images/2.png",
        3: "./images/3.png",
        4: "./images/4.png",
        5: "./images/5.png",
        6: "./images/6.png",
        7: "./images/7.png",
        dog: "./images/dog.png",
        explod: "./images/explod.png",
        hand: "./images/hand.png",
        p: "./images/p.png",
        zombie1: "./images/zombie1.png",
        zombie2: "./images/zombie2.png",
        bullet: "./images/bullet.png",
        star: "./images/star.png",
        font: "./images/font.png",
        captureWave0: "./images/capture_wave0.png",
        captureWave1: "./images/capture_wave1.png",
        captureWave2: "./images/capture_wave2.png"
    };
    function loadImage(img, url) {
        return new Promise(function (resolve, reject) {
            img.src = url;
            img.onload = function () { return resolve(); };
            img.onerror = function (e) { return reject(e); };
        });
    }
    var Sprites = /** @class */ (function () {
        function Sprites() {
            this.images = {
                0: new Image,
                1: new Image,
                2: new Image,
                3: new Image,
                4: new Image,
                5: new Image,
                6: new Image,
                7: new Image,
                dog: new Image,
                explod: new Image,
                hand: new Image,
                p: new Image,
                zombie1: new Image,
                zombie2: new Image,
                bullet: new Image,
                star: new Image,
                font: new Image,
                captureWave0: new Image,
                captureWave1: new Image,
                captureWave2: new Image,
            };
        }
        Sprites.prototype.load = function () {
            var tasks = [];
            for (var n in paths) {
                tasks.push(loadImage(this.images[n], paths[n]));
            }
            return Promise.all(tasks);
        };
        Sprites.shared = new Sprites;
        return Sprites;
    }());
    zlsSpaceInvader.Sprites = Sprites;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    function loadAudio(url) {
        return new Promise(function (resolve, reject) {
            var dom = document.createElement("audio");
            dom.src = url;
            dom.autoplay = false;
            dom.oncanplay = function () { return resolve(); };
            dom.onerror = function (e) { return reject(e); };
        });
    }
    var channels = new Array(3);
    for (var i = 0; i < channels.length; i++) {
        var dom = document.createElement("audio");
        dom.volume = zlsSpaceInvader.Constant.volume;
        dom.autoplay = true;
        channels[i] = dom;
    }
    var Audio = /** @class */ (function () {
        function Audio() {
        }
        Audio.preload = function () {
            var urls = [];
            for (var n in Audio.sounds) {
                urls.push(Audio.sounds[n]);
            }
            return Promise.all(urls.map(function (url) { return loadAudio(url); }));
        };
        Audio.play = function (sound, channel) {
            if (channel === void 0) { channel = 0; }
            channels[channel].src = sound;
        };
        Audio.stop = function (channel) {
            channels[channel].pause();
        };
        Object.defineProperty(Audio, "volume", {
            get: function () {
                return channels[0].volume;
            },
            set: function (n) {
                for (var _i = 0, channels_1 = channels; _i < channels_1.length; _i++) {
                    var a = channels_1[_i];
                    a.volume = n;
                }
            },
            enumerable: true,
            configurable: true
        });
        Audio.sounds = {
            explosion: "./sound/explosion.wav",
            invaderkilled: "./sound/invaderkilled.wav",
            shoot: "./sound/shoot.wav",
            shipFly: "./sound/Galaxian Sound.mp3",
            bonus: "./sound/Galaxian.mp3",
            captureBeam: "./sound/capture_beam.mp3",
            captureBeam2: "./sound/capture_beam2.mp3",
            captured: "./sound/captured.mp3",
            capturedSuccess: "./sound/captured_success.mp3",
        };
        return Audio;
    }());
    zlsSpaceInvader.Audio = Audio;
    var _sort = new zlsSpaceInvader.Constant;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var Bullet = /** @class */ (function (_super) {
        __extends(Bullet, _super);
        function Bullet(stage, color) {
            var _this = _super.call(this) || this;
            _this.stage = stage;
            _this.color = color;
            _this.isBullet = true;
            return _this;
        }
        Bullet.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            this.pos.y -= zlsSpaceInvader.Constant.bulletSpeed * deltaTime;
            if (this.pos.y <= this.stage.top) {
                this.removeFromManager();
            }
        };
        Bullet.prototype.render = function (deltaTime, ctx) {
            _super.prototype.render.call(this, deltaTime, ctx);
            ctx.fillStyle = this.color;
            ctx.fillRect(Math.floor(this.pos.x - 0.5), Math.floor(this.pos.y - 1.5), 1, 3);
        };
        return Bullet;
    }(zlsSpaceInvader.GameObject));
    zlsSpaceInvader.Bullet = Bullet;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var ContinueScreen = /** @class */ (function (_super) {
        __extends(ContinueScreen, _super);
        function ContinueScreen(continueFunc) {
            var _this = _super.call(this) || this;
            _this.continueFunc = continueFunc;
            _this.countDown = 9;
            _this.countCoolDown = 1;
            _this.renderOrder = 1;
            _this.renderHalf = false;
            return _this;
        }
        ContinueScreen.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            if (zlsSpaceInvader.Input.shared.pressAnyKey && this.countDown < 9) {
                this.continueFunc(true);
                this.removeFromManager();
            }
            else {
                this.countCoolDown -= deltaTime;
                if (this.countCoolDown <= 0) {
                    if (this.countDown <= 0) {
                        this.continueFunc(false);
                        this.removeFromManager();
                    }
                    else {
                        this.countDown -= 1;
                        this.countCoolDown += 1;
                    }
                }
            }
        };
        ContinueScreen.prototype.render = function (deltaTime, ctx) {
            _super.prototype.render.call(this, deltaTime, ctx);
            var txt = "CONTINUE? " + this.countDown;
            zlsSpaceInvader.TextDrawer.shared.drawText(txt, Math.floor(-zlsSpaceInvader.TextDrawer.shared.measure(txt) / 2), -2, ctx);
        };
        return ContinueScreen;
    }(zlsSpaceInvader.GameObject));
    zlsSpaceInvader.ContinueScreen = ContinueScreen;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var Zombie1 = /** @class */ (function (_super) {
        __extends(Zombie1, _super);
        function Zombie1(scorer, onHitPlayer) {
            return _super.call(this, zlsSpaceInvader.Sprites.shared.images["zombie1"], scorer, 100, onHitPlayer) || this;
        }
        return Zombie1;
    }(zlsSpaceInvader.Kidnapper));
    zlsSpaceInvader.Zombie1 = Zombie1;
    var Zombie2 = /** @class */ (function (_super) {
        __extends(Zombie2, _super);
        function Zombie2(scorer, onHitPlayer) {
            return _super.call(this, zlsSpaceInvader.Sprites.shared.images["zombie2"], scorer, 100, onHitPlayer) || this;
        }
        return Zombie2;
    }(zlsSpaceInvader.EnemyFlight));
    zlsSpaceInvader.Zombie2 = Zombie2;
    var Hand = /** @class */ (function (_super) {
        __extends(Hand, _super);
        function Hand(scorer, onHitPlayer) {
            return _super.call(this, zlsSpaceInvader.Sprites.shared.images["hand"], scorer, 100, onHitPlayer) || this;
        }
        return Hand;
    }(zlsSpaceInvader.EnemyFlight));
    zlsSpaceInvader.Hand = Hand;
    var Dog = /** @class */ (function (_super) {
        __extends(Dog, _super);
        function Dog(scorer, onHitPlayer) {
            return _super.call(this, zlsSpaceInvader.Sprites.shared.images["dog"], scorer, 100, onHitPlayer) || this;
        }
        return Dog;
    }(zlsSpaceInvader.EnemyFlight));
    zlsSpaceInvader.Dog = Dog;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var enemyEdgePadding = 9;
    var EnemyCooperator = /** @class */ (function (_super) {
        __extends(EnemyCooperator, _super);
        function EnemyCooperator(stage, enemies, waveEnd) {
            var _this = _super.call(this) || this;
            _this.stage = stage;
            _this.waveEnd = waveEnd;
            _this.cooldown = 0;
            _this.moveDir = "left";
            _this.allowFlyOff = true;
            _this.allowEnd = true;
            _this.enemies = enemies.map(function (e) {
                return {
                    enemy: e,
                    initPos: e.pos.clone(),
                    targetPos: e.pos.clone()
                };
            });
            return _this;
        }
        Object.defineProperty(EnemyCooperator.prototype, "invincible", {
            set: function (b) {
                for (var _i = 0, _a = this.enemies; _i < _a.length; _i++) {
                    var e = _a[_i];
                    e.enemy.invincible = b;
                }
            },
            enumerable: true,
            configurable: true
        });
        EnemyCooperator.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            this.cooldown -= deltaTime;
            if (this.cooldown <= 0) {
                var lifeEnemyRatio = this.enemies.reduce(function (a, b) { return a + (b.enemy.manager ? 1 : 0); }, 0) / (this.enemies.length - 1);
                var interval = (0.01 + 0.49 * lifeEnemyRatio) / 0.6;
                var enemyMoveSpeed = (3 + (1 - lifeEnemyRatio) * 6) * 0.6;
                var flyOffRate = 0.005 + (1 - lifeEnemyRatio) * 0.1;
                var deltaX = 0;
                switch (this.moveDir) {
                    case "left":
                        var minX = Number.MAX_VALUE;
                        for (var _i = 0, _a = this.enemies; _i < _a.length; _i++) {
                            var e = _a[_i];
                            if (e.enemy.manager)
                                minX = Math.min(e.targetPos.x, minX);
                        }
                        if (minX <= this.stage.left + enemyEdgePadding) {
                            this.moveDir = "right";
                        }
                        break;
                    case "right":
                        var maxX = Number.MIN_VALUE;
                        for (var _b = 0, _c = this.enemies; _b < _c.length; _b++) {
                            var e = _c[_b];
                            if (e.enemy.manager)
                                maxX = Math.max(e.targetPos.x, maxX);
                        }
                        if (maxX >= this.stage.right - enemyEdgePadding) {
                            this.moveDir = "left";
                        }
                        break;
                }
                switch (this.moveDir) {
                    case "left":
                        deltaX = -enemyMoveSpeed;
                        break;
                    case "right":
                        deltaX = enemyMoveSpeed;
                        break;
                }
                if (this.allowFlyOff) {
                    for (var _d = 0, _e = this.enemies; _d < _e.length; _d++) {
                        var e = _e[_d];
                        e.targetPos.x += deltaX;
                        if (!e.enemy.isFlyingOff &&
                            Math.random() < flyOffRate) {
                            e.enemy.startFlyOff(this, e.targetPos);
                        }
                    }
                }
                this.cooldown += interval;
            }
            for (var _f = 0, _g = this.enemies; _f < _g.length; _f++) {
                var e = _g[_f];
                if (!e.enemy.isFlyingOff) {
                    e.enemy.pos.copy(e.targetPos);
                    e.enemy.vel.set(0, 0);
                }
            }
            if (this.allowEnd) {
                var anyAlive = this.enemies.reduce(function (a, b) {
                    return a || b.enemy.manager !== undefined;
                }, false);
                if (!anyAlive) {
                    this.waveEnd();
                }
            }
        };
        return EnemyCooperator;
    }(zlsSpaceInvader.GameObject));
    zlsSpaceInvader.EnemyCooperator = EnemyCooperator;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var Explosion = /** @class */ (function (_super) {
        __extends(Explosion, _super);
        function Explosion() {
            var _this = _super.call(this, zlsSpaceInvader.Sprites.shared.images["explod"]) || this;
            _this.lifeTime = 0;
            zlsSpaceInvader.Audio.play(zlsSpaceInvader.Audio.sounds.invaderkilled, 1);
            return _this;
        }
        Explosion.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            this.lifeTime += deltaTime;
            if (this.lifeTime > 0.1 && this.manager) {
                this.removeFromManager();
            }
        };
        return Explosion;
    }(zlsSpaceInvader.SpriteObject));
    zlsSpaceInvader.Explosion = Explosion;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var FloatingText = /** @class */ (function (_super) {
        __extends(FloatingText, _super);
        function FloatingText(text, onRemove) {
            var _this = _super.call(this) || this;
            _this.text = text;
            _this.onRemove = onRemove;
            _this.time = 0;
            _this.renderHalf = false;
            return _this;
        }
        FloatingText.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            this.time += deltaTime;
            if (this.time > 3) {
                this.onRemove && this.onRemove();
                this.removeFromManager();
            }
        };
        FloatingText.prototype.render = function (deltaTime, ctx) {
            _super.prototype.render.call(this, deltaTime, ctx);
            zlsSpaceInvader.TextDrawer.shared.drawText(this.text, Math.floor(this.pos.x - zlsSpaceInvader.TextDrawer.shared.measure(this.text) / 2), Math.floor(this.pos.y), ctx);
        };
        return FloatingText;
    }(zlsSpaceInvader.GameObject));
    zlsSpaceInvader.FloatingText = FloatingText;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var memberList = [
        {
            no: 5,
            bulletColor: zlsSpaceInvader.Palette.BulletColor5
        },
        {
            no: 6,
            bulletColor: zlsSpaceInvader.Palette.BulletColor6
        },
        {
            no: 4,
            bulletColor: zlsSpaceInvader.Palette.BulletColor4
        },
        {
            no: 2,
            bulletColor: zlsSpaceInvader.Palette.BulletColor2
        },
        {
            no: 3,
            bulletColor: zlsSpaceInvader.Palette.BulletColor3
        },
        {
            no: 0,
            bulletColor: zlsSpaceInvader.Palette.BulletColor0
        },
        {
            no: 7,
            bulletColor: zlsSpaceInvader.Palette.BulletColor7
        }
    ];
    var Franchouchou = /** @class */ (function (_super) {
        __extends(Franchouchou, _super);
        function Franchouchou(stage, manager) {
            var _this = _super.call(this) || this;
            _this.stage = stage;
            _this.manager = manager;
            _this.units = [];
            _this.canCallMaiMai = true;
            _this.renderOrder = 1;
            _this.reset(memberList.slice(0, 6).map(function (m) {
                return new zlsSpaceInvader.FlightUnit(zlsSpaceInvader.Sprites.shared.images["" + m.no], m.bulletColor);
            }));
            return _this;
        }
        Object.defineProperty(Franchouchou.prototype, "remainingMember", {
            get: function () {
                return this.units.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Franchouchou.prototype, "nextMember", {
            get: function () {
                if (this.units.length > 0) {
                    var m = this.units.pop();
                    return m;
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Franchouchou.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            if (zlsSpaceInvader.Input.shared.maimai &&
                this.canCallMaiMai) {
                this.units.push(new zlsSpaceInvader.FlightUnit(zlsSpaceInvader.Sprites.shared.images["" + memberList[6].no], memberList[6].bulletColor));
                this.canCallMaiMai = false;
            }
        };
        Franchouchou.prototype.render = function (deltaTime, ctx) {
            _super.prototype.render.call(this, deltaTime, ctx);
            for (var i = 0; i < this.units.length; i++) {
                var spr = this.units[i].sprite;
                ctx.drawImage(spr, Math.floor(this.stage.left + 15 + i * 11 - spr.width / 2), Math.floor(this.stage.bottom - 9 - spr.height / 2));
            }
        };
        Franchouchou.prototype.reset = function (renewUnits) {
            this.units = Array.from(renewUnits);
        };
        return Franchouchou;
    }(zlsSpaceInvader.GameObject));
    zlsSpaceInvader.Franchouchou = Franchouchou;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var HiScoreScreen = /** @class */ (function (_super) {
        __extends(HiScoreScreen, _super);
        function HiScoreScreen(score) {
            var _this = _super.call(this) || this;
            _this.score = score;
            _this.time = 0;
            _this.renderOrder = 1;
            _this.renderHalf = false;
            return _this;
        }
        HiScoreScreen.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            this.time += deltaTime;
            if (zlsSpaceInvader.Input.shared.pressAnyKey && this.time >= 1) {
                location.reload();
            }
        };
        HiScoreScreen.prototype.render = function (deltaTime, ctx) {
            _super.prototype.render.call(this, deltaTime, ctx);
            var txt = "HI-SCORE " + zlsSpaceInvader.addLeadingZero(this.score, 6);
            zlsSpaceInvader.TextDrawer.shared.drawText(txt, Math.floor(-zlsSpaceInvader.TextDrawer.shared.measure(txt) / 2), -2, ctx);
        };
        return HiScoreScreen;
    }(zlsSpaceInvader.GameObject));
    zlsSpaceInvader.HiScoreScreen = HiScoreScreen;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var maimaiKeySequence = [
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown"
    ];
    var Input = /** @class */ (function () {
        function Input() {
            var _this = this;
            this.left = false;
            this.right = false;
            this.fire = false;
            this.pressAnyKey = false;
            this.maimaiIndex = 0;
            this.maimai = false;
            addEventListener("keydown", function (e) {
                switch (e.code) {
                    case "ArrowLeft":
                    case "KeyA":
                        _this.left = true;
                        _this.pressAnyKey = true;
                        break;
                    case "ArrowRight":
                    case "KeyD":
                        _this.right = true;
                        _this.pressAnyKey = true;
                        break;
                    case "ArrowUp":
                    case "KeyW":
                        _this.fire = true;
                        _this.pressAnyKey = true;
                        break;
                }
                if (e.code == maimaiKeySequence[_this.maimaiIndex]) {
                    _this.maimaiIndex++;
                    if (_this.maimaiIndex == maimaiKeySequence.length) {
                        _this.maimai = true;
                        _this.maimaiIndex = 0;
                    }
                }
                else {
                    _this.maimaiIndex = 0;
                }
            });
            addEventListener("keyup", function (e) {
                switch (e.code) {
                    case "ArrowLeft":
                    case "KeyA":
                        _this.left = false;
                        break;
                    case "ArrowRight":
                    case "KeyD":
                        _this.right = false;
                        break;
                    case "ArrowUp":
                    case "KeyW":
                        _this.fire = false;
                        break;
                }
            });
        }
        Input.prototype.init = function (leftButton, rightButton, fireButton) {
            var _this = this;
            var updateButton = function () {
                _this.left = (leftTouch || leftPointer);
                _this.right = (rightTouch || rightPointer);
                _this.fire = (fireTouch || firePointer);
            };
            var leftTouch = false;
            var leftPointer = false;
            var rightTouch = false;
            var rightPointer = false;
            var fireTouch = false;
            var firePointer = false;
            leftButton.addEventListener("touchstart", function (e) {
                leftTouch = true;
                _this.pressAnyKey = true;
                updateButton();
            });
            leftButton.addEventListener("pointerdown", function (e) {
                leftPointer = true;
                _this.pressAnyKey = true;
                updateButton();
            });
            rightButton.addEventListener("touchstart", function (e) {
                rightTouch = true;
                _this.pressAnyKey = true;
                updateButton();
            });
            rightButton.addEventListener("pointerdown", function (e) {
                rightPointer = true;
                _this.pressAnyKey = true;
                updateButton();
            });
            fireButton.addEventListener("touchstart", function (e) {
                fireTouch = true;
                _this.pressAnyKey = true;
                updateButton();
            });
            fireButton.addEventListener("pointerdown", function (e) {
                firePointer = true;
                _this.pressAnyKey = true;
                updateButton();
            });
            leftButton.addEventListener("touchend", function (e) {
                leftTouch = false;
                updateButton();
            });
            leftButton.addEventListener("touchcancel", function (e) {
                leftTouch = false;
                updateButton();
            });
            leftButton.addEventListener("pointerup", function (e) {
                leftPointer = false;
                updateButton();
            });
            leftButton.addEventListener("pointerout", function (e) {
                leftPointer = false;
                updateButton();
            });
            rightButton.addEventListener("touchend", function (e) {
                rightTouch = false;
                updateButton();
            });
            rightButton.addEventListener("touchcancel", function (e) {
                rightTouch = false;
                updateButton();
            });
            rightButton.addEventListener("pointerup", function (e) {
                rightPointer = false;
                updateButton();
            });
            rightButton.addEventListener("pointerout", function (e) {
                rightPointer = false;
                updateButton();
            });
            fireButton.addEventListener("touchend", function (e) {
                fireTouch = false;
                updateButton();
            });
            fireButton.addEventListener("touchcancel", function (e) {
                fireTouch = false;
                updateButton();
            });
            fireButton.addEventListener("pointerup", function (e) {
                firePointer = false;
                updateButton();
            });
            fireButton.addEventListener("pointerout", function (e) {
                firePointer = false;
                updateButton();
            });
        };
        Input.prototype.update = function () {
            this.pressAnyKey = false;
            this.maimai = false;
        };
        Input.shared = new Input();
        return Input;
    }());
    zlsSpaceInvader.Input = Input;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var Main = /** @class */ (function () {
        function Main() {
            this.allowUpdate = true;
            this.gameObjectManager = new zlsSpaceInvader.GameObjectManager;
            this.ctx = null;
            this.halfRenderContext = null;
            this.stage = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };
            this.enemies = [];
            this.enemyCooperator = new zlsSpaceInvader.EnemyCooperator(this.stage, [], function () { });
            this.wave = 1;
        }
        Main.prototype.init = function (canvas) {
            return __awaiter(this, void 0, void 0, function () {
                var lowresCanvas;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.ctx = canvas.getContext("2d");
                            if (this.ctx) {
                                this.ctx.imageSmoothingEnabled = false;
                            }
                            lowresCanvas = document.createElement("canvas");
                            lowresCanvas.width = canvas.width / 2;
                            lowresCanvas.height = canvas.height / 2;
                            this.halfRenderContext = lowresCanvas.getContext("2d");
                            if (this.halfRenderContext) {
                                this.halfRenderContext.imageSmoothingEnabled = false;
                            }
                            return [4 /*yield*/, Promise.all([
                                    zlsSpaceInvader.Sprites.shared.load(),
                                    zlsSpaceInvader.Audio.preload()
                                ])];
                        case 1:
                            _a.sent();
                            this.initGame();
                            return [2 /*return*/, this];
                    }
                });
            });
        };
        Main.prototype.initGame = function () {
            var _this = this;
            var scoreAndCredit = new zlsSpaceInvader.ScoreAndCredit(this.stage, {
                get remainingMember() {
                    return franchouchou.remainingMember + playerFlight.flightUnits.length;
                }
            });
            if (this.ctx) {
                this.stage.left = -this.ctx.canvas.width / 4;
                this.stage.right = this.ctx.canvas.width / 4;
                this.stage.top = -this.ctx.canvas.height / 4;
                this.stage.bottom = this.ctx.canvas.height / 4;
            }
            this.gameObjectManager.add(new zlsSpaceInvader.StarNight(this.stage));
            var runOutOfMember = function () {
                _this.showContinue(scoreAndCredit, playerFlight, franchouchou);
            };
            var playerFlight = new zlsSpaceInvader.PlayerFlight(this.stage, function () {
                return franchouchou.nextMember;
            }, runOutOfMember);
            playerFlight.pos.y = this.stage.bottom - 35;
            this.gameObjectManager.add(playerFlight);
            this.resetEnemies(playerFlight, scoreAndCredit);
            var franchouchou = new zlsSpaceInvader.Franchouchou(this.stage, this.gameObjectManager);
            this.gameObjectManager.add(franchouchou);
            this.gameObjectManager.add(scoreAndCredit);
            playerFlight.paused = true;
            for (var _i = 0, _a = this.enemies; _i < _a.length; _i++) {
                var e = _a[_i];
                e.paused = true;
            }
            this.enemyCooperator.paused = true;
            var startScreen = new zlsSpaceInvader.StartScreen(function () {
                playerFlight.paused = false;
                for (var _i = 0, _a = _this.enemies; _i < _a.length; _i++) {
                    var e = _a[_i];
                    e.paused = false;
                }
                _this.enemyCooperator.paused = false;
            });
            this.gameObjectManager.add(startScreen);
        };
        Main.prototype.resetEnemies = function (playerFlight, scoreAndCredit) {
            var _this = this;
            //clear old enemies
            for (var _i = 0, _a = this.enemies; _i < _a.length; _i++) {
                var e = _a[_i];
                e.removeFromManager();
            }
            this.enemies.length = 0;
            this.enemyCooperator.removeFromManager();
            var enemyColumn = 9;
            var enemySpacing = 14;
            var enemyRows = [
                zlsSpaceInvader.Zombie1,
                zlsSpaceInvader.Zombie2,
                zlsSpaceInvader.Hand,
                zlsSpaceInvader.Dog
            ];
            var enemyYOffset = -46;
            for (var i = 0; i < enemyColumn; i++) {
                for (var j = 0; j < enemyRows.length; j++) {
                    var e = new enemyRows[j](scoreAndCredit, function (e, p, i) {
                        p.remove(i);
                        zlsSpaceInvader.Audio.play(zlsSpaceInvader.Audio.sounds.explosion);
                    });
                    e.pos.x = (-enemyColumn / 2 + i + 0.5) * enemySpacing;
                    e.pos.y = j * enemySpacing + enemyYOffset;
                    this.gameObjectManager.add(e);
                    this.enemies.push(e);
                }
            }
            var waveEnd = function () {
                _this.resetEnemies(playerFlight, scoreAndCredit);
                playerFlight.paused = true;
                for (var _i = 0, _a = _this.enemies; _i < _a.length; _i++) {
                    var e = _a[_i];
                    e.paused = true;
                }
                _this.enemyCooperator.paused = true;
                var waveScreen = new zlsSpaceInvader.WaveScreen(++_this.wave, function () {
                    playerFlight.paused = false;
                    for (var _i = 0, _a = _this.enemies; _i < _a.length; _i++) {
                        var e = _a[_i];
                        e.paused = false;
                    }
                    _this.enemyCooperator.paused = false;
                });
                _this.gameObjectManager.add(waveScreen);
            };
            this.enemyCooperator = new zlsSpaceInvader.EnemyCooperator(this.stage, this.enemies, waveEnd);
            this.gameObjectManager.add(this.enemyCooperator);
            var pInPlayer = playerFlight.flightUnits.reduce(function (a, b) {
                return a || b.sprite === zlsSpaceInvader.Sprites.shared.images["p"];
            }, false);
            if (!pInPlayer)
                this.enemies[enemyRows.length * 4].setCapture(playerFlight, new zlsSpaceInvader.FlightUnit(zlsSpaceInvader.Sprites.shared.images["p"], zlsSpaceInvader.Palette.BulletColor1), this.enemyCooperator);
        };
        Main.prototype.showContinue = function (scoreAndCredit, playerFlight, franchouchou) {
            var _this = this;
            var renewFlights = Array.from(playerFlight.flightUnits);
            for (var _i = 0, _a = playerFlight.removedUnits; _i < _a.length; _i++) {
                var u = _a[_i];
                if (u.sprite !== zlsSpaceInvader.Sprites.shared.images["p"])
                    renewFlights.push(u);
            }
            if (renewFlights.length > 0) {
                if (scoreAndCredit.credit > 0 && renewFlights.length > 0) {
                    playerFlight.paused = true;
                    for (var _b = 0, _c = this.enemies; _b < _c.length; _b++) {
                        var e = _c[_b];
                        e.paused = true;
                    }
                    this.enemyCooperator.paused = true;
                    var continueScreen = new zlsSpaceInvader.ContinueScreen(function (b) {
                        if (b) {
                            scoreAndCredit.credit--;
                            playerFlight.paused = false;
                            for (var _i = 0, _a = _this.enemies; _i < _a.length; _i++) {
                                var e = _a[_i];
                                e.paused = false;
                            }
                            _this.enemyCooperator.paused = false;
                            playerFlight.reset(renewFlights[0]);
                            franchouchou.reset(renewFlights.slice(1));
                            playerFlight.invincibleTime = 1;
                        }
                        else {
                            _this.showHighestScore(scoreAndCredit);
                        }
                    });
                    this.gameObjectManager.add(continueScreen);
                }
                else {
                    playerFlight.paused = true;
                    for (var _d = 0, _e = this.enemies; _d < _e.length; _d++) {
                        var e = _e[_d];
                        e.paused = true;
                    }
                    this.enemyCooperator.paused = true;
                    this.showHighestScore(scoreAndCredit);
                }
            }
            else {
                playerFlight.paused = true;
                for (var _f = 0, _g = this.enemies; _f < _g.length; _f++) {
                    var e = _g[_f];
                    e.paused = true;
                }
                this.enemyCooperator.paused = true;
                var t = new zlsSpaceInvader.FloatingText("ALL MEMBERS CAPTURED", function () {
                    _this.showHighestScore(scoreAndCredit);
                });
                this.gameObjectManager.add(t);
            }
        };
        Main.prototype.showHighestScore = function (scoreAndCredit) {
            var hiScoreScr = new zlsSpaceInvader.HiScoreScreen(scoreAndCredit.hiScore);
            this.gameObjectManager.add(hiScoreScr);
        };
        Main.prototype.onMute = function (button) {
            if (zlsSpaceInvader.Audio.volume != 0) {
                zlsSpaceInvader.Audio.volume = 0;
                button.value = "SOUND ON";
            }
            else {
                zlsSpaceInvader.Audio.volume = zlsSpaceInvader.Constant.volume;
                button.value = "SOUND OFF";
            }
        };
        Main.prototype.run = function () {
            var _this = this;
            var prevTime = performance.now();
            setInterval(function () {
                if (_this.allowUpdate) {
                    var curTime = performance.now();
                    var deltaTime = Math.min(zlsSpaceInvader.Constant.maxTimeStep, (curTime - prevTime) / 1000);
                    _this.update(deltaTime);
                    prevTime = curTime;
                }
            }, 10);
        };
        Main.prototype.update = function (deltaTime) {
            this.render(deltaTime);
            this.gameObjectManager.update(deltaTime);
            zlsSpaceInvader.Input.shared.update();
        };
        Main.prototype.render = function (deltaTime) {
            var _this = this;
            this.allowUpdate = false;
            requestAnimationFrame(function () {
                if (_this.halfRenderContext) {
                    var w = _this.halfRenderContext.canvas.width;
                    var h = _this.halfRenderContext.canvas.height;
                    _this.halfRenderContext.fillStyle = zlsSpaceInvader.Palette.bgColor;
                    _this.halfRenderContext.fillRect(0, 0, w, h);
                    _this.halfRenderContext.save();
                    _this.halfRenderContext.translate(w / 2, h / 2);
                    _this.gameObjectManager.renderHalf(deltaTime, _this.halfRenderContext);
                    _this.halfRenderContext.restore();
                    if (_this.ctx) {
                        _this.ctx.drawImage(_this.halfRenderContext.canvas, 0, 0, w, h, 0, 0, _this.ctx.canvas.width, _this.ctx.canvas.height);
                        _this.ctx.save();
                        _this.ctx.translate(_this.ctx.canvas.width / 2, _this.ctx.canvas.height / 2);
                        _this.ctx.scale(2, 2);
                        _this.gameObjectManager.render(deltaTime, _this.ctx);
                        _this.ctx.restore();
                    }
                }
                _this.allowUpdate = true;
            });
        };
        return Main;
    }());
    zlsSpaceInvader.Main = Main;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var invincibleInterval = 3;
    var PlayerFlight = /** @class */ (function (_super) {
        __extends(PlayerFlight, _super);
        function PlayerFlight(stage, nextMember, allMemberRunOut) {
            var _this = _super.call(this) || this;
            _this.stage = stage;
            _this.nextMember = nextMember;
            _this.allMemberRunOut = allMemberRunOut;
            _this.bulletCooldown = 0;
            _this.isPlayerFlight = true;
            _this.next = false;
            _this.invincibleTime = 0;
            _this.canShoot = true;
            _this.removedUnits = [];
            _this.flightUnits = [
                new FlightUnit(zlsSpaceInvader.Sprites.shared.images[1], zlsSpaceInvader.Palette.BulletColor1)
            ];
            return _this;
        }
        PlayerFlight.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            this.invincibleTime -= deltaTime;
            if (zlsSpaceInvader.Input.shared.left)
                this.pos.x -= zlsSpaceInvader.Constant.playerMoveSpeed * deltaTime;
            if (zlsSpaceInvader.Input.shared.right)
                this.pos.x += zlsSpaceInvader.Constant.playerMoveSpeed * deltaTime;
            var padding = this.flightUnits.length * 9 / 2;
            this.pos.x = Math.max(this.pos.x, this.stage.left + padding);
            this.pos.x = Math.min(this.pos.x, this.stage.right - padding);
            this.bulletCooldown -= deltaTime;
            if (this.next) {
                var m = this.nextMember();
                if (m) {
                    for (var _i = 0, _a = this.flightUnits; _i < _a.length; _i++) {
                        var u = _a[_i];
                        this.removedUnits.push(u);
                    }
                    this.flightUnits = [
                        new FlightUnit(m.sprite, m.bulletColor)
                    ];
                    this.visible = true;
                    this.pos.x = 0;
                    this.invincibleTime = invincibleInterval;
                }
                else {
                    this.allMemberRunOut();
                }
                this.next = false;
            }
            else if (zlsSpaceInvader.Input.shared.fire && this.bulletCooldown <= 0 && this.manager && this.canShoot) {
                for (var _b = 0, _c = this.flightUnits; _b < _c.length; _b++) {
                    var u = _c[_b];
                    var b = new zlsSpaceInvader.Bullet(this.stage, u.bulletColor);
                    b.pos.copy(this.pos);
                    b.pos.x += u.pos.x;
                    b.pos.y -= 6;
                    this.manager.add(b);
                }
                this.bulletCooldown = zlsSpaceInvader.Constant.playerFireInterval;
                zlsSpaceInvader.Audio.play(zlsSpaceInvader.Audio.sounds.shoot);
            }
        };
        PlayerFlight.prototype.render = function (deltaTime, ctx) {
            _super.prototype.render.call(this, deltaTime, ctx);
            for (var _i = 0, _a = this.flightUnits; _i < _a.length; _i++) {
                var u = _a[_i];
                ctx.drawImage(u.sprite, Math.floor(this.pos.x + u.pos.x - u.sprite.width / 2), Math.floor(this.pos.y + u.pos.y - u.sprite.height / 2));
            }
        };
        PlayerFlight.prototype.reset = function (flightUnit) {
            this.flightUnits = [
                flightUnit
            ];
            this.removedUnits.length = 0;
            this.visible = true;
            this.pos.x = 0;
        };
        PlayerFlight.prototype.add = function (units) {
            var leftMostPos = this.flightUnits.length > 0 ? this.flightUnits[0].pos.x : 0;
            for (var _i = 0, units_1 = units; _i < units_1.length; _i++) {
                var u = units_1[_i];
                this.flightUnits.push(u);
            }
            for (var i = 0; i < this.flightUnits.length; i++) {
                var u = this.flightUnits[i];
                u.pos.x = (i - (this.flightUnits.length - 1) / 2) * 9;
            }
            this.pos.x += leftMostPos - this.flightUnits[0].pos.x;
        };
        PlayerFlight.prototype.remove = function (index) {
            if (this.flightUnits.length > 1) {
                var positioningUnit = this.flightUnits[index == 0 ? 1 : 0];
                var leftMostPos = positioningUnit.pos.x;
                this.removedUnits.push(this.flightUnits.splice(index, 1)[0]);
                for (var i = 0; i < this.flightUnits.length; i++) {
                    var u = this.flightUnits[i];
                    u.pos.x = (i - (this.flightUnits.length - 1) / 2) * 9;
                }
                this.pos.x += leftMostPos - positioningUnit.pos.x;
                this.invincibleTime = 1;
            }
            else {
                this.next = true;
            }
        };
        return PlayerFlight;
    }(zlsSpaceInvader.GameObject));
    zlsSpaceInvader.PlayerFlight = PlayerFlight;
    var FlightUnit = /** @class */ (function () {
        function FlightUnit(sprite, bulletColor) {
            this.sprite = sprite;
            this.bulletColor = bulletColor;
            this.pos = new zlsSpaceInvader.Vector2;
        }
        return FlightUnit;
    }());
    zlsSpaceInvader.FlightUnit = FlightUnit;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    function addLeadingZero(n, length) {
        var s = "" + n;
        while (s.length < length) {
            s = "0" + s;
        }
        return s;
    }
    zlsSpaceInvader.addLeadingZero = addLeadingZero;
    var hiScoreItemKey = "hiscore";
    var ScoreAndCredit = /** @class */ (function (_super) {
        __extends(ScoreAndCredit, _super);
        function ScoreAndCredit(stage, franchouchou) {
            var _this = _super.call(this) || this;
            _this.stage = stage;
            _this.franchouchou = franchouchou;
            _this._score = 0;
            _this._hiScore = parseInt(localStorage.getItem(hiScoreItemKey) || "0");
            _this.credit = 10;
            _this.renderOrder = 1;
            _this.renderHalf = false;
            return _this;
        }
        Object.defineProperty(ScoreAndCredit.prototype, "score", {
            get: function () {
                return this._score;
            },
            set: function (n) {
                this._score = n;
                if (n > this._hiScore) {
                    this._hiScore = n;
                    localStorage.setItem(hiScoreItemKey, "" + n);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScoreAndCredit.prototype, "hiScore", {
            get: function () {
                return this._hiScore;
            },
            enumerable: true,
            configurable: true
        });
        ScoreAndCredit.prototype.render = function (deltaTime, ctx) {
            _super.prototype.render.call(this, deltaTime, ctx);
            var w = this.stage.right - this.stage.left;
            var h = this.stage.bottom - this.stage.top;
            zlsSpaceInvader.TextDrawer.shared.drawText("SCORE " + addLeadingZero(this.score, 6), Math.floor(-w / 2 + 4), Math.floor(-h / 2 + 9), ctx);
            var hiScoreTxt = "HI-SCORE " + addLeadingZero(this.hiScore, 6);
            zlsSpaceInvader.TextDrawer.shared.drawText(hiScoreTxt, Math.floor(w / 2 - 2 - zlsSpaceInvader.TextDrawer.shared.measure(hiScoreTxt)), Math.floor(-h / 2 + 9), ctx);
            var creditTxt = "CREDIT " + addLeadingZero(Math.min(this.credit, 99), 2);
            zlsSpaceInvader.TextDrawer.shared.drawText(creditTxt, Math.floor(w / 2 - 2 - zlsSpaceInvader.TextDrawer.shared.measure(creditTxt)), Math.floor(h / 2 - 10), ctx);
            zlsSpaceInvader.TextDrawer.shared.drawText("" + this.franchouchou.remainingMember, Math.floor(-w / 2 + 4), Math.floor(h / 2 - 10), ctx);
        };
        return ScoreAndCredit;
    }(zlsSpaceInvader.GameObject));
    zlsSpaceInvader.ScoreAndCredit = ScoreAndCredit;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var starDensity = 0.0025;
    var StarNight = /** @class */ (function (_super) {
        __extends(StarNight, _super);
        function StarNight(stage) {
            var _this = _super.call(this) || this;
            _this.stage = stage;
            _this.renderOrder = -1;
            var w = stage.right - stage.left;
            var h = stage.bottom - stage.top;
            _this.stars = new Array(Math.floor(w * h * starDensity));
            for (var i = 0; i < _this.stars.length; i++) {
                _this.stars[i] = {
                    pos: new zlsSpaceInvader.Vector2(stage.left + Math.random() * w, stage.top + Math.random() * h),
                    speed: (10 + Math.random() * 10) * 0.6
                };
            }
            return _this;
        }
        StarNight.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            var h = this.stage.bottom - this.stage.top;
            for (var _i = 0, _a = this.stars; _i < _a.length; _i++) {
                var s = _a[_i];
                s.pos.y += s.speed * deltaTime;
                if (s.pos.y > this.stage.bottom)
                    s.pos.y -= h;
            }
        };
        StarNight.prototype.render = function (deltaTime, ctx) {
            _super.prototype.render.call(this, deltaTime, ctx);
            var sprite = zlsSpaceInvader.Sprites.shared.images["star"];
            for (var _i = 0, _a = this.stars; _i < _a.length; _i++) {
                var s = _a[_i];
                ctx.drawImage(sprite, Math.floor(s.pos.x), Math.floor(s.pos.y));
            }
        };
        return StarNight;
    }(zlsSpaceInvader.GameObject));
    zlsSpaceInvader.StarNight = StarNight;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var StartScreen = /** @class */ (function (_super) {
        __extends(StartScreen, _super);
        function StartScreen(onStart) {
            var _this = _super.call(this) || this;
            _this.onStart = onStart;
            _this.time = 0;
            _this.renderOrder = 1;
            _this.renderHalf = false;
            return _this;
        }
        StartScreen.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            this.time += deltaTime;
            if (zlsSpaceInvader.Input.shared.pressAnyKey && this.time >= 1) {
                this.onStart();
                this.removeFromManager();
            }
        };
        StartScreen.prototype.render = function (deltaTime, ctx) {
            _super.prototype.render.call(this, deltaTime, ctx);
            var txt = "PRESS ANY KEY TO START";
            zlsSpaceInvader.TextDrawer.shared.drawText(txt, Math.floor(-zlsSpaceInvader.TextDrawer.shared.measure(txt) / 2), 30, ctx);
        };
        return StartScreen;
    }(zlsSpaceInvader.GameObject));
    zlsSpaceInvader.StartScreen = StartScreen;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var w = 12;
    var h = 7;
    var characterSpacing = 10;
    var characters = {};
    for (var i = 0; i < 10; i++) {
        characters["" + i] = {
            x: 26 + i * w,
            y: 46
        };
    }
    var letters1 = "ABCDEFGHIJKLMNO";
    var letters2 = "PQRSTUVWXYZ";
    for (var i = 0; i < letters1.length; i++) {
        characters[letters1[i]] = {
            x: 38 + i * w,
            y: 55
        };
    }
    for (var i = 0; i < letters2.length; i++) {
        characters[letters2[i]] = {
            x: 26 + i * w,
            y: 64
        };
    }
    characters["-"] = {
        x: 182,
        y: 37
    };
    characters["?"] = {
        x: 206,
        y: 46
    };
    characters["ジ"] = {
        x: 182,
        y: 154
    };
    characters["ャ"] = {
        x: 194,
        y: 154
    };
    characters["イ"] = {
        x: 206,
        y: 154
    };
    var TextDrawer = /** @class */ (function () {
        function TextDrawer() {
            this.fontSheet = zlsSpaceInvader.Sprites.shared.images["font"];
        }
        TextDrawer.prototype.measure = function (text) {
            return text.length * characterSpacing * 0.5;
        };
        TextDrawer.prototype.drawText = function (text, x, y, ctx) {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(0.5, 0.5);
            for (var _i = 0, text_1 = text; _i < text_1.length; _i++) {
                var c = text_1[_i];
                var m = characters[c];
                if (m) {
                    ctx.drawImage(this.fontSheet, m.x, m.y, w, h, 0, 0, w, h);
                }
                ctx.translate(characterSpacing, 0);
            }
            ctx.restore();
        };
        TextDrawer.shared = new TextDrawer();
        return TextDrawer;
    }());
    zlsSpaceInvader.TextDrawer = TextDrawer;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var WaveScreen = /** @class */ (function (_super) {
        __extends(WaveScreen, _super);
        function WaveScreen(wave, onEnd) {
            var _this = _super.call(this) || this;
            _this.wave = wave;
            _this.onEnd = onEnd;
            _this.time = 0;
            _this.renderOrder = 1;
            _this.renderHalf = false;
            return _this;
        }
        WaveScreen.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            this.time += deltaTime;
            if (this.time >= 3) {
                this.onEnd();
                this.removeFromManager();
            }
        };
        WaveScreen.prototype.render = function (deltaTime, ctx) {
            _super.prototype.render.call(this, deltaTime, ctx);
            var txt = "WAVE " + zlsSpaceInvader.addLeadingZero(this.wave, 2);
            zlsSpaceInvader.TextDrawer.shared.drawText(txt, Math.floor(-zlsSpaceInvader.TextDrawer.shared.measure(txt) / 2), 30, ctx);
        };
        return WaveScreen;
    }(zlsSpaceInvader.GameObject));
    zlsSpaceInvader.WaveScreen = WaveScreen;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
