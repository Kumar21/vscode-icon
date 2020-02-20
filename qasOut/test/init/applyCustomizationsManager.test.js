"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable only-arrow-functions
// tslint:disable no-unused-expression
const chai_1 = require("chai");
const sinon = require("sinon");
const applyCustomizationsManager_1 = require("../../src/init/applyCustomizationsManager");
describe('AutoApplyCustomizations: tests', function () {
    context('ensures that', function () {
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
        context('if the extension has been updated', function () {
            it('but there are no changes in package.json the callback will not be called', function () {
                const spy = sinon.spy();
                applyCustomizationsManager_1.manageAutoApplyCustomizations(true, userConfig, spy);
                chai_1.expect(spy.called).to.not.be.true;
            });
            it('and there are changes in package.json the callback will be called', function () {
                const spy = sinon.spy();
                userConfig.presets.angular = true;
                applyCustomizationsManager_1.manageAutoApplyCustomizations(true, userConfig, spy);
                chai_1.expect(spy.called).to.be.true;
            });
        });
        it('if the extension has not been updated the callback will not be called', function () {
            const spy = sinon.spy();
            applyCustomizationsManager_1.manageAutoApplyCustomizations(false, userConfig, spy);
            chai_1.expect(spy.called).to.not.be.true;
        });
        it('changes in array are detected', function () {
            const spy = sinon.spy();
            userConfig.associations.files = [
                { icon: 'dummy', format: 'svg', extensions: ['dummy'] },
            ];
            applyCustomizationsManager_1.manageAutoApplyCustomizations(true, userConfig, spy);
            chai_1.expect(spy.called).to.be.true;
        });
    });
});
describe('ApplyCustomizations: tests', function () {
    context('ensures that', function () {
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
        it('if the configuration has been manually changed, the callback will be called', function () {
            const spy = sinon.spy();
            const initConfig = JSON.parse(JSON.stringify(userConfig));
            userConfig.presets.tsOfficial = true;
            applyCustomizationsManager_1.manageApplyCustomizations(initConfig, userConfig, spy);
            chai_1.expect(spy.called).to.be.true;
        });
        it('if the configuration has not been manually changed, the callback will not be called', function () {
            const spy = sinon.spy();
            const initConfig = JSON.parse(JSON.stringify(userConfig));
            userConfig.presets.tsOfficial = false;
            applyCustomizationsManager_1.manageApplyCustomizations(initConfig, userConfig, spy);
            chai_1.expect(spy.called).to.not.be.true;
        });
        it('if the configuration has only moved its elements, the callback will not be called', function () {
            const spy = sinon.spy();
            userConfig.associations.files = [
                {
                    icon: 'js',
                    extensions: ['myExt1', 'myExt2.custom.js'],
                    format: 'svg',
                },
                {
                    icon: 'js2',
                    extensions: ['myExt1', 'myExt2.custom.js'],
                    format: 'svg',
                },
            ];
            const initConfig = JSON.parse(JSON.stringify(userConfig));
            userConfig.associations.files.reverse();
            applyCustomizationsManager_1.manageApplyCustomizations(initConfig, userConfig, spy);
            chai_1.expect(spy.called).to.not.be.true;
        });
        it('if the user disables the showing of the manually changed configuration message, ' +
            'the callback will not be called', function () {
            const spy = sinon.spy();
            const initConfig = JSON.parse(JSON.stringify(userConfig));
            userConfig.dontShowConfigManuallyChangedMessage = true;
            applyCustomizationsManager_1.manageApplyCustomizations(initConfig, userConfig, spy);
            chai_1.expect(spy.called).to.not.be.true;
        });
    });
});
//# sourceMappingURL=applyCustomizationsManager.test.js.map