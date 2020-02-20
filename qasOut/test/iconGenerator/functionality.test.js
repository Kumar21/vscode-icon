"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable only-arrow-functions
// tslint:disable no-unused-expression
const chai_1 = require("chai");
const fs = require("fs");
const sinon = require("sinon");
const icon_manifest_1 = require("../../src/icon-manifest");
const utils = require("../../src/utils");
const settings_1 = require("../../src/settings");
const supportedFolders_1 = require("../support/supportedFolders");
const packageJson = require("../../../package.json");
describe('IconGenerator: functionality test', function () {
    context('ensures that', function () {
        let iconGenerator;
        let emptyFileCollection;
        let emptyFolderCollection;
        beforeEach(() => {
            iconGenerator = new icon_manifest_1.IconGenerator(utils.vscode, icon_manifest_1.schema);
            emptyFileCollection = {
                default: { file: { icon: 'file', format: 'svg' } },
                supported: [],
            };
            emptyFolderCollection = {
                default: { folder: { icon: 'folder', format: 'svg' } },
                supported: [],
            };
        });
        afterEach(() => {
            iconGenerator = null;
        });
        it('disabled file extensions are not included into the manifest', function () {
            const custom = emptyFileCollection;
            custom.supported.push({
                icon: 'actionscript',
                extensions: [],
                disabled: true,
                format: 'svg',
            });
            const json = iconGenerator.generateJson(custom, emptyFolderCollection);
            const extendedPath = json.iconDefinitions['_f_actionscript'];
            chai_1.expect(extendedPath).not.to.exist;
        });
        it('disabled folder extensions are not included into the manifest', function () {
            const custom = emptyFolderCollection;
            custom.supported.push({
                icon: 'aws',
                extensions: ['aws'],
                disabled: true,
                format: 'svg',
            });
            const json = iconGenerator.generateJson(emptyFileCollection, custom);
            const extendedPath = json.iconDefinitions['_fd_aws'];
            chai_1.expect(extendedPath).not.to.exist;
        });
        it('default file icon paths are always defined when disabled', function () {
            const custom = emptyFileCollection;
            custom.default.file.disabled = true;
            const json = iconGenerator.generateJson(custom, emptyFolderCollection);
            const ext = json.iconDefinitions._file;
            chai_1.expect(ext).to.exist;
            chai_1.expect(ext.iconPath).to.exist;
            chai_1.expect(ext.iconPath).to.be.empty;
        });
        it('default folder icon paths are always defined when disabled', function () {
            const custom = emptyFolderCollection;
            custom.default.folder.disabled = true;
            const json = iconGenerator.generateJson(emptyFileCollection, custom);
            const ext = json.iconDefinitions._folder;
            chai_1.expect(ext).to.exist;
            chai_1.expect(ext.iconPath).to.exist;
            chai_1.expect(ext.iconPath).to.be.empty;
        });
        it('file extensions are not included into the manifest when no icon is provided', function () {
            const custom = emptyFileCollection;
            custom.supported.push({ icon: '', extensions: ['as'], format: 'svg' });
            const json = iconGenerator.generateJson(custom, emptyFolderCollection);
            const ext = json.iconDefinitions[settings_1.extensionSettings.manifestFilePrefix];
            chai_1.expect(ext).not.to.exist;
        });
        it('folder extensions are not included into the manifest when no icon is provided', function () {
            const custom = emptyFolderCollection;
            custom.supported.push({ icon: '', extensions: ['aws'], format: 'svg' });
            const json = iconGenerator.generateJson(emptyFileCollection, custom);
            const ext = json.iconDefinitions[settings_1.extensionSettings.manifestFolderPrefix];
            chai_1.expect(ext).not.to.exist;
        });
        it('new file extensions are included into the manifest', function () {
            const custom = emptyFileCollection;
            custom.supported.push({
                icon: 'actionscript',
                extensions: ['as'],
                format: 'svg',
            });
            const json = iconGenerator.generateJson(custom, emptyFolderCollection);
            const def = `${settings_1.extensionSettings.manifestFilePrefix}actionscript`;
            const ext = json.iconDefinitions[def];
            chai_1.expect(ext).to.exist;
            chai_1.expect(ext.iconPath).not.to.be.empty;
            chai_1.expect(json.fileExtensions['as']).to.be.equal(def);
        });
        it('new folder extensions are included into the manifest', function () {
            const custom = emptyFolderCollection;
            custom.supported.push({
                icon: 'aws',
                extensions: ['aws'],
                format: 'svg',
            });
            const json = iconGenerator.generateJson(emptyFileCollection, custom);
            const def = `${settings_1.extensionSettings.manifestFolderPrefix}aws`;
            const ext = json.iconDefinitions[def];
            chai_1.expect(ext).to.exist;
            chai_1.expect(ext.iconPath).not.to.be.empty;
            chai_1.expect(json.folderNames['aws']).to.be.equal(def);
            chai_1.expect(json.folderNamesExpanded['aws']).to.be.equal(`${def}_open`);
        });
        it('filenames extensions are included into the manifest', function () {
            const custom = emptyFileCollection;
            custom.supported.push({
                icon: 'webpack',
                extensions: ['webpack.config.js'],
                filename: true,
                format: 'svg',
            });
            const json = iconGenerator.generateJson(custom, emptyFolderCollection);
            const def = `${settings_1.extensionSettings.manifestFilePrefix}webpack`;
            const ext = json.iconDefinitions[def];
            chai_1.expect(ext).to.exist;
            chai_1.expect(ext.iconPath).not.to.be.empty;
            chai_1.expect(json.fileNames['webpack.config.js']).to.be.equal(def);
        });
        it('languageIds extensions are included into the manifest', function () {
            const custom = emptyFileCollection;
            custom.supported.push({
                icon: 'c',
                extensions: [],
                languages: [{ ids: 'c', defaultExtension: 'c' }],
                format: 'svg',
            });
            const json = iconGenerator.generateJson(custom, emptyFolderCollection);
            const def = `${settings_1.extensionSettings.manifestFilePrefix}c`;
            const ext = json.iconDefinitions[def];
            chai_1.expect(ext).to.exist;
            chai_1.expect(ext.iconPath).not.to.be.empty;
            chai_1.expect(json.languageIds['c']).to.be.equal(def);
        });
        it('icon paths are always using Unix style', function () {
            const custom = emptyFileCollection;
            custom.supported.push({
                icon: 'c',
                extensions: ['c'],
                format: 'svg',
            });
            const json = iconGenerator.generateJson(custom, emptyFolderCollection);
            const def = `${settings_1.extensionSettings.manifestFilePrefix}c`;
            const ext = json.iconDefinitions[def];
            chai_1.expect(ext).to.exist;
            chai_1.expect(ext.iconPath).not.to.be.empty;
            chai_1.expect(ext.iconPath).not.contain('\\');
        });
        it('extensions always use the iconSuffix', function () {
            const custom = emptyFileCollection;
            custom.supported.push({ icon: 'c', extensions: ['c'], format: 'svg' });
            const json = iconGenerator.generateJson(custom, emptyFolderCollection);
            const def = `${settings_1.extensionSettings.manifestFilePrefix}c`;
            const ext = json.iconDefinitions[def];
            chai_1.expect(ext).to.exist;
            chai_1.expect(ext.iconPath).not.to.be.empty;
            chai_1.expect(ext.iconPath).contains(settings_1.extensionSettings.iconSuffix);
        });
        it('default always use the iconSuffix', function () {
            const custom = emptyFileCollection;
            const json = iconGenerator.generateJson(custom, emptyFolderCollection);
            const ext = json.iconDefinitions._file;
            chai_1.expect(ext).to.exist;
            chai_1.expect(ext.iconPath).not.to.be.empty;
            chai_1.expect(ext.iconPath).contains(settings_1.extensionSettings.iconSuffix);
        });
        context('persisting the icon-manifest', function () {
            let sandbox;
            beforeEach(() => {
                sandbox = sinon.createSandbox();
            });
            afterEach(() => {
                sandbox.restore();
            });
            it('throws an Error if the icons filename is not provided', function () {
                chai_1.expect(iconGenerator.persist.bind(iconGenerator, null, icon_manifest_1.schema)).to.throw(Error, /iconsFilename not defined./);
            });
            it(`calls the 'updatePackageJson' function when said to`, function () {
                sandbox.stub(utils, 'getRelativePath').returns('.');
                const writeJsonToFile = sandbox.stub(iconGenerator, 'writeJsonToFile');
                const updatePackageJson = sandbox.stub(iconGenerator, 'updatePackageJson');
                iconGenerator.persist('path/to/file', icon_manifest_1.schema, true);
                chai_1.expect(writeJsonToFile.called).to.be.true;
                chai_1.expect(updatePackageJson.called).to.be.true;
            });
            it(`doesn't call the 'updatePackageJson' function when said not to`, function () {
                const writeJsonToFile = sandbox.stub(iconGenerator, 'writeJsonToFile');
                const updatePackageJson = sandbox.stub(iconGenerator, 'updatePackageJson');
                iconGenerator.persist('path/to/file', icon_manifest_1.schema);
                chai_1.expect(writeJsonToFile.called).to.be.true;
                chai_1.expect(updatePackageJson.called).to.be.false;
            });
            context(`function 'updatePackageJson'`, function () {
                it('logs an error if something goes wrong', function () {
                    sandbox.stub(utils, 'getRelativePath').returns('.');
                    sandbox.stub(iconGenerator, 'writeJsonToFile');
                    sandbox.stub(fs, 'writeFileSync').throws(new Error());
                    const errorLog = sandbox.stub(console, 'error');
                    packageJson.contributes.iconThemes[0].path = 'path/to/icons.json';
                    iconGenerator.persist('path/to/file', icon_manifest_1.schema, true);
                    chai_1.expect(errorLog.called).to.be.true;
                });
                context(`updates the icon theme path in the 'package.json' file`, function () {
                    it('if the icons folder path has changed', function () {
                        sandbox.stub(utils, 'getRelativePath').returns('.');
                        const writeJsonToFile = sandbox.stub(iconGenerator, 'writeJsonToFile');
                        const writeFileSync = sandbox.stub(fs, 'writeFileSync');
                        sandbox.stub(console, 'info');
                        packageJson.contributes.iconThemes[0].path = 'path/to/icons.json';
                        iconGenerator.persist('path/to/file', icon_manifest_1.schema, true);
                        chai_1.expect(writeJsonToFile.called).to.be.true;
                        chai_1.expect(writeFileSync.called).to.be.true;
                    });
                });
                context(`does not update the icon theme path in the 'package.json' file`, function () {
                    it('if the icons folder path has not changed', function () {
                        sandbox.stub(utils, 'getRelativePath').returns('.');
                        const writeJsonToFile = sandbox.stub(iconGenerator, 'writeJsonToFile');
                        const writeFileSync = sandbox.stub(fs, 'writeFileSync');
                        sandbox.stub(console, 'info');
                        iconGenerator.persist('path/to/file', icon_manifest_1.schema, true);
                        chai_1.expect(writeJsonToFile.called).to.be.true;
                        chai_1.expect(writeFileSync.called).to.be.false;
                    });
                    it('if the icons theme path does not exists', function () {
                        sandbox.stub(utils, 'getRelativePath').returns('.');
                        const writeJsonToFile = sandbox.stub(iconGenerator, 'writeJsonToFile');
                        const writeFileSync = sandbox.stub(fs, 'writeFileSync');
                        sandbox.stub(console, 'info');
                        packageJson.contributes.iconThemes[0].path = '';
                        iconGenerator.persist('path/to/file', icon_manifest_1.schema, true);
                        chai_1.expect(writeJsonToFile.called).to.be.true;
                        chai_1.expect(writeFileSync.called).to.be.false;
                    });
                });
            });
            context('writes the icon-manifest to a file by', function () {
                it('creating the directory if it does not exist', function () {
                    const existsSync = sandbox.stub(fs, 'existsSync').returns(false);
                    const mkdirSync = sandbox.stub(fs, 'mkdirSync');
                    const writeFileSync = sandbox.stub(fs, 'writeFileSync');
                    sandbox.stub(console, 'info');
                    iconGenerator.persist('path/to/file', icon_manifest_1.schema);
                    chai_1.expect(existsSync.called).to.be.true;
                    chai_1.expect(mkdirSync.called).to.be.true;
                    chai_1.expect(writeFileSync.called).to.be.true;
                });
                it('not creating the directory if it exists', function () {
                    const existsSync = sandbox.stub(fs, 'existsSync').returns(true);
                    const mkdirSync = sandbox.stub(fs, 'mkdirSync');
                    const writeFileSync = sandbox.stub(fs, 'writeFileSync');
                    sandbox.stub(console, 'info');
                    iconGenerator.persist('path/to/file', icon_manifest_1.schema);
                    chai_1.expect(existsSync.called).to.be.true;
                    chai_1.expect(mkdirSync.called).to.be.false;
                    chai_1.expect(writeFileSync.called).to.be.true;
                });
                it('logs an error if something goes wrong', function () {
                    sandbox.stub(fs, 'writeFileSync').throws(new Error());
                    const errorLog = sandbox.stub(console, 'error');
                    iconGenerator.persist('path/to/file', icon_manifest_1.schema);
                    chai_1.expect(errorLog.called).to.be.true;
                });
            });
        });
        context('generating the icon-manifest object', function () {
            it('throws an Error if the paths for the folder and open folder icons do not match', function () {
                sinon
                    .stub(iconGenerator, 'getIconPath')
                    .callsFake((filename) => /opened/g.test(filename) ? '' : iconGenerator.iconsFolderBasePath);
                chai_1.expect(iconGenerator.generateJson.bind(iconGenerator, emptyFileCollection, supportedFolders_1.extensions)).to.throw(Error, /Folder icons for '.*' must be placed in the same directory/);
            });
            it('uses the app data path when no custom icon folder path is specified', function () {
                const folderPath = undefined;
                const customIconFolderPath = iconGenerator.getCustomIconFolderPath(folderPath);
                chai_1.expect(customIconFolderPath).to.be.equal(iconGenerator.settings.vscodeAppUserPath);
            });
            it('uses the provided path when a custom icon folder absolute path is specified', function () {
                const folderPath = '/custom/folder/path';
                const customIconFolderPath = iconGenerator.getCustomIconFolderPath(folderPath);
                chai_1.expect(customIconFolderPath).to.be.equal(folderPath);
            });
            it('uses the resolved absolute path from the root of the project ' +
                'when a relative custom icon folder path is specified', function () {
                const sandbox = sinon.createSandbox();
                sandbox.stub(fs, 'existsSync').returns(true);
                iconGenerator.settings.workspacePath = ['/workspace/path'];
                const folderPath = './custom/folder/path';
                const customIconFolderPath = iconGenerator.getCustomIconFolderPath(folderPath);
                const joinedPath = utils.pathUnixJoin(iconGenerator.settings.workspacePath[0], folderPath);
                chai_1.expect(customIconFolderPath).to.be.equal(joinedPath);
                sandbox.restore();
            });
            const testCase = (belongToSameDrive) => {
                const sandbox = sinon.createSandbox();
                sinon.stub(iconGenerator, 'hasCustomIcon').returns(true);
                sandbox.stub(utils, 'belongToSameDrive').returns(belongToSameDrive);
                const json = iconGenerator.generateJson(emptyFileCollection, emptyFolderCollection);
                chai_1.expect(json.iconDefinitions._file.iconPath).to.include(iconGenerator.settings.extensionSettings.customIconFolderName);
                chai_1.expect(json.iconDefinitions._folder.iconPath).to.include(iconGenerator.settings.extensionSettings.customIconFolderName);
                chai_1.expect(json.iconDefinitions._folder_open.iconPath).to.include(iconGenerator.settings.extensionSettings.customIconFolderName);
                sandbox.restore();
            };
            it('uses the manifestFolderPath when custom icons folder is on the same drive', function () {
                testCase(true);
            });
            it('calls the overwriteDrive when custom icons folder is not on the same drive', function () {
                testCase(false);
            });
        });
    });
});
//# sourceMappingURL=functionality.test.js.map