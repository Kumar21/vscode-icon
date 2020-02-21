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
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-unused-expressions */
const chai_1 = require("chai");
const os = require("os");
const proxyq = require("proxyquire");
const sinon = require("sinon");
const path = require("path");
const fsAsync = require("../../src/common/fsAsync");
const models_1 = require("../../src/models");
const utils_1 = require("../../src/utils");
describe('Utils: tests', function () {
    context('ensures that', function () {
        let sandbox;
        let existsAsyncStub;
        beforeEach(function () {
            sandbox = sinon.createSandbox();
            existsAsyncStub = sandbox.stub(fsAsync, 'existsAsync').resolves();
        });
        afterEach(function () {
            sandbox.restore();
        });
        context(`the 'getAppDataDirPath' function`, function () {
            context(`returns the correct 'vscode' path`, function () {
                context(`when the process platform is`, function () {
                    let envStub;
                    let platformStub;
                    beforeEach(function () {
                        envStub = sandbox.stub(process, 'env');
                        platformStub = sandbox.stub(process, 'platform');
                    });
                    it('darwin (macOS)', function () {
                        const dirPath = `${os.homedir()}/Library/Application Support`;
                        platformStub.value('darwin');
                        chai_1.expect(utils_1.Utils.getAppDataDirPath()).to.be.equal(dirPath);
                    });
                    it('linux', function () {
                        const dirPath = `${os.homedir()}/.config`;
                        platformStub.value('linux');
                        chai_1.expect(utils_1.Utils.getAppDataDirPath()).to.be.equal(dirPath);
                    });
                    it('win32 (windows)', function () {
                        const dirPath = 'C:\\Users\\User\\AppData\\Roaming';
                        envStub.value({
                            APPDATA: dirPath,
                        });
                        platformStub.value('win32');
                        chai_1.expect(utils_1.Utils.getAppDataDirPath()).to.be.equal(dirPath);
                    });
                    it('NOT implemented', function () {
                        const dirPath = '/var/local';
                        platformStub.value('freebsd');
                        chai_1.expect(utils_1.Utils.getAppDataDirPath()).to.be.equal(dirPath);
                    });
                });
            });
        });
        context(`the 'pathUnixJoin' function`, function () {
            it('returns a path using Unix separator', function () {
                chai_1.expect(utils_1.Utils.pathUnixJoin('path', 'to', 'code')).to.equal('path/to/code');
            });
        });
        context(`the 'tempPath' function`, function () {
            it('returns the path to the OS temporary directory', function () {
                chai_1.expect(utils_1.Utils.tempPath()).to.equal(os.tmpdir());
            });
        });
        context(`the 'fileFormatToString' function`, function () {
            it(`returns the string representation of the 'FileFormat'`, function () {
                chai_1.expect(utils_1.Utils.fileFormatToString('svg')).to.equal('.svg');
                chai_1.expect(utils_1.Utils.fileFormatToString(models_1.FileFormat.svg)).to.equal('.svg');
            });
        });
        context(`the 'createDirectoryRecursively' function`, function () {
            context('creates all directories asynchronously', function () {
                context(`when the process platform is`, function () {
                    let pathSepStub;
                    let mkdirAsyncStub;
                    beforeEach(function () {
                        pathSepStub = sandbox.stub(path, 'sep');
                        mkdirAsyncStub = sandbox.stub(fsAsync, 'mkdirAsync').resolves();
                    });
                    const testCase = (directoryPath, dirExists, expectedCounts) => __awaiter(this, void 0, void 0, function* () {
                        const fileCheck = existsAsyncStub.callsFake((dirPath) => dirExists ||
                            directoryPath.split(path.sep).indexOf(dirPath) !== -1);
                        const createDirectory = mkdirAsyncStub.resolves();
                        fileCheck.resetHistory();
                        createDirectory.resetHistory();
                        yield utils_1.Utils.createDirectoryRecursively(directoryPath);
                        chai_1.expect(fileCheck.callCount).to.be.equal(dirExists ? expectedCounts + 2 : expectedCounts);
                        chai_1.expect(createDirectory.callCount).to.equal(expectedCounts);
                    });
                    it('win32 (windows)', function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            pathSepStub.value('\\');
                            // Directory Exists
                            yield testCase('path\\to', true, 0);
                            // Create Directory
                            // - Relative path
                            yield testCase('.\\path', false, 2);
                            // - Absolute path
                            yield testCase('C:\\path\\to', false, 3);
                        });
                    });
                    it('*nix', function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            pathSepStub.value('/');
                            // Directory Exists
                            yield testCase('path/to', true, 0);
                            // Create Directory
                            // - Relative path
                            yield testCase('path/to', false, 2);
                            // - Absolute path
                            yield testCase('/path/to', false, 3);
                        });
                    });
                });
            });
        });
        context(`the 'deleteDirectoryRecursively' function`, function () {
            let readdirAsyncStub;
            it('deletes a directory and all subdirectories asynchronously', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    readdirAsyncStub = sandbox.stub(fsAsync, 'readdirAsync').resolves();
                    const directoryPath = '/path/to';
                    const lstatsAsyncStub = sandbox.stub(fsAsync, 'lstatAsync').resolves();
                    const fileCheck = existsAsyncStub
                        .onFirstCall()
                        .resolves(true)
                        .onSecondCall()
                        .resolves(false);
                    const readDirectory = readdirAsyncStub.resolves(['dir', 'file.txt']);
                    const lstats = lstatsAsyncStub
                        .onFirstCall()
                        .resolves({
                        isDirectory: () => true,
                    })
                        .onSecondCall()
                        .resolves({
                        isDirectory: () => false,
                    });
                    const deleteFile = sandbox.stub(fsAsync, 'unlinkAsync').resolves();
                    const removeDirectory = sandbox.stub(fsAsync, 'rmdirAsync').resolves();
                    yield utils_1.Utils.deleteDirectoryRecursively(directoryPath);
                    chai_1.expect(fileCheck.calledTwice).to.be.true;
                    chai_1.expect(readDirectory.calledOnce).to.be.true;
                    chai_1.expect(lstats.calledTwice).to.be.true;
                    chai_1.expect(deleteFile.calledOnce).to.be.true;
                    chai_1.expect(removeDirectory.calledOnce).to.be.true;
                });
            });
        });
        context(`the 'parseJSON' function`, function () {
            it('returns an object when parsing succeeds', function () {
                const json = utils_1.Utils.parseJSON('{"test": "test"}');
                chai_1.expect(json).to.be.instanceOf(Object);
                chai_1.expect(Object.getOwnPropertyNames(json)).to.include('test');
                chai_1.expect(json['test']).to.be.equal('test');
            });
            it(`returns 'null' when parsing fails`, function () {
                chai_1.expect(utils_1.Utils.parseJSON('test')).to.be.null;
            });
        });
        context(`the 'getRelativePath' function`, function () {
            context(`does NOT throw an Error`, function () {
                context(`if the destination directory does NOT exists`, function () {
                    it('and a directory check should NOT be done', function () {
                        const toDirName = 'path/to';
                        chai_1.expect(() => utils_1.Utils.getRelativePath('path/from', toDirName, false)).to.not.throw(Error, `Directory '${toDirName}' not found.`);
                    });
                });
            });
            context('returns a relative path that', function () {
                context('has a trailing path separator', function () {
                    const trailingPathSeparatorTest = (toDirName) => __awaiter(this, void 0, void 0, function* () {
                        const relativePath = yield utils_1.Utils.getRelativePath('path/from', toDirName, false);
                        chai_1.expect(/\/$/g.test(relativePath)).to.be.true;
                        chai_1.expect(/\/{2,}$/g.test(relativePath)).to.be.false;
                    });
                    it(`if it's provided`, function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield trailingPathSeparatorTest('path/to/');
                        });
                    });
                    it(`if it's NOT provided`, function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield trailingPathSeparatorTest('path/to');
                        });
                    });
                    it('that is NOT repeated', function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield trailingPathSeparatorTest('path/to//');
                            yield trailingPathSeparatorTest('path/to///');
                        });
                    });
                });
            });
            context('throws an Error', function () {
                it('if the `fromDirPath` parameter is NOT defined', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield utils_1.Utils.getRelativePath(null, 'path/to');
                        }
                        catch (error) {
                            chai_1.expect(error).to.match(/fromDirPath not defined\./);
                        }
                    });
                });
                it('if the `toDirName` parameter is NOT defined', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield utils_1.Utils.getRelativePath('path/from', null);
                        }
                        catch (error) {
                            chai_1.expect(error).to.match(/toDirName not defined\./);
                        }
                    });
                });
                it('the destination directory does NOT exists', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const toDirName = 'path/to';
                        try {
                            yield utils_1.Utils.getRelativePath('path/from', toDirName);
                        }
                        catch (error) {
                            chai_1.expect(error).to.match(new RegExp(`Directory '${toDirName}' not found.`));
                        }
                    });
                });
            });
        });
        context(`the 'removeFirstDot' function`, function () {
            it('removes the leading dot', function () {
                chai_1.expect(utils_1.Utils.removeFirstDot('.test')).to.be.equal('test');
            });
            it('ignores when no leading dot', function () {
                chai_1.expect(utils_1.Utils.removeFirstDot('test')).to.be.equal('test');
            });
        });
        context(`the 'belongToSameDrive' function`, function () {
            it(`returns 'false', when paths do NOT belong to the same drive`, function () {
                chai_1.expect(utils_1.Utils.belongToSameDrive('C:\\path\\to', 'D:\\path\to')).to.be.false;
            });
            it(`returns 'true', when paths do belong to the same drive`, function () {
                chai_1.expect(utils_1.Utils.belongToSameDrive('C:\\path\\to', 'C:\\anotherpath\to')).to.be.true;
            });
        });
        context(`the 'overwriteDrive' function`, function () {
            it('overwrites the drive', function () {
                const sourcePath = 'C:\\path\\to';
                const destPath = 'D:\\path\\to';
                chai_1.expect(utils_1.Utils.overwriteDrive(sourcePath, destPath)).to.be.equal(sourcePath);
            });
        });
        context(`the 'getDrives' function returns an`, function () {
            it('Array of the provided drives', function () {
                const drive1 = 'C:';
                const drive2 = 'D:';
                chai_1.expect(utils_1.Utils.getDrives(drive1))
                    .to.be.an.instanceOf(Array)
                    .and.include(drive1);
                chai_1.expect(utils_1.Utils.getDrives(drive1, drive2))
                    .an.instanceOf(Array)
                    .and.include.members([drive1, drive2]);
            });
            it('empty Array, if no drive is provided', function () {
                chai_1.expect(utils_1.Utils.getDrives()).to.be.an.instanceOf(Array).and.be.empty;
            });
            it('Array of undefined drives, if provided paths are NOT actual drives', function () {
                chai_1.expect(utils_1.Utils.getDrives('/', 'file:///'))
                    .to.be.an.instanceOf(Array)
                    .and.include.members([undefined]);
            });
        });
        context(`the 'combine' function`, function () {
            it('returns an array combining the elements of the provided arrays', function () {
                const array1 = ['webpack.base.conf', 'webpack.common'];
                const array2 = ['js', 'coffee', 'ts'];
                const combinedArray = [
                    'webpack.base.conf.js',
                    'webpack.base.conf.coffee',
                    'webpack.base.conf.ts',
                    'webpack.common.js',
                    'webpack.common.coffee',
                    'webpack.common.ts',
                ];
                chai_1.expect(utils_1.Utils.combine(array1, array2))
                    .to.be.an.instanceOf(Array)
                    .and.have.deep.members(combinedArray);
            });
        });
        context(`the 'updateFile' function`, function () {
            let readFileAsyncStub;
            let writeFileAsyncStub;
            let replacerStub;
            beforeEach(function () {
                readFileAsyncStub = sandbox.stub(fsAsync, 'readFileAsync');
                writeFileAsyncStub = sandbox.stub(fsAsync, 'writeFileAsync').resolves();
                replacerStub = sandbox.stub();
            });
            it('rejects on file read error', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    readFileAsyncStub.rejects(new Error('error on read'));
                    try {
                        yield utils_1.Utils.updateFile('', replacerStub);
                    }
                    catch (err) {
                        chai_1.expect(replacerStub.called).to.be.false;
                        chai_1.expect(err)
                            .to.be.an.instanceof(Error)
                            .that.matches(/error on read/);
                    }
                });
            });
            it('rejects on file write error', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    readFileAsyncStub.resolves('');
                    writeFileAsyncStub.rejects(new Error('error on write'));
                    replacerStub.returns([]);
                    try {
                        yield utils_1.Utils.updateFile('', replacerStub);
                    }
                    catch (error) {
                        chai_1.expect(replacerStub.calledOnce).to.be.true;
                        chai_1.expect(error)
                            .to.be.an.instanceof(Error)
                            .that.matches(/error on write/);
                    }
                });
            });
            it('correctly detects unix style EOL (LF)', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    readFileAsyncStub.resolves('\n');
                    replacerStub.returns([]);
                    const result = yield utils_1.Utils.updateFile('', replacerStub);
                    chai_1.expect(replacerStub.calledOnce).to.be.true;
                    chai_1.expect(result).to.be.undefined;
                });
            });
            it('correctly detects windows style EOL (CRLF)', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    readFileAsyncStub.resolves('\r\n');
                    replacerStub.returns([]);
                    const result = yield utils_1.Utils.updateFile('', replacerStub);
                    chai_1.expect(replacerStub.calledOnce).to.be.true;
                    chai_1.expect(result).to.be.undefined;
                });
            });
            it(`updates the file`, function () {
                return __awaiter(this, void 0, void 0, function* () {
                    readFileAsyncStub.resolves('text\n');
                    // Note: it's up to the replacer to provide the correct replaced context
                    replacerStub.returns(['replaced\n']);
                    const result = yield utils_1.Utils.updateFile('', replacerStub);
                    chai_1.expect(replacerStub.calledOnce).to.be.true;
                    chai_1.expect(result).to.be.undefined;
                });
            });
        });
        context(`the 'unflattenProperties' function`, function () {
            it(`returns an object with individual properties structure`, function () {
                const obj = {
                    'vsicons.dontShowNewVersionMessage': {
                        default: false,
                    },
                };
                chai_1.expect(utils_1.Utils.unflattenProperties(obj, 'default'))
                    .to.be.an('object')
                    .with.ownProperty('vsicons')
                    .and.that.to.haveOwnProperty('dontShowNewVersionMessage').and.that.to.be.false;
            });
        });
        context(`the 'open' function`, function () {
            it(`to call the external module`, function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const openStub = sandbox.stub().resolves();
                    const target = 'target';
                    const utils = proxyq.noCallThru().load('../../src/utils', {
                        open: openStub,
                    }).Utils;
                    yield utils.open(target);
                    chai_1.expect(openStub.calledOnceWithExactly(target, undefined)).to.be.true;
                });
            });
        });
    });
});
//# sourceMappingURL=utils.test.js.map