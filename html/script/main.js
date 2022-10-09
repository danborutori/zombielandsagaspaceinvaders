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
    var enemySize = 9;
    var EnemyFlight = /** @class */ (function (_super) {
        __extends(EnemyFlight, _super);
        function EnemyFlight(sprite) {
            var _this = _super.call(this, sprite) || this;
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
                        }
                    }
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
        function Zombie1() {
            return _super.call(this, zlsSpaceInvader.Sprites.shared.images["zombie1"]) || this;
        }
        return Zombie1;
    }(EnemyFlight));
    zlsSpaceInvader.Zombie1 = Zombie1;
    var Zombie2 = /** @class */ (function (_super) {
        __extends(Zombie2, _super);
        function Zombie2() {
            return _super.call(this, zlsSpaceInvader.Sprites.shared.images["zombie2"]) || this;
        }
        return Zombie2;
    }(EnemyFlight));
    zlsSpaceInvader.Zombie2 = Zombie2;
    var Hand = /** @class */ (function (_super) {
        __extends(Hand, _super);
        function Hand() {
            return _super.call(this, zlsSpaceInvader.Sprites.shared.images["hand"]) || this;
        }
        return Hand;
    }(EnemyFlight));
    zlsSpaceInvader.Hand = Hand;
    var Dog = /** @class */ (function (_super) {
        __extends(Dog, _super);
        function Dog() {
            return _super.call(this, zlsSpaceInvader.Sprites.shared.images["dog"]) || this;
        }
        return Dog;
    }(EnemyFlight));
    zlsSpaceInvader.Dog = Dog;
    var Producer = /** @class */ (function (_super) {
        __extends(Producer, _super);
        function Producer() {
            return _super.call(this, zlsSpaceInvader.Sprites.shared.images["p"]) || this;
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
        function EnemyCooperator(stage, enemies) {
            var _this = _super.call(this) || this;
            _this.stage = stage;
            _this.enemies = enemies;
            _this.cooldown = 0;
            _this.moveDir = "left";
            return _this;
        }
        EnemyCooperator.prototype.update = function (deltaTime) {
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
    var Input = /** @class */ (function () {
        function Input() {
            var _this = this;
            this.left = false;
            this.right = false;
            this.fire = false;
            addEventListener("keydown", function (e) {
                switch (e.code) {
                    case "ArrowLeft":
                    case "KeyA":
                        _this.left = true;
                        break;
                    case "ArrowRight":
                    case "KeyD":
                        _this.right = true;
                        break;
                    case "ArrowUp":
                    case "KeyW":
                        _this.fire = true;
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
            var stage = {
                left: this.ctx ? -this.ctx.canvas.width / 2 : 0,
                right: this.ctx ? this.ctx.canvas.width / 2 : 0,
                up: this.ctx ? -this.ctx.canvas.height / 2 : 0,
                bottom: this.ctx ? this.ctx.canvas.height / 2 : 0,
            };
            this.gameObjectManager.add(new zlsSpaceInvader.StarNight(stage));
            var playerFlight = new zlsSpaceInvader.PlayerFlight(stage);
            playerFlight.pos.y = 60;
            this.gameObjectManager.add(playerFlight);
            var enemyColumn = 9;
            var enemySpacing = 14;
            var enemyRows = [
                zlsSpaceInvader.Zombie1,
                zlsSpaceInvader.Zombie2,
                zlsSpaceInvader.Hand,
                zlsSpaceInvader.Dog
            ];
            var enemyYOffset = -65;
            var enemies = [];
            for (var i = 0; i < enemyColumn; i++) {
                for (var j = 0; j < enemyRows.length; j++) {
                    var e = new enemyRows[j];
                    e.pos.x = (-enemyColumn / 2 + i + 0.5) * enemySpacing;
                    e.pos.y = j * enemySpacing + enemyYOffset;
                    this.gameObjectManager.add(e);
                    enemies.push(e);
                }
            }
            var p = new zlsSpaceInvader.Producer();
            p.pos.y = enemyYOffset - enemySpacing;
            this.gameObjectManager.add(p);
            enemies.push(p);
            this.gameObjectManager.add(new zlsSpaceInvader.EnemyCooperator(stage, enemies));
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
        return Palette;
    }());
    zlsSpaceInvader.Palette = Palette;
})(zlsSpaceInvader || (zlsSpaceInvader = {}));
var zlsSpaceInvader;
(function (zlsSpaceInvader) {
    var padding = 4.5;
    var PlayerFlight = /** @class */ (function (_super) {
        __extends(PlayerFlight, _super);
        function PlayerFlight(stage) {
            var _this = _super.call(this, zlsSpaceInvader.Sprites.shared.images[1]) || this;
            _this.stage = stage;
            _this.bulletCooldown = 0;
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
        };
        return PlayerFlight;
    }(zlsSpaceInvader.SpriteObject));
    zlsSpaceInvader.PlayerFlight = PlayerFlight;
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
