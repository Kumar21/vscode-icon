"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable only-arrow-functions
// tslint:disable no-unused-expression
const chai_1 = require("chai");
const fs = require("fs");
const sinon = require("sinon");
const models = require("../../src/models");
const projectAutoDetection_1 = require("../../src/init/projectAutoDetection");
const icon_manifest_1 = require("../../src/icon-manifest");
const languageResourceManager_1 = require("../../src/i18n/languageResourceManager");
describe('AutoDetectProject: tests', function () {
    context('ensures that', function () {
        context('the extension', function () {
            let userConfig;
            beforeEach(() => {
                userConfig = {
                    dontShowNewVersionMessage: false,
                    dontShowConfigManuallyChangedMessage: false,
                    projectDetection: {
                        autoReload: false,
                        disableDetect: false,
                    },
                    presets: {
                        angular: false,
                        jsOfficial: false,
                        tsOfficial: false,
                        jsonOfficial: false,
                        hideFolders: false,
                        foldersAllDefaultIcon: false,
                        hideExplorerArrows: false,
                    },
                    associations: {
                        files: [],
                        folders: [],
                        fileDefault: { file: null, file_light: null },
                        folderDefault: { folder: null, folder_light: null },
                    },
                    customIconFolderPath: '',
                };
            });
            it(`returns a rejection when searching for a 'package.json' fails`, function () {
                const reason = new Error('failure');
                const findFiles = sinon.stub().rejects(reason);
                return projectAutoDetection_1.ProjectAutoDetection.detectProject(findFiles, userConfig).then(null, rej => chai_1.expect(rej)
                    .to.be.an.instanceOf(Error)
                    .and.have.property('message', reason.message));
            });
            // tslint:disable-next-line:max-line-length
            it(`detects a sub project when detection is enabled and has detected a 'package.json' file in a sub folder`, function () {
                const path1 = 'package.json';
                const path2 = 'f1/f2/f3/package.json';
                const findFiles = sinon
                    .stub()
                    .resolves([
                    { fsPath: path1 },
                    { fsPath: path2 },
                ]);
                return projectAutoDetection_1.ProjectAutoDetection.detectProject(findFiles, userConfig).then(res => {
                    chai_1.expect(res)
                        .to.be.an('array')
                        .with.length.greaterThan(0);
                    chai_1.expect(res[0])
                        .to.have.property('fsPath')
                        .that.equals(path1);
                    chai_1.expect(res[1])
                        .to.have.property('fsPath')
                        .that.equals(path2);
                });
            });
            it('does not detect a project when detection is disabled', function () {
                userConfig.projectDetection.disableDetect = true;
                return projectAutoDetection_1.ProjectAutoDetection
                    .detectProject(null, userConfig)
                    .then(res => chai_1.expect(res).to.be.null);
            });
            it('detects an Angular project from dependencies', function () {
                const packageJson = {
                    dependencies: {
                        '@angular/core': '1.0.0',
                    },
                };
                chai_1.expect(projectAutoDetection_1.ProjectAutoDetection.getInfo(packageJson, models.Projects.angular)).to.not.be.null;
            });
            it('detects an Angular project from devDependencies', function () {
                const packageJson = {
                    devDependencies: {
                        '@angular/core': '1.0.0',
                    },
                };
                chai_1.expect(projectAutoDetection_1.ProjectAutoDetection.getInfo(packageJson, models.Projects.angular)).to.not.be.null;
            });
            it('detects a non Angular project from dependencies', function () {
                const packageJson = {
                    dependencies: {
                        vscode: '',
                    },
                };
                chai_1.expect(projectAutoDetection_1.ProjectAutoDetection.getInfo(packageJson, models.Projects.angular)).to.be.null;
            });
            it('detects a non Angular project from devDependencies', function () {
                const packageJson = {
                    devDependencies: {
                        vscode: '',
                    },
                };
                chai_1.expect(projectAutoDetection_1.ProjectAutoDetection.getInfo(packageJson, models.Projects.angular)).to.be.null;
            });
            it('does not detect a project when it does not exist', function () {
                const packageJson = {
                    dependencies: {
                        '@angular/core': '',
                        vscode: '',
                    },
                };
                chai_1.expect(projectAutoDetection_1.ProjectAutoDetection.getInfo(packageJson, models.Projects.angularjs)).to.be.null;
            });
            it('does not detect a project when no project json is provided', function () {
                chai_1.expect(projectAutoDetection_1.ProjectAutoDetection.getInfo(null, null)).to.be.null;
            });
            it('gets the project info version correctly', function () {
                const packageJson = {
                    dependencies: {
                        '@angular/core': '0.0.0',
                    },
                };
                const projectInfo = projectAutoDetection_1.ProjectAutoDetection.getInfo(packageJson, models.Projects.angular);
                chai_1.expect(projectInfo).to.not.be.null;
                chai_1.expect(projectInfo.name).to.equal(models.Projects.angular);
                chai_1.expect(projectInfo.version).to.equal('0.0.0');
            });
            context('gets from search result', function () {
                let sandbox;
                beforeEach(() => {
                    sandbox = sinon.createSandbox();
                });
                afterEach(() => {
                    sandbox.restore();
                });
                it('the project info if it matches', function () {
                    const ver1 = '{ "dependencies": { "@angular/core": "0.0.0" } }';
                    sandbox
                        .stub(fs, 'readFileSync')
                        .returns(ver1);
                    const results = [{ fsPath: '' }];
                    const projectInfo = projectAutoDetection_1.ProjectAutoDetection.getProjectInfo(results, models.Projects.angular);
                    chai_1.expect(projectInfo).to.not.be.null;
                    chai_1.expect(projectInfo.name).to.equal(models.Projects.angular);
                    chai_1.expect(projectInfo.version).to.equal('0.0.0');
                });
                it('no project info if it does not match', function () {
                    const ver2 = '{ "dependencies": { "meteor": "0.0.0" } }';
                    sandbox
                        .stub(fs, 'readFileSync')
                        .returns(ver2);
                    const results = [{ fsPath: '' }];
                    const projectInfo = projectAutoDetection_1.ProjectAutoDetection.getProjectInfo(results, models.Projects.angular);
                    chai_1.expect(projectInfo).to.be.null;
                });
            });
            context('detects that special icons are', function () {
                let sandbox;
                beforeEach(() => {
                    sandbox = sinon.createSandbox();
                });
                afterEach(() => {
                    sandbox.restore();
                });
                it('enabled', function () {
                    const iconManifest = '{ "iconDefinitions": { "_f_ng_": {} } }';
                    sandbox.stub(fs, 'readFileSync').returns(iconManifest);
                    chai_1.expect(icon_manifest_1.ManifestReader.iconsDisabled(models.Projects.angular)).to.be.false;
                });
                it('disabled', function () {
                    const iconManifest = '{ "iconDefinitions": { "_f_codecov": {} } }';
                    sandbox.stub(fs, 'readFileSync').returns(iconManifest);
                    chai_1.expect(icon_manifest_1.ManifestReader.iconsDisabled(models.Projects.angular)).to.be.true;
                });
                it('disabled if they do not exist', function () {
                    const iconManifest = '';
                    sandbox.stub(fs, 'readFileSync').returns(iconManifest);
                    chai_1.expect(icon_manifest_1.ManifestReader.iconsDisabled(models.Projects.angular)).to.be.true;
                });
                it('assumed disabled if icon manifest file fails to be loaded', function () {
                    sandbox.stub(fs, 'readFileSync').throws(Error);
                    chai_1.expect(icon_manifest_1.ManifestReader.iconsDisabled(models.Projects.angular)).to.be.true;
                });
            });
            context('detects that special folder icons are', function () {
                let sandbox;
                beforeEach(() => {
                    sandbox = sinon.createSandbox();
                });
                afterEach(() => {
                    sandbox.restore();
                });
                it('enabled', function () {
                    const iconManifest = '{ "iconDefinitions": { "_fd_aws": {} } }';
                    sandbox.stub(fs, 'readFileSync').returns(iconManifest);
                    chai_1.expect(icon_manifest_1.ManifestReader.iconsDisabled('aws', false)).to.be.false;
                });
                it('disabled', function () {
                    const iconManifest = '{ "iconDefinitions": { "_fd_git": {} } }';
                    sandbox.stub(fs, 'readFileSync').returns(iconManifest);
                    chai_1.expect(icon_manifest_1.ManifestReader.iconsDisabled('aws', false)).to.be.true;
                });
                it('disabled if they do not exist', function () {
                    const iconManifest = '';
                    sandbox.stub(fs, 'readFileSync').returns(iconManifest);
                    chai_1.expect(icon_manifest_1.ManifestReader.iconsDisabled('aws', false)).to.be.true;
                });
                it('assumed disabled if icon manifest file fails to be loaded', function () {
                    sandbox.stub(fs, 'readFileSync').throws(Error);
                    chai_1.expect(icon_manifest_1.ManifestReader.iconsDisabled('aws', false)).to.be.true;
                });
            });
            context('detects that specific folders icons are', function () {
                let sandbox;
                beforeEach(() => {
                    sandbox = sinon.createSandbox();
                });
                afterEach(() => {
                    sandbox.restore();
                });
                it('enabled', function () {
                    const iconManifest = '{ "iconDefinitions": { "_fd_aws": {} } }';
                    const func = sinon.stub().returns(true);
                    sandbox.stub(fs, 'readFileSync').returns(iconManifest);
                    chai_1.expect(icon_manifest_1.ManifestReader.folderIconsDisabled(func)).to.be.false;
                });
                it('disabled', function () {
                    const iconManifest = '{ "iconDefinitions": { "_fd_git": {} } }';
                    const func = sinon.stub().returns(false);
                    sandbox.stub(fs, 'readFileSync').returns(iconManifest);
                    chai_1.expect(icon_manifest_1.ManifestReader.folderIconsDisabled(func)).to.be.true;
                });
                it('disabled if they do not exist', function () {
                    const iconManifest = '';
                    const func = sinon.stub();
                    sandbox.stub(fs, 'readFileSync').returns(iconManifest);
                    chai_1.expect(icon_manifest_1.ManifestReader.folderIconsDisabled(func)).to.be.true;
                });
                it('assumed disabled if icon manifest file fails to be loaded', function () {
                    const func = sinon.stub();
                    sandbox.stub(fs, 'readFileSync').throws(Error);
                    chai_1.expect(icon_manifest_1.ManifestReader.folderIconsDisabled(func)).to.be.true;
                });
            });
            context('detect a project when detection is enabled', function () {
                it(`but it has not detected a 'package.json' file`, function () {
                    const findFiles = sinon.stub().resolves([]);
                    userConfig.projectDetection.disableDetect = false;
                    return projectAutoDetection_1.ProjectAutoDetection.detectProject(findFiles, userConfig).then(res => chai_1.expect(res)
                        .to.be.an('array')
                        .with.lengthOf(0));
                });
                it(`and has detected a 'package.json' file`, function () {
                    const path = 'package.json';
                    const findFiles = sinon
                        .stub()
                        .resolves([{ fsPath: path }]);
                    userConfig.projectDetection.disableDetect = false;
                    return projectAutoDetection_1.ProjectAutoDetection.detectProject(findFiles, userConfig).then(res => {
                        chai_1.expect(res)
                            .to.be.an('array')
                            .with.length.greaterThan(0);
                        chai_1.expect(res[0])
                            .to.have.property('fsPath')
                            .that.equals(path);
                    });
                });
            });
        });
        context('enables the Angular icons when', function () {
            context('Angular icons are disabled and the workspace is', function () {
                context('an Angular project and', function () {
                    it('Angular preset is true', function () {
                        const preset = true;
                        const isNgProject = true;
                        const ngIconsDisabled = true;
                        const i18nManager = sinon.createStubInstance(languageResourceManager_1.LanguageResourceManager);
                        const res = projectAutoDetection_1.ProjectAutoDetection.checkForAngularProject(preset, ngIconsDisabled, isNgProject, i18nManager);
                        chai_1.expect(res).to.have.property('apply').that.is.true;
                        chai_1.expect(res).to.have.property('value').that.is.true;
                    });
                    it('Angular preset is undefined', function () {
                        const preset = undefined;
                        const isNgProject = true;
                        const ngIconsDisabled = true;
                        const i18nManager = sinon.createStubInstance(languageResourceManager_1.LanguageResourceManager);
                        const res = projectAutoDetection_1.ProjectAutoDetection.checkForAngularProject(preset, ngIconsDisabled, isNgProject, i18nManager);
                        chai_1.expect(res).to.have.property('apply').that.is.true;
                        chai_1.expect(res).to.have.property('value').that.is.true;
                    });
                });
                context('not an Angular project and', function () {
                    it('Angular preset is true', function () {
                        const preset = true;
                        const isNgProject = false;
                        const ngIconsDisabled = true;
                        const i18nManager = sinon.createStubInstance(languageResourceManager_1.LanguageResourceManager);
                        const res = projectAutoDetection_1.ProjectAutoDetection.checkForAngularProject(preset, ngIconsDisabled, isNgProject, i18nManager);
                        chai_1.expect(res).to.have.property('apply').that.is.true;
                        chai_1.expect(res).to.have.property('value').that.is.true;
                    });
                });
            });
        });
        context('disables the Angular icons when', function () {
            context('Angular icons are enabled and the workspace is', function () {
                context('not an Angular project and', function () {
                    it('Angular preset is false', function () {
                        const preset = false;
                        const isNgProject = false;
                        const ngIconsDisabled = false;
                        const i18nManager = sinon.createStubInstance(languageResourceManager_1.LanguageResourceManager);
                        const res = projectAutoDetection_1.ProjectAutoDetection.checkForAngularProject(preset, ngIconsDisabled, isNgProject, i18nManager);
                        chai_1.expect(res).to.have.property('apply').that.is.true;
                        chai_1.expect(res).to.have.property('value').that.is.false;
                    });
                    it('Angular preset is undefined', function () {
                        const preset = undefined;
                        const isNgProject = false;
                        const ngIconsDisabled = false;
                        const i18nManager = sinon.createStubInstance(languageResourceManager_1.LanguageResourceManager);
                        const res = projectAutoDetection_1.ProjectAutoDetection.checkForAngularProject(preset, ngIconsDisabled, isNgProject, i18nManager);
                        chai_1.expect(res).to.have.property('apply').that.is.true;
                        chai_1.expect(res).to.have.property('value').that.is.false;
                    });
                });
                context('an Angular project and', function () {
                    it('Angular preset is false', function () {
                        const preset = false;
                        const isNgProject = true;
                        const ngIconsDisabled = false;
                        const i18nManager = sinon.createStubInstance(languageResourceManager_1.LanguageResourceManager);
                        const res = projectAutoDetection_1.ProjectAutoDetection.checkForAngularProject(preset, ngIconsDisabled, isNgProject, i18nManager);
                        chai_1.expect(res).to.have.property('apply').that.is.true;
                        chai_1.expect(res).to.have.property('value').that.is.false;
                    });
                });
            });
        });
        context('does not toggle the Angular icons when', function () {
            context('Angular icons are enabled and the workspace is', function () {
                context('an Angular project and', function () {
                    it('Angular preset is true', function () {
                        const preset = true;
                        const isNgProject = true;
                        const ngIconsDisabled = false;
                        const res = projectAutoDetection_1.ProjectAutoDetection.checkForAngularProject(preset, ngIconsDisabled, isNgProject, undefined);
                        chai_1.expect(res).to.have.property('apply').that.is.false;
                    });
                    it('Angular preset is undefined', function () {
                        const preset = undefined;
                        const isNgProject = true;
                        const ngIconsDisabled = false;
                        const res = projectAutoDetection_1.ProjectAutoDetection.checkForAngularProject(preset, ngIconsDisabled, isNgProject, undefined);
                        chai_1.expect(res).to.have.property('apply').that.is.false;
                    });
                });
                context('not an Angular project and', function () {
                    it('Angular preset is true', function () {
                        const preset = true;
                        const isNgProject = false;
                        const ngIconsDisabled = false;
                        const res = projectAutoDetection_1.ProjectAutoDetection.checkForAngularProject(preset, ngIconsDisabled, isNgProject, undefined);
                        chai_1.expect(res).to.have.property('apply').that.is.false;
                    });
                });
                context('Angular icons are disabled and the workspace is', function () {
                    context('not an Angular project and', function () {
                        it('Angular preset is false', function () {
                            const preset = false;
                            const isNgProject = false;
                            const ngIconsDisabled = true;
                            const res = projectAutoDetection_1.ProjectAutoDetection.checkForAngularProject(preset, ngIconsDisabled, isNgProject, undefined);
                            chai_1.expect(res).to.have.property('apply').that.is.false;
                        });
                        it('Angular preset is undefined', function () {
                            const preset = undefined;
                            const isNgProject = false;
                            const ngIconsDisabled = true;
                            const res = projectAutoDetection_1.ProjectAutoDetection.checkForAngularProject(preset, ngIconsDisabled, isNgProject, undefined);
                            chai_1.expect(res).to.have.property('apply').that.is.false;
                        });
                        context('an Angular project and', function () {
                            it('Angular preset is false', function () {
                                const preset = false;
                                const isNgProject = true;
                                const ngIconsDisabled = true;
                                const res = projectAutoDetection_1.ProjectAutoDetection.checkForAngularProject(preset, ngIconsDisabled, isNgProject, undefined);
                                chai_1.expect(res).to.have.property('apply').that.is.false;
                            });
                        });
                    });
                });
            });
        });
        context('when user has selected', function () {
            it('to auto restart, applies the changes and restarts', function () {
                const autoReload = true;
                const applyCustomizationFn = sinon.spy();
                const reloadFn = sinon.spy();
                const showCustomizationMessageFn = sinon.spy();
                return projectAutoDetection_1.ProjectAutoDetection
                    .applyDetection(undefined, undefined, autoReload, applyCustomizationFn, showCustomizationMessageFn, reloadFn)
                    .then(() => {
                    chai_1.expect(applyCustomizationFn.called).to.be.true;
                    chai_1.expect(reloadFn.called).to.be.true;
                    chai_1.expect(showCustomizationMessageFn.called).to.be.false;
                });
            });
            it('not to auto restart, shows the customization message', function () {
                const autoReload = false;
                const applyCustomizationFn = sinon.spy();
                const projectDetectionResult = {
                    apply: undefined,
                    message: undefined,
                    value: undefined,
                };
                const reloadFn = sinon.spy();
                const showCustomizationMessageFn = sinon.spy();
                const i18nManager = sinon.createStubInstance(languageResourceManager_1.LanguageResourceManager);
                return projectAutoDetection_1.ProjectAutoDetection
                    .applyDetection(i18nManager, projectDetectionResult, autoReload, applyCustomizationFn, showCustomizationMessageFn, reloadFn)
                    .then(() => {
                    chai_1.expect(applyCustomizationFn.called).to.be.false;
                    chai_1.expect(reloadFn.called).to.be.false;
                    chai_1.expect(showCustomizationMessageFn.called).to.be.true;
                });
            });
        });
    });
});
//# sourceMappingURL=projectAutoDetection.test.js.map