"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable only-arrow-functions
// tslint:disable no-unused-expression
const chai_1 = require("chai");
const helper = require("../../src/commands/helper");
const models_1 = require("../../src/models");
describe('Helper: tests', function () {
    context('ensures that', function () {
        it(`function 'isFoldersRelated' returns proper state`, function () {
            chai_1.expect(helper.isFoldersRelated(models_1.PresetNames.hideFolders)).to.be.true;
            chai_1.expect(helper.isFoldersRelated(models_1.PresetNames.jsOfficial)).to.be.false;
        });
        it(`function 'isNonIconsRelatedPreset' returns proper state`, function () {
            chai_1.expect(helper.isNonIconsRelatedPreset(models_1.PresetNames.hideExplorerArrows)).to.be.true;
            chai_1.expect(helper.isNonIconsRelatedPreset(models_1.PresetNames.jsOfficial)).to.be.false;
        });
        context(`function 'getIconName'`, function () {
            it('throws an Error if a preset is not covered', function () {
                chai_1.expect(helper.getIconName.bind(helper)).to.throw(Error, /Not Implemented/);
            });
            it('returns expected values', function () {
                chai_1.expect(helper.getIconName(models_1.PresetNames[models_1.PresetNames.angular])).to.be.equal(models_1.IconNames.angular);
                chai_1.expect(helper.getIconName(models_1.PresetNames[models_1.PresetNames.jsOfficial])).to.be.equal(models_1.IconNames.jsOfficial);
                chai_1.expect(helper.getIconName(models_1.PresetNames[models_1.PresetNames.tsOfficial])).to.be.equal(models_1.IconNames.tsOfficial);
                chai_1.expect(helper.getIconName(models_1.PresetNames[models_1.PresetNames.jsonOfficial])).to.be.equal(models_1.IconNames.jsonOfficial);
            });
        });
        context(`function 'getFunc'`, function () {
            let iconsJson;
            beforeEach(() => {
                iconsJson = {
                    iconDefinitions: {
                        _file: { iconPath: '' },
                        _folder: { iconPath: '' },
                        _folder_open: { iconPath: '' },
                        _root_folder: { iconPath: '' },
                        _root_folder_open: { iconPath: '' },
                        _file_light: { iconPath: '' },
                        _folder_light: { iconPath: '' },
                        _folder_light_open: { iconPath: '' },
                        _root_folder_light: { iconPath: '' },
                        _root_folder_light_open: { iconPath: '' },
                    },
                    file: '',
                    folder: '',
                    folderExpanded: '',
                    rootFolder: '',
                    rootFolderExpanded: '',
                    folderNames: {},
                    folderNamesExpanded: {},
                    fileExtensions: {},
                    fileNames: {},
                    languageIds: {},
                    light: {
                        file: '',
                        folder: '',
                        folderExpanded: '',
                        rootFolder: '',
                        rootFolderExpanded: '',
                        folderNames: {},
                        folderNamesExpanded: {},
                        fileExtensions: {},
                        fileNames: {},
                        languageIds: {},
                    },
                };
            });
            it('throws an Error if a preset is not covered', function () {
                chai_1.expect(helper.getFunc.bind(helper, models_1.PresetNames[models_1.PresetNames.jsOfficial])).to.throw(Error, /Not Implemented/);
            });
            it(`return 'true' when folder icons are hidden`, function () {
                const func = helper.getFunc(models_1.PresetNames[models_1.PresetNames.hideFolders]);
                chai_1.expect(func).to.be.instanceof(Function);
                chai_1.expect(func(iconsJson)).to.be.true;
            });
            it(`return 'false' when folder icons are visible`, function () {
                iconsJson.folderNames = { _fd_folderName: '' };
                const func = helper.getFunc(models_1.PresetNames[models_1.PresetNames.hideFolders]);
                chai_1.expect(func).to.be.instanceof(Function);
                chai_1.expect(func(iconsJson)).to.be.false;
            });
            it(`return 'true' when specific folder icons are disabled`, function () {
                iconsJson.iconDefinitions._folder.iconPath = 'pathToDefaultFolderIcon';
                const func = helper.getFunc(models_1.PresetNames[models_1.PresetNames.foldersAllDefaultIcon]);
                chai_1.expect(func).to.be.instanceof(Function);
                chai_1.expect(func(iconsJson)).to.be.true;
            });
            it(`return 'false' when specific folder icons are enabled`, function () {
                iconsJson.folderNames = { _fd_folderName: '' };
                iconsJson.iconDefinitions._folder.iconPath = 'pathToDefaultFolderIcon';
                const func = helper.getFunc(models_1.PresetNames[models_1.PresetNames.foldersAllDefaultIcon]);
                chai_1.expect(func).to.be.instanceof(Function);
                chai_1.expect(func(iconsJson)).to.be.false;
            });
        });
    });
});
//# sourceMappingURL=helper.test.js.map