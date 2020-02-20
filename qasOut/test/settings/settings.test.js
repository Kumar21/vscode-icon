"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable only-arrow-functions
// tslint:disable no-unused-expression
const chai_1 = require("chai");
const fs = require("fs");
const sinon = require("sinon");
const utils_1 = require("../../src/utils");
const settings_1 = require("../../src/settings");
const models_1 = require("../../src/models");
const errorHandler_1 = require("../../src/errorHandler");
describe('SettingsManager: tests', function () {
    context('ensures that', function () {
        context('getting the settings', function () {
            it('more than once, returns the same instance', function () {
                const settingsManager = new settings_1.SettingsManager(utils_1.vscode);
                const settings = settingsManager.getSettings();
                const settingsAgain = settingsManager.getSettings();
                chai_1.expect(settings).to.be.an.instanceOf(Object);
                chai_1.expect(settingsAgain).to.be.an.instanceOf(Object);
                chai_1.expect(settingsAgain).to.be.deep.equal(settings);
            });
            it('detects correctly if it is in portable mode', function () {
                const sandbox = sinon
                    .createSandbox()
                    .stub(process, 'env')
                    .value({ VSCODE_PORTABLE: '/PathToPortableInstallationDir/data' });
                const settings = new settings_1.SettingsManager(utils_1.vscode).getSettings();
                chai_1.expect(settings.vscodeAppUserPath).to.match(/user-data/);
                sandbox.restore();
            });
            context('returns the correct name when application is the', function () {
                it(`'Code - Insiders'`, function () {
                    utils_1.vscode.env.appName = 'Visual Studio Code - Insiders';
                    const settings = new settings_1.SettingsManager(utils_1.vscode).getSettings();
                    chai_1.expect(settings.isInsiders).to.be.true;
                    chai_1.expect(settings.isOSS).to.be.false;
                    chai_1.expect(settings.isDev).to.be.false;
                });
                it(`'Code'`, function () {
                    utils_1.vscode.env.appName = 'Visual Studio Code';
                    const settings = new settings_1.SettingsManager(utils_1.vscode).getSettings();
                    chai_1.expect(settings.isInsiders).to.be.false;
                    chai_1.expect(settings.isOSS).to.be.false;
                    chai_1.expect(settings.isDev).to.be.false;
                });
                it(`'Code - OSS'`, function () {
                    utils_1.vscode.env.appName = 'VSCode OSS';
                    const settings = new settings_1.SettingsManager(utils_1.vscode).getSettings();
                    chai_1.expect(settings.isInsiders).to.be.false;
                    chai_1.expect(settings.isOSS).to.be.true;
                    chai_1.expect(settings.isDev).to.be.false;
                });
                it(`'Code - OSS Dev'`, function () {
                    utils_1.vscode.env.appName = 'VSCode OSS Dev';
                    const settings = new settings_1.SettingsManager(utils_1.vscode).getSettings();
                    chai_1.expect(settings.isInsiders).to.be.false;
                    chai_1.expect(settings.isOSS).to.be.false;
                    chai_1.expect(settings.isDev).to.be.true;
                });
            });
        });
        context(`function 'getWorkspacePath returns`, function () {
            it(`the workspace root path when 'workspaceFolders' is not supported`, function () {
                utils_1.vscode.workspace.workspaceFolders = undefined;
                utils_1.vscode.workspace.rootPath = '/path/to/workspace/root';
                const result = new settings_1.SettingsManager(utils_1.vscode).getWorkspacePath();
                chai_1.expect(result)
                    .to.be.an('array')
                    .with.members([utils_1.vscode.workspace.rootPath]);
            });
            it(`the workspace folders when 'workspaceFolders' is supported`, function () {
                const paths = [
                    '/path/to/workspace/folder1/root',
                    '/path/to/workspace/folder2/root',
                ];
                const workspaceFolder = { uri: { fsPath: paths[0] } };
                const workspaceFolder1 = { uri: { fsPath: paths[1] } };
                utils_1.vscode.workspace.workspaceFolders = [workspaceFolder, workspaceFolder1];
                const result = new settings_1.SettingsManager(utils_1.vscode).getWorkspacePath();
                chai_1.expect(result)
                    .to.be.an('array')
                    .with.members(paths);
            });
            it(`'undefined' when 'workspaceFolders' and 'rootPath' is undefined`, function () {
                utils_1.vscode.workspace.workspaceFolders = undefined;
                utils_1.vscode.workspace.rootPath = undefined;
                const result = new settings_1.SettingsManager(utils_1.vscode).getWorkspacePath();
                chai_1.expect(result).to.be.undefined;
            });
        });
    });
    context('ensures that', function () {
        let settingsManager;
        let sandbox;
        beforeEach(() => {
            settingsManager = new settings_1.SettingsManager(utils_1.vscode);
            sandbox = sinon.createSandbox();
        });
        afterEach(() => {
            settingsManager = null;
            sandbox.restore();
        });
        it('the Error gets logged when writting the state fails', function () {
            const writeToFile = sandbox.stub(fs, 'writeFileSync').throws();
            const logStub = sandbox.stub(errorHandler_1.ErrorHandler, 'logError');
            const stateMock = {
                version: '0.0.0',
                status: models_1.ExtensionStatus.notActivated,
                welcomeShown: false,
            };
            settingsManager.setState(stateMock);
            chai_1.expect(logStub.called).to.be.true;
            chai_1.expect(writeToFile.called).to.be.true;
        });
        it('the state gets written to a settings file', function () {
            const writeToFile = sandbox.stub(fs, 'writeFileSync');
            const stateMock = {
                version: '0.0.0',
                status: models_1.ExtensionStatus.notActivated,
                welcomeShown: false,
            };
            settingsManager.setState(stateMock);
            chai_1.expect(writeToFile.called).to.be.true;
        });
        it('the settings status gets updated', function () {
            const stateMock = {
                version: '1.0.0',
                status: models_1.ExtensionStatus.notActivated,
                welcomeShown: false,
            };
            const getState = sinon
                .stub(settingsManager, 'getState')
                .returns(stateMock);
            const setState = sinon.stub(settingsManager, 'setState');
            const status = models_1.ExtensionStatus.enabled;
            const state = settingsManager.updateStatus(status);
            chai_1.expect(getState.called).to.be.true;
            chai_1.expect(setState.called).to.be.true;
            chai_1.expect(state.status).to.be.equal(status);
        });
        it('the settings status does not get updated if no status is provided', function () {
            const stateMock = {
                version: settings_1.extensionSettings.version,
                status: models_1.ExtensionStatus.notActivated,
                welcomeShown: false,
            };
            const getState = sinon
                .stub(settingsManager, 'getState')
                .returns(stateMock);
            const setState = sinon.stub(settingsManager, 'setState');
            const state = settingsManager.updateStatus();
            chai_1.expect(getState.called).to.be.true;
            chai_1.expect(setState.called).to.be.true;
            chai_1.expect(state.version).to.be.equal(stateMock.version);
            chai_1.expect(state.status).to.be.equal(stateMock.status);
            chai_1.expect(state.welcomeShown).to.be.true;
        });
        it('the settings file gets deleted', function () {
            const deleteFile = sandbox.stub(fs, 'unlinkSync');
            settingsManager.deleteState();
            chai_1.expect(deleteFile.called).to.be.true;
        });
        context('getting the state', function () {
            it('returns the state from the settings file', function () {
                const stateMock = {
                    version: '1.0.0',
                    status: models_1.ExtensionStatus.enabled,
                    welcomeShown: true,
                };
                sandbox.stub(fs, 'existsSync').returns(true);
                const var3 = JSON.stringify(stateMock);
                sandbox.stub(fs, 'readFileSync').returns(var3);
                const state = settingsManager.getState();
                chai_1.expect(state).to.be.an.instanceOf(Object);
                chai_1.expect(state).to.have.all.keys('version', 'status', 'welcomeShown');
                chai_1.expect(Object.keys(state)).to.have.lengthOf(3);
            });
            context('returns a default state when', function () {
                it('no settings file exists', function () {
                    sandbox.stub(fs, 'existsSync').returns(false);
                    const state = settingsManager.getState();
                    chai_1.expect(state).to.be.instanceOf(Object);
                    chai_1.expect(state.version).to.be.equal('0.0.0');
                });
                it('reading the file fails', function () {
                    sandbox.stub(fs, 'existsSync').returns(true);
                    sandbox.stub(fs, 'readFileSync').throws(Error);
                    sandbox.stub(console, 'error');
                    const state = settingsManager.getState();
                    chai_1.expect(state).to.be.instanceOf(Object);
                    chai_1.expect(state.version).to.be.equal('0.0.0');
                });
                it('parsing the file content fails', function () {
                    sandbox.stub(fs, 'existsSync').returns(true);
                    const var4 = 'test';
                    sandbox.stub(fs, 'readFileSync').returns(var4);
                    const state = settingsManager.getState();
                    chai_1.expect(state).to.be.instanceOf(Object);
                    chai_1.expect(state.version).to.be.equal('0.0.0');
                });
            });
        });
        context(`the 'isNewVersion' function is`, function () {
            it('truthy for a new extension version', function () {
                const stateMock = {
                    version: '1.0.0',
                    status: models_1.ExtensionStatus.notActivated,
                    welcomeShown: true,
                };
                const getState = sinon
                    .stub(settingsManager, 'getState')
                    .returns(stateMock);
                settingsManager.getSettings();
                chai_1.expect(settingsManager.isNewVersion()).to.be.true;
                chai_1.expect(getState.called).to.be.true;
            });
            it('falsy for the same extension version', function () {
                const stateMock = {
                    version: settings_1.extensionSettings.version,
                    status: models_1.ExtensionStatus.notActivated,
                    welcomeShown: true,
                };
                const getState = sinon
                    .stub(settingsManager, 'getState')
                    .returns(stateMock);
                settingsManager.getSettings();
                chai_1.expect(settingsManager.isNewVersion()).to.be.false;
                chai_1.expect(getState.called).to.be.true;
            });
            it('falsy for an older extension version', function () {
                const stateMock = {
                    version: '100.0.0',
                    status: models_1.ExtensionStatus.notActivated,
                    welcomeShown: true,
                };
                const getState = sinon
                    .stub(settingsManager, 'getState')
                    .returns(stateMock);
                settingsManager.getSettings();
                chai_1.expect(settingsManager.isNewVersion()).to.be.false;
                chai_1.expect(getState.called).to.be.true;
            });
        });
    });
});
//# sourceMappingURL=settings.test.js.map