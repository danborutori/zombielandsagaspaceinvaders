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
    var GameObject = /** @class */ (function () {
        function GameObject() {
            this.pos = new zlsSpaceInvader.Vector2;
            this.paused = false;
        }
        GameObject.prototype.update = function (deltaTime) { };
        GameObject.prototype.render = function (deltaTime, ctx) { };
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
        SpriteObject.prototype.update = function (deltaTime) { };
        SpriteObject.prototype.render = function (deltaTime, ctx) {
            _super.prototype.render.call(this, deltaTime, ctx);
            ctx.drawImage(this.sprite, Math.floor(this.pos.x - this.sprite.width / 2), Math.floor(this.pos.y + this.sprite.height / 2));
        };
        return SpriteObject;
    }(GameObject));
    zlsSpaceInvader.SpriteObject = SpriteObject;
    var GameObjectManager = /** @class */ (function () {
        function GameObjectManager() {
            this.gameObjects = [];
        }
        GameObjectManager.prototype.add = function (o) {
            o.manager && o.manager.remove(o);
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
            for (var _i = 0, _a = this.gameObjects; _i < _a.length; _i++) {
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
    var Bullet = /** @class */ (function (_super) {
        __extends(Bullet, _super);
        function Bullet(stage) {
            var _this = _super.call(this, zlsSpaceInvader.Sprites.shared.images["bullet"]) || this;
            _this.stage = stage;
            _this.isBullet = true;
            return _this;
        }
        Bullet.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            this.pos.y -= zlsSpaceInvader.Constant.bulletSpeed * deltaTime;
            if (this.pos.y <= this.stage.up) {
                this.manager && this.manager.remove(this);
            }
        };
        return Bullet;
    }(zlsSpaceInvader.SpriteObject));
    zlsSpaceInvader.Bullet = Bullet;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var Constant = /** @class */ (function () {
        function Constant() {
        }
        Constant.maxTimeStep = 1 / 15;
        Constant.playerMoveSpeed = 200;
        Constant.playerFireInterval = 0.1;
        Constant.bulletSpeed = 200;
        return Constant;
    }());
    zlsSpaceInvader.Constant = Constant;
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
            return _this;
        }
        ContinueScreen.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            if (zlsSpaceInvader.Input.shared.pressAnyKey && this.countDown < 9) {
                this.continueFunc(true);
                this.manager && this.manager.remove(this);
            }
            else {
                this.countCoolDown -= deltaTime;
                if (this.countCoolDown <= 0) {
                    if (this.countDown <= 0) {
                        this.continueFunc(false);
                        this.manager && this.manager.remove(this);
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
            var txt = "C O N T I N U E ?   " + this.countDown;
            ctx.font = zlsSpaceInvader.Palette.font;
            ctx.fillStyle = "white";
            ctx.fillText(txt, Math.floor(-ctx.measureText(txt).width / 2), 0);
        };
        return ContinueScreen;
    }(zlsSpaceInvader.GameObject));
    zlsSpaceInvader.ContinueScreen = ContinueScreen;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var enemySize = 9;
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
        EnemyFlight.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
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
                var bs = this.manager.gameObjects.filter(function (b) { return b.isBullet; });
                for (var _i = 0, bs_1 = bs; _i < bs_1.length; _i++) {
                    var b = bs_1[_i];
                    if (b.pos.distance(this.pos) < enemySize) {
                        this.flashTime = 0.1;
                        this.manager.remove(b);
                        this.hp -= 1;
                        if (this.hp <= 0) {
                            var ex = new zlsSpaceInvader.Explosion;
                            ex.pos.copy(this.pos);
                            this.manager.add(ex);
                            this.manager.remove(this);
                            this.scorer.score += this.score;
                        }
                    }
                }
                var playerFlight = this.manager && this.manager.gameObjects.filter(function (o) { return o.isPlayerFlight; })[0];
                if (playerFlight &&
                    this.pos.distance(playerFlight.pos) < 9) {
                    this.onHitPlayer(this, playerFlight);
                }
            }
        };
        EnemyFlight.prototype.render = function (deltaTime, ctx) {
            _super.prototype.render.call(this, deltaTime, ctx);
        };
        return EnemyFlight;
    }(zlsSpaceInvader.SpriteObject));
    zlsSpaceInvader.EnemyFlight = EnemyFlight;
    var Zombie1 = /** @class */ (function (_super) {
        __extends(Zombie1, _super);
        function Zombie1(scorer, onHitPlayer) {
            return _super.call(this, zlsSpaceInvader.Sprites.shared.images["zombie1"], scorer, 100, onHitPlayer) || this;
        }
        return Zombie1;
    }(EnemyFlight));
    zlsSpaceInvader.Zombie1 = Zombie1;
    var Zombie2 = /** @class */ (function (_super) {
        __extends(Zombie2, _super);
        function Zombie2(scorer, onHitPlayer) {
            return _super.call(this, zlsSpaceInvader.Sprites.shared.images["zombie2"], scorer, 100, onHitPlayer) || this;
        }
        return Zombie2;
    }(EnemyFlight));
    zlsSpaceInvader.Zombie2 = Zombie2;
    var Hand = /** @class */ (function (_super) {
        __extends(Hand, _super);
        function Hand(scorer, onHitPlayer) {
            return _super.call(this, zlsSpaceInvader.Sprites.shared.images["hand"], scorer, 100, onHitPlayer) || this;
        }
        return Hand;
    }(EnemyFlight));
    zlsSpaceInvader.Hand = Hand;
    var Dog = /** @class */ (function (_super) {
        __extends(Dog, _super);
        function Dog(scorer, onHitPlayer) {
            return _super.call(this, zlsSpaceInvader.Sprites.shared.images["dog"], scorer, 100, onHitPlayer) || this;
        }
        return Dog;
    }(EnemyFlight));
    zlsSpaceInvader.Dog = Dog;
    var Producer = /** @class */ (function (_super) {
        __extends(Producer, _super);
        function Producer(scorer, onHitPlayer) {
            return _super.call(this, zlsSpaceInvader.Sprites.shared.images["p"], scorer, 1000, onHitPlayer) || this;
        }
        return Producer;
    }(EnemyFlight));
    zlsSpaceInvader.Producer = Producer;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var enemyEdgePadding = 9;
    var EnemyCooperator = /** @class */ (function (_super) {
        __extends(EnemyCooperator, _super);
        function EnemyCooperator(stage, enemies, waveEnd) {
            var _this = _super.call(this) || this;
            _this.stage = stage;
            _this.enemies = enemies;
            _this.waveEnd = waveEnd;
            _this.cooldown = 0;
            _this.moveDir = "left";
            return _this;
        }
        EnemyCooperator.prototype.update = function (deltaTime) {
            var _this = this;
            _super.prototype.update.call(this, deltaTime);
            this.cooldown -= deltaTime;
            if (this.cooldown <= 0) {
                var lifeEnemyRatio = this.enemies.reduce(function (a, b) { return a + (b.manager ? 1 : 0); }, 0) / (this.enemies.length - 1);
                var interval = 0.01 + 0.49 * lifeEnemyRatio;
                var enemyMoveSpeed = 3 + (1 - lifeEnemyRatio) * 6;
                var enemyYMoveSpeed = 7 + (1 - lifeEnemyRatio) * 7;
                var deltaX = 0;
                var deltaY = 0;
                switch (this.moveDir) {
                    case "left":
                        var minX = Number.MAX_VALUE;
                        for (var _i = 0, _a = this.enemies; _i < _a.length; _i++) {
                            var e = _a[_i];
                            if (e.manager)
                                minX = Math.min(e.pos.x, minX);
                        }
                        if (minX <= this.stage.left + enemyEdgePadding) {
                            deltaY = enemyYMoveSpeed;
                            this.moveDir = "right";
                        }
                        break;
                    case "right":
                        var maxX = Number.MIN_VALUE;
                        for (var _b = 0, _c = this.enemies; _b < _c.length; _b++) {
                            var e = _c[_b];
                            if (e.manager)
                                maxX = Math.max(e.pos.x, maxX);
                        }
                        if (maxX >= this.stage.right - enemyEdgePadding) {
                            deltaY = enemyYMoveSpeed;
                            this.moveDir = "left";
                        }
                        break;
                }
                if (deltaY == 0) {
                    switch (this.moveDir) {
                        case "left":
                            deltaX = -enemyMoveSpeed;
                            break;
                        case "right":
                            deltaX = enemyMoveSpeed;
                            break;
                    }
                }
                for (var _d = 0, _e = this.enemies; _d < _e.length; _d++) {
                    var e = _e[_d];
                    e.pos.x += deltaX;
                    e.pos.y += deltaY;
                }
                this.cooldown += interval;
            }
            var anyAlive = this.enemies.reduce(function (a, b) {
                return a || (b.manager !== undefined && b.pos.y < _this.stage.bottom);
            }, false);
            if (!anyAlive) {
                this.waveEnd();
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
            return _this;
        }
        Explosion.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            this.lifeTime += deltaTime;
            if (this.lifeTime > 0.1 && this.manager) {
                this.manager.remove(this);
            }
        };
        return Explosion;
    }(zlsSpaceInvader.SpriteObject));
    zlsSpaceInvader.Explosion = Explosion;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var memberList = [
        5,
        6,
        4,
        2,
        3,
        0
    ];
    var Franchouchou = /** @class */ (function () {
        function Franchouchou(stage, manager) {
            this.manager = manager;
            this.remainingMember = 7;
            this.members = [];
            for (var i = 0; i < memberList.length; i++) {
                var m = new zlsSpaceInvader.SpriteObject(zlsSpaceInvader.Sprites.shared.images["" + memberList[i]]);
                m.pos.x = stage.left + 15 + i * 11;
                m.pos.y = stage.bottom - 18;
                manager.add(m);
                this.members.push(m);
            }
        }
        Object.defineProperty(Franchouchou.prototype, "nextSprite", {
            get: function () {
                this.remainingMember--;
                if (this.remainingMember - 1 >= 0) {
                    var m = this.members[this.remainingMember - 1];
                    m.manager && m.manager.remove(m);
                    return zlsSpaceInvader.Sprites.shared.images["" + memberList[this.remainingMember - 1]];
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Franchouchou.prototype.reset = function () {
            this.remainingMember = 7;
            for (var _i = 0, _a = this.members; _i < _a.length; _i++) {
                var m = _a[_i];
                if (!m.manager) {
                    this.manager.add(m);
                }
            }
        };
        return Franchouchou;
    }());
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
            var txt = "H I - S C O R E   " + zlsSpaceInvader.addLeadingZero(this.score, 6);
            ctx.font = zlsSpaceInvader.Palette.font;
            ctx.fillStyle = "white";
            ctx.fillText(txt, Math.floor(-ctx.measureText(txt).width / 2), 0);
        };
        return HiScoreScreen;
    }(zlsSpaceInvader.GameObject));
    zlsSpaceInvader.HiScoreScreen = HiScoreScreen;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var Input = /** @class */ (function () {
        function Input() {
            var _this = this;
            this.left = false;
            this.right = false;
            this.fire = false;
            this.pressAnyKey = false;
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
            this.stage = {
                left: 0,
                right: 0,
                up: 0,
                bottom: 0
            };
            this.enemies = [];
            this.enemyCooperator = new zlsSpaceInvader.EnemyCooperator(this.stage, [], function () { });
            this.wave = 1;
        }
        Main.prototype.init = function (canvas) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.ctx = canvas.getContext("2d");
                            if (this.ctx) {
                                this.ctx.imageSmoothingEnabled = false;
                            }
                            return [4 /*yield*/, zlsSpaceInvader.Sprites.shared.load()];
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
            var scoreAndCredit = new zlsSpaceInvader.ScoreAndCredit({
                get remainingMember() {
                    return franchouchou.remainingMember;
                }
            });
            if (this.ctx) {
                this.stage.left = -this.ctx.canvas.width / 2;
                this.stage.right = this.ctx.canvas.width / 2;
                this.stage.up = -this.ctx.canvas.height / 2;
                this.stage.bottom = this.ctx.canvas.height / 2;
            }
            this.gameObjectManager.add(new zlsSpaceInvader.StarNight(this.stage));
            var enemyBackOff = function () {
                for (var _i = 0, _a = _this.enemies; _i < _a.length; _i++) {
                    var e = _a[_i];
                    e.pos.y += _this.stage.up;
                }
            };
            var runOutOfMember = function () {
                _this.showContinue(scoreAndCredit, playerFlight, franchouchou);
            };
            var playerFlight = new zlsSpaceInvader.PlayerFlight(this.stage, function () {
                return franchouchou.nextSprite;
            }, enemyBackOff, runOutOfMember);
            playerFlight.pos.y = this.stage.bottom - 35;
            this.gameObjectManager.add(playerFlight);
            this.resetEnemies(playerFlight, scoreAndCredit);
            var franchouchou = new zlsSpaceInvader.Franchouchou(this.stage, this.gameObjectManager);
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
                e.manager && e.manager.remove(e);
            }
            this.enemies.length = 0;
            this.enemyCooperator.manager && this.enemyCooperator.manager.remove(this.enemyCooperator);
            var enemyColumn = 9;
            var enemySpacing = 14;
            var enemyRows = [
                zlsSpaceInvader.Zombie1,
                zlsSpaceInvader.Zombie2,
                zlsSpaceInvader.Hand,
                zlsSpaceInvader.Dog
            ];
            var enemyYOffset = -55;
            for (var i = 0; i < enemyColumn; i++) {
                for (var j = 0; j < enemyRows.length; j++) {
                    var e = new enemyRows[j](scoreAndCredit, function (e, p) {
                        p.next = true;
                        e.manager && e.manager.remove(e);
                    });
                    e.pos.x = (-enemyColumn / 2 + i + 0.5) * enemySpacing;
                    e.pos.y = j * enemySpacing + enemyYOffset;
                    this.gameObjectManager.add(e);
                    this.enemies.push(e);
                }
            }
            var p = new zlsSpaceInvader.Producer(scoreAndCredit, function (e, p) {
                p.next = true;
                e.manager && e.manager.remove(e);
            });
            p.pos.y = enemyYOffset - enemySpacing;
            this.gameObjectManager.add(p);
            this.enemies.push(p);
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
        };
        Main.prototype.enemyBackOff = function () {
            for (var _i = 0, _a = this.enemies; _i < _a.length; _i++) {
                var e = _a[_i];
                e.pos.y += this.stage.up;
            }
        };
        Main.prototype.showContinue = function (scoreAndCredit, playerFlight, franchouchou) {
            var _this = this;
            if (scoreAndCredit.credit > 0) {
                playerFlight.paused = true;
                for (var _i = 0, _a = this.enemies; _i < _a.length; _i++) {
                    var e = _a[_i];
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
                        playerFlight.reset();
                        franchouchou.reset();
                        _this.enemyBackOff();
                    }
                    else {
                        _this.showHighestScore(scoreAndCredit);
                    }
                });
                this.gameObjectManager.add(continueScreen);
            }
            else {
                playerFlight.paused = true;
                for (var _b = 0, _c = this.enemies; _b < _c.length; _b++) {
                    var e = _c[_b];
                    e.paused = true;
                }
                this.enemyCooperator.paused = true;
                this.showHighestScore(scoreAndCredit);
            }
        };
        Main.prototype.showHighestScore = function (scoreAndCredit) {
            scoreAndCredit.hiScore = Math.max(scoreAndCredit.hiScore, scoreAndCredit.score);
            var hiScoreScr = new zlsSpaceInvader.HiScoreScreen(scoreAndCredit.hiScore);
            this.gameObjectManager.add(hiScoreScr);
        };
        Main.prototype.run = function () {
            var _this = this;
            var prevTime = performance.now();
            setInterval(function () {
                var curTime = performance.now();
                var deltaTime = Math.min(zlsSpaceInvader.Constant.maxTimeStep, (curTime - prevTime) / 1000);
                if (_this.allowUpdate)
                    _this.update(deltaTime);
                prevTime = curTime;
            }, 10);
        };
        Main.prototype.update = function (deltaTime) {
            this.gameObjectManager.update(deltaTime);
            zlsSpaceInvader.Input.shared.pressAnyKey = false;
            this.render(deltaTime);
        };
        Main.prototype.render = function (deltaTime) {
            var _this = this;
            this.allowUpdate = false;
            requestAnimationFrame(function () {
                if (_this.ctx) {
                    var w = _this.ctx.canvas.width;
                    var h = _this.ctx.canvas.height;
                    _this.ctx.fillStyle = zlsSpaceInvader.Palette.bgColor;
                    _this.ctx.fillRect(0, 0, w, h);
                    _this.ctx.save();
                    _this.ctx.translate(w / 2, h / 2);
                    _this.gameObjectManager.render(deltaTime, _this.ctx);
                    _this.ctx.restore();
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
    var Vector2 = /** @class */ (function () {
        function Vector2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Vector2.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
        };
        Vector2.prototype.distance = function (v) {
            var dx = this.x - v.x;
            var dy = this.y - v.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        return Vector2;
    }());
    zlsSpaceInvader.Vector2 = Vector2;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var Palette = /** @class */ (function () {
        function Palette() {
        }
        Palette.bgColor = "#2C1F22";
        Palette.font = "7px Trebuchet MS";
        return Palette;
    }());
    zlsSpaceInvader.Palette = Palette;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var padding = 4.5;
    var PlayerFlight = /** @class */ (function (_super) {
        __extends(PlayerFlight, _super);
        function PlayerFlight(stage, nextSprite, enemyBackOff, allMemberRunOut) {
            var _this = _super.call(this, zlsSpaceInvader.Sprites.shared.images[1]) || this;
            _this.stage = stage;
            _this.nextSprite = nextSprite;
            _this.enemyBackOff = enemyBackOff;
            _this.allMemberRunOut = allMemberRunOut;
            _this.bulletCooldown = 0;
            _this.isPlayerFlight = true;
            _this.next = false;
            return _this;
        }
        PlayerFlight.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            if (zlsSpaceInvader.Input.shared.left)
                this.pos.x -= zlsSpaceInvader.Constant.playerMoveSpeed * deltaTime;
            if (zlsSpaceInvader.Input.shared.right)
                this.pos.x += zlsSpaceInvader.Constant.playerMoveSpeed * deltaTime;
            this.pos.x = Math.max(this.pos.x, this.stage.left + padding);
            this.pos.x = Math.min(this.pos.x, this.stage.right - padding);
            this.bulletCooldown -= deltaTime;
            if (zlsSpaceInvader.Input.shared.fire && this.bulletCooldown <= 0 && this.manager) {
                var b = new zlsSpaceInvader.Bullet(this.stage);
                b.pos.copy(this.pos);
                this.manager.add(b);
                this.bulletCooldown = zlsSpaceInvader.Constant.playerFireInterval;
            }
            if (this.next) {
                var spr = this.nextSprite();
                if (spr) {
                    this.sprite = spr;
                    this.pos.x = 0;
                    this.enemyBackOff();
                }
                else {
                    this.allMemberRunOut();
                }
                this.next = false;
            }
        };
        PlayerFlight.prototype.reset = function () {
            this.sprite = zlsSpaceInvader.Sprites.shared.images[1];
            this.pos.x = 0;
        };
        return PlayerFlight;
    }(zlsSpaceInvader.SpriteObject));
    zlsSpaceInvader.PlayerFlight = PlayerFlight;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    function addLeadingZero(n, length) {
        var s = "" + n;
        while (s.length < length) {
            s = "0" + s;
        }
        return s.split("").join(" ");
    }
    zlsSpaceInvader.addLeadingZero = addLeadingZero;
    var ScoreAndCredit = /** @class */ (function (_super) {
        __extends(ScoreAndCredit, _super);
        function ScoreAndCredit(franchouchou) {
            var _this = _super.call(this) || this;
            _this.franchouchou = franchouchou;
            _this.score = 0;
            _this.hiScore = parseInt(localStorage.getItem("hiscore") || "0");
            _this.credit = 10;
            return _this;
        }
        ScoreAndCredit.prototype.render = function (deltaTime, ctx) {
            _super.prototype.render.call(this, deltaTime, ctx);
            var w = ctx.canvas.width;
            var h = ctx.canvas.height;
            ctx.font = zlsSpaceInvader.Palette.font;
            ctx.fillStyle = "white";
            ctx.fillText("S C O R E   " + addLeadingZero(this.score, 6), Math.floor(-w / 2 + 4), Math.floor(-h / 2 + 9));
            var hiScoreTxt = "H I - S C O R E   " + addLeadingZero(this.hiScore, 6);
            ctx.fillText(hiScoreTxt, Math.floor(w / 2 - 4 - ctx.measureText(hiScoreTxt).width), Math.floor(-h / 2 + 9));
            var creditTxt = "C R E D I T   " + addLeadingZero(Math.min(this.credit, 99), 2);
            ctx.fillText(creditTxt, Math.floor(w / 2 - 4 - ctx.measureText(creditTxt).width), Math.floor(h / 2 - 6));
            ctx.fillText("" + this.franchouchou.remainingMember, Math.floor(-w / 2 + 4), Math.floor(h / 2 - 6));
        };
        return ScoreAndCredit;
    }(zlsSpaceInvader.GameObject));
    zlsSpaceInvader.ScoreAndCredit = ScoreAndCredit;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var paths = {
        0: "/images/0.png",
        1: "/images/1.png",
        2: "/images/2.png",
        3: "/images/3.png",
        4: "/images/4.png",
        5: "/images/5.png",
        6: "/images/6.png",
        7: "/images/7.png",
        dog: "/images/dog.png",
        explod: "/images/explod.png",
        hand: "/images/hand.png",
        p: "/images/p.png",
        zombie1: "/images/zombie1.png",
        zombie2: "/images/zombie2.png",
        bullet: "/images/bullet.png",
        star: "/images/star.png",
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
    var starDensity = 0.0025;
    var StarNight = /** @class */ (function (_super) {
        __extends(StarNight, _super);
        function StarNight(stage) {
            var _this = _super.call(this) || this;
            _this.stage = stage;
            var w = stage.right - stage.left;
            var h = stage.bottom - stage.up;
            _this.stars = new Array(Math.floor(w * h * starDensity));
            for (var i = 0; i < _this.stars.length; i++) {
                _this.stars[i] = {
                    pos: new zlsSpaceInvader.Vector2(stage.left + Math.random() * w, stage.up + Math.random() * h),
                    speed: 10 + Math.random() * 10
                };
            }
            return _this;
        }
        StarNight.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            var h = this.stage.bottom - this.stage.up;
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
            return _this;
        }
        StartScreen.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            this.time += deltaTime;
            if (zlsSpaceInvader.Input.shared.pressAnyKey && this.time >= 1) {
                this.onStart();
                this.manager && this.manager.remove(this);
            }
        };
        StartScreen.prototype.render = function (deltaTime, ctx) {
            _super.prototype.render.call(this, deltaTime, ctx);
            var txt = "P R E S S   A N Y   K E Y   T O   S T A R T";
            ctx.font = zlsSpaceInvader.Palette.font;
            ctx.fillStyle = "white";
            ctx.fillText(txt, Math.floor(-ctx.measureText(txt).width / 2), 30);
        };
        return StartScreen;
    }(zlsSpaceInvader.GameObject));
    zlsSpaceInvader.StartScreen = StartScreen;
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
            return _this;
        }
        WaveScreen.prototype.update = function (deltaTime) {
            _super.prototype.update.call(this, deltaTime);
            this.time += deltaTime;
            if (this.time >= 3) {
                this.onEnd();
                this.manager && this.manager.remove(this);
            }
        };
        WaveScreen.prototype.render = function (deltaTime, ctx) {
            _super.prototype.render.call(this, deltaTime, ctx);
            var txt = "W A V E   " + zlsSpaceInvader.addLeadingZero(this.wave, 2);
            ctx.font = zlsSpaceInvader.Palette.font;
            ctx.fillStyle = "white";
            ctx.fillText(txt, Math.floor(-ctx.measureText(txt).width / 2), 30);
        };
        return WaveScreen;
    }(zlsSpaceInvader.GameObject));
    zlsSpaceInvader.WaveScreen = WaveScreen;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
