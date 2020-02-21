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
Object.defineProperty(exports, "__esModule", { value: true });
const open = require("open");
const fsAsync_1 = require("../common/fsAsync");
const lodash_1 = require("lodash");
const os_1 = require("os");
const path_1 = require("path");
const models_1 = require("../models");
class Utils {
    static getAppDataDirPath() {
        switch (process.platform) {
            case 'darwin':
                return `${os_1.homedir()}/Library/Application Support`;
            case 'linux':
                return `${os_1.homedir()}/.config`;
            case 'win32':
                return process.env.APPDATA;
            default:
                return '/var/local';
        }
    }
    static pathUnixJoin(...paths) {
        return path_1.posix.join(...paths);
    }
    static tempPath() {
        return os_1.tmpdir();
    }
    static fileFormatToString(extension) {
        return `.${typeof extension === 'string' ? extension.trim() : models_1.FileFormat[extension]}`;
    }
    /**
     * Creates a directory and all subdirectories asynchronously
     */
    static createDirectoryRecursively(dirPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackFn = (parentDir, childDir) => __awaiter(this, void 0, void 0, function* () {
                const curDir = path_1.resolve(yield parentDir, childDir);
                const dirExists = yield fsAsync_1.existsAsync(curDir);
                if (!dirExists) {
                    yield fsAsync_1.mkdirAsync(curDir);
                }
                return curDir;
            });
            yield dirPath
                .split(path_1.sep)
                .reduce(callbackFn, Promise.resolve(path_1.isAbsolute(dirPath) ? path_1.sep : ''));
        });
    }
    /**
     * Deletes a directory and all subdirectories asynchronously
     */
    static deleteDirectoryRecursively(dirPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const dirExists = yield fsAsync_1.existsAsync(dirPath);
            if (!dirExists) {
                return;
            }
            const iterator = (file) => __awaiter(this, void 0, void 0, function* () {
                const curPath = `${dirPath}/${file}`;
                const stats = yield fsAsync_1.lstatAsync(curPath);
                if (stats.isDirectory()) {
                    // recurse
                    yield this.deleteDirectoryRecursively(curPath);
                }
                else {
                    // delete file
                    yield fsAsync_1.unlinkAsync(curPath);
                }
            });
            const promises = [];
            const files = yield fsAsync_1.readdirAsync(dirPath);
            files.forEach((file) => promises.push(iterator(file)));
            yield Promise.all(promises);
            yield fsAsync_1.rmdirAsync(dirPath);
        });
    }
    /**
     * Converts a JavaScript Object Notation (JSON) string into an object
     * without throwing an exception.
     */
    static parseJSON(text) {
        try {
            return JSON.parse(text);
        }
        catch (err) {
            return null;
        }
    }
    static getRelativePath(fromDirPath, toDirName, checkDirectory = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (fromDirPath == null) {
                throw new Error('fromDirPath not defined.');
            }
            if (toDirName == null) {
                throw new Error('toDirName not defined.');
            }
            const dirExists = yield fsAsync_1.existsAsync(toDirName);
            if (checkDirectory && !dirExists) {
                throw new Error(`Directory '${toDirName}' not found.`);
            }
            return path_1.relative(fromDirPath, toDirName)
                .replace(/\\/g, '/')
                .concat('/');
        });
    }
    static removeFirstDot(txt) {
        return txt.replace(/^\./, '');
    }
    static belongToSameDrive(path1, path2) {
        const [val1, val2] = this.getDrives(path1, path2);
        return val1 === val2;
    }
    static overwriteDrive(sourcePath, destPath) {
        const [val1, val2] = this.getDrives(sourcePath, destPath);
        return destPath.replace(val2, val1);
    }
    static getDrives(...paths) {
        const rx = new RegExp('^[a-zA-Z]:');
        return paths.map(x => (rx.exec(x) || [])[0]);
    }
    static combine(array1, array2) {
        return array1.reduce((previous, current) => previous.concat(array2.map(value => [current, value].join('.'))), []);
    }
    static updateFile(filePath, replaceFn) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield fsAsync_1.readFileAsync(filePath, 'utf8');
            const lineBreak = /\r\n$/.test(raw) ? '\r\n' : '\n';
            const allLines = raw.split(lineBreak);
            const data = replaceFn(allLines).join(lineBreak);
            yield fsAsync_1.writeFileAsync(filePath, data);
        });
    }
    static unflattenProperties(obj, lookupKey) {
        const newObj = {};
        Reflect.ownKeys(obj).forEach((key) => lodash_1.set(newObj, key, obj[key][lookupKey]));
        return newObj;
    }
    static open(target, options) {
        return open(target, options);
    }
}
exports.Utils = Utils;
//# sourceMappingURL=index.js.map