"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable only-arrow-functions
// tslint:disable no-unused-expression
const fs = require("fs");
const path = require("path");
const chai_1 = require("chai");
const icon_manifest_1 = require("../../src/icon-manifest");
const supportedFolders_1 = require("../../src/icon-manifest/supportedFolders");
const models_1 = require("../../src/models");
const utils_1 = require("../../src/utils");
const settings_1 = require("../../src/settings");
describe('IconGenerator: folders icon generation test', function () {
    context('ensures that', function () {
        let emptyFileCollection;
        beforeEach(() => {
            emptyFileCollection = {
                default: { file: { icon: 'file', format: 'svg' } },
                supported: [],
            };
        });
        context('default', function () {
            let schema;
            beforeEach(() => {
                schema = new icon_manifest_1.IconGenerator(utils_1.vscode, icon_manifest_1.schema).generateJson(emptyFileCollection, supportedFolders_1.extensions);
            });
            afterEach(() => {
                schema = null;
            });
            it('folder has an icon path', function () {
                chai_1.expect(schema.iconDefinitions._folder.iconPath).not.to.be.empty;
            });
            it('folder has an open icon path', function () {
                chai_1.expect(schema.iconDefinitions._folder_open.iconPath).not.to.be.equal('');
            });
            it('root folder has an icon path', function () {
                chai_1.expect(schema.iconDefinitions._root_folder.iconPath).not.to.be.empty;
            });
            it('root folder has an open icon path', function () {
                chai_1.expect(schema.iconDefinitions._root_folder_open.iconPath).not.to.be.equal('');
            });
            context(`if a default 'light' icon is NOT defined`, function () {
                context('each supported', function () {
                    const iconsFolderPath = path.join(__dirname, '../../../icons');
                    context('folder', function () {
                        it('has an associated icon file', function () {
                            supportedFolders_1.extensions.supported.forEach(folder => {
                                const filename = `${settings_1.extensionSettings.folderPrefix}${folder.icon}${settings_1.extensionSettings.iconSuffix}.${models_1.FileFormat[folder.format]}`;
                                const iconFilePath = path.join(iconsFolderPath, filename);
                                chai_1.expect(fs.existsSync(iconFilePath)).to.be.true;
                            });
                        });
                        it('has an associated opened icon file', function () {
                            supportedFolders_1.extensions.supported.forEach(folder => {
                                const filename = `${settings_1.extensionSettings.folderPrefix}${folder.icon}_opened` +
                                    `${settings_1.extensionSettings.iconSuffix}.${models_1.FileFormat[folder.format]}`;
                                const iconFilePath = path.join(iconsFolderPath, filename);
                                chai_1.expect(fs.existsSync(iconFilePath)).to.be.true;
                            });
                        });
                        it('has a definition', function () {
                            supportedFolders_1.extensions.supported
                                .filter(folder => !folder.disabled)
                                .forEach(folder => {
                                const definition = `${settings_1.extensionSettings.manifestFolderPrefix}${folder.icon}`;
                                chai_1.expect(schema.iconDefinitions[definition]).exist;
                            });
                        });
                        it('has an open definition', function () {
                            supportedFolders_1.extensions.supported
                                .filter(folder => !folder.disabled)
                                .forEach(folder => {
                                const definition = `${settings_1.extensionSettings.manifestFolderPrefix}${folder.icon}_open`;
                                chai_1.expect(schema.iconDefinitions[definition]).exist;
                            });
                        });
                        it('has an icon path', function () {
                            supportedFolders_1.extensions.supported
                                .filter(folder => !folder.disabled)
                                .forEach(folder => {
                                const definition = `${settings_1.extensionSettings.manifestFolderPrefix}${folder.icon}`;
                                chai_1.expect(schema.iconDefinitions[definition].iconPath).not.to.be.equal('');
                            });
                        });
                        it('has an open icon path', function () {
                            supportedFolders_1.extensions.supported
                                .filter(folder => !folder.disabled)
                                .forEach(folder => {
                                const definition = `${settings_1.extensionSettings.manifestFolderPrefix}${folder.icon}_open`;
                                chai_1.expect(schema.iconDefinitions[definition].iconPath).not.to.be.equal('');
                            });
                        });
                        it('has a folder name expanded referencing its definition', function () {
                            supportedFolders_1.extensions.supported
                                .filter(folder => !folder.disabled)
                                .forEach(folder => {
                                const definition = `${settings_1.extensionSettings.manifestFolderPrefix}${folder.icon}_open`;
                                folder.extensions.forEach(extension => chai_1.expect(schema.folderNamesExpanded[extension]).equal(definition));
                            });
                        });
                        it('has a folder name referencing its definition', function () {
                            supportedFolders_1.extensions.supported
                                .filter(folder => !folder.disabled)
                                .forEach(folder => {
                                const definition = `${settings_1.extensionSettings.manifestFolderPrefix}${folder.icon}`;
                                folder.extensions.forEach(extension => chai_1.expect(schema.folderNames[extension]).equals(definition));
                            });
                        });
                        context('that has a light theme version', function () {
                            it('has an associated icon file', function () {
                                supportedFolders_1.extensions.supported
                                    .filter(folder => folder.light)
                                    .forEach(folder => {
                                    const filename = `${settings_1.extensionSettings.folderLightPrefix}${folder.icon}` +
                                        `${settings_1.extensionSettings.iconSuffix}.${models_1.FileFormat[folder.format]}`;
                                    const iconFilePath = path.join(iconsFolderPath, filename);
                                    chai_1.expect(fs.existsSync(iconFilePath)).to.be.true;
                                });
                            });
                            it('has an associated opened icon file', function () {
                                supportedFolders_1.extensions.supported
                                    .filter(folder => folder.light)
                                    .forEach(folder => {
                                    const filename = `${settings_1.extensionSettings.folderLightPrefix}${folder.icon}` +
                                        `_opened${settings_1.extensionSettings.iconSuffix}.${models_1.FileFormat[folder.format]}`;
                                    const iconFilePath = path.join(iconsFolderPath, filename);
                                    chai_1.expect(fs.existsSync(iconFilePath)).to.be.true;
                                });
                            });
                            it(`has a 'light' definition`, function () {
                                supportedFolders_1.extensions.supported
                                    .filter(folder => folder.light && !folder.disabled)
                                    .forEach(folder => {
                                    const definition = `${settings_1.extensionSettings.manifestFolderLightPrefix}${folder.icon}`;
                                    chai_1.expect(schema.iconDefinitions[definition]).exist;
                                });
                            });
                            it(`has a open 'light' definition`, function () {
                                supportedFolders_1.extensions.supported
                                    .filter(folder => folder.light && !folder.disabled)
                                    .forEach(folder => {
                                    const definition = `${settings_1.extensionSettings.manifestFolderLightPrefix}${folder.icon}_open`;
                                    chai_1.expect(schema.iconDefinitions[definition]).exist;
                                });
                            });
                            it('has an icon path', function () {
                                supportedFolders_1.extensions.supported
                                    .filter(folder => folder.light && !folder.disabled)
                                    .forEach(folder => {
                                    const definition = `${settings_1.extensionSettings.manifestFolderLightPrefix}${folder.icon}`;
                                    chai_1.expect(schema.iconDefinitions[definition].iconPath).not.to.be.equal('');
                                });
                            });
                            it('has an open icon path', function () {
                                supportedFolders_1.extensions.supported
                                    .filter(folder => folder.light && !folder.disabled)
                                    .forEach(folder => {
                                    const definition = `${settings_1.extensionSettings.manifestFolderLightPrefix}${folder.icon}_open`;
                                    chai_1.expect(schema.iconDefinitions[definition].iconPath).not.to.be.equal('');
                                });
                            });
                            it(`has a folder name referencing its 'light' definition`, function () {
                                supportedFolders_1.extensions.supported
                                    .filter(folder => folder.light && !folder.disabled)
                                    .forEach(folder => {
                                    const definition = `${settings_1.extensionSettings.manifestFolderLightPrefix}${folder.icon}`;
                                    folder.extensions.forEach(extension => chai_1.expect(schema.light.folderNames[extension]).equal(definition));
                                });
                            });
                            it(`has a folder name expanded referencing its open 'light' definition`, function () {
                                supportedFolders_1.extensions.supported
                                    .filter(folder => folder.light && !folder.disabled)
                                    .forEach(folder => {
                                    const definition = `${settings_1.extensionSettings.manifestFolderLightPrefix}${folder.icon}_open`;
                                    folder.extensions.forEach(extension => chai_1.expect(schema.light.folderNamesExpanded[extension]).equal(definition));
                                });
                            });
                        });
                    });
                });
            });
        });
        context(`if a default 'light' icon is defined`, function () {
            context('each supported', function () {
                context('folder that has not a light theme version', function () {
                    let schema;
                    beforeEach(() => {
                        const dSchema = Object.assign({}, icon_manifest_1.schema);
                        dSchema.iconDefinitions._folder_light.iconPath = 'light_icon';
                        schema = new icon_manifest_1.IconGenerator(utils_1.vscode, dSchema).generateJson(emptyFileCollection, supportedFolders_1.extensions);
                    });
                    afterEach(() => {
                        schema = null;
                    });
                    context('if a default folder icon for light theme is specified', function () {
                        it(`has a 'light' definition`, function () {
                            supportedFolders_1.extensions.supported
                                .filter(folder => !folder.light && !folder.disabled)
                                .forEach(folder => {
                                const definition = `${settings_1.extensionSettings.manifestFolderLightPrefix}${folder.icon}`;
                                chai_1.expect(schema.iconDefinitions[definition]).exist;
                            });
                        });
                        it('has a folder name referencing its inherited definition', function () {
                            supportedFolders_1.extensions.supported
                                .filter(folder => !folder.light && !folder.disabled)
                                .forEach(folder => {
                                const definition = `${settings_1.extensionSettings.manifestFolderPrefix}${folder.icon}`;
                                folder.extensions.forEach(extension => chai_1.expect(schema.light.folderNames[extension]).equals(definition));
                            });
                        });
                    });
                    context('if a default folder open icon for light theme is specified', function () {
                        it(`has an open 'light' definition`, function () {
                            supportedFolders_1.extensions.supported
                                .filter(folder => !folder.light && !folder.disabled)
                                .forEach(folder => {
                                const definition = `${settings_1.extensionSettings.manifestFolderLightPrefix}${folder.icon}_open`;
                                chai_1.expect(schema.iconDefinitions[definition]).exist;
                            });
                        });
                        it('has a folder name expanded referencing its inherited definition', function () {
                            supportedFolders_1.extensions.supported
                                .filter(folder => !folder.light && !folder.disabled)
                                .forEach(folder => {
                                const definition = `${settings_1.extensionSettings.manifestFolderPrefix}${folder.icon}_open`;
                                folder.extensions.forEach(extension => chai_1.expect(schema.light.folderNamesExpanded[extension]).equals(definition));
                            });
                        });
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=iconGeneration-folders.test.js.map