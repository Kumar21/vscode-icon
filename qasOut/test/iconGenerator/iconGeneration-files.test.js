"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable only-arrow-functions
// tslint:disable no-unused-expression
const fs = require("fs");
const path = require("path");
const chai_1 = require("chai");
const icon_manifest_1 = require("../../src/icon-manifest");
const supportedExtensions_1 = require("../../src/icon-manifest/supportedExtensions");
const models_1 = require("../../src/models");
const utils_1 = require("../../src/utils");
const settings_1 = require("../../src/settings");
describe('IconGenerator: files icon generation test', function () {
    context('ensures that', function () {
        let emptyFolderCollection;
        beforeEach(() => {
            emptyFolderCollection = {
                default: { folder: { icon: 'folder', format: 'svg' } },
                supported: [],
            };
        });
        it('filename extension should not have a leading dot', function () {
            supportedExtensions_1.extensions.supported
                .filter(file => !file.filename && !file.disabled)
                .forEach(file => file.extensions.forEach(extension => chai_1.expect(extension.startsWith('.')).to.be.false));
        });
        context('default', function () {
            let iconGenerator;
            beforeEach(() => {
                iconGenerator = new icon_manifest_1.IconGenerator(utils_1.vscode, icon_manifest_1.schema);
            });
            afterEach(() => {
                iconGenerator = null;
            });
            it('file has an icon path', function () {
                const schema = iconGenerator.generateJson(supportedExtensions_1.extensions, emptyFolderCollection);
                // tslint:disable-next-line:no-unused-expression
                chai_1.expect(schema.iconDefinitions._file.iconPath).not.to.be.empty;
            });
            context(`if a default 'light' icon is NOT defined`, function () {
                context('each supported', function () {
                    const iconsFolderPath = path.join(__dirname, '../../../icons');
                    context('file extension', function () {
                        it('has an associated icon file', function () {
                            supportedExtensions_1.extensions.supported.forEach(file => {
                                const filename = `${settings_1.extensionSettings.filePrefix}${file.icon}` +
                                    `${settings_1.extensionSettings.iconSuffix}.${models_1.FileFormat[file.format]}`;
                                const iconFilePath = path.join(iconsFolderPath, filename);
                                chai_1.expect(fs.existsSync(iconFilePath)).to.be.true;
                            });
                        });
                        it('has a definition', function () {
                            const schema = iconGenerator.generateJson(supportedExtensions_1.extensions, emptyFolderCollection);
                            supportedExtensions_1.extensions.supported.filter(file => !file.disabled).forEach(file => {
                                const definition = `${settings_1.extensionSettings.manifestFilePrefix}${file.icon}`;
                                chai_1.expect(schema.iconDefinitions[definition]).exist;
                            });
                        });
                        it('has an icon path', function () {
                            const schema = iconGenerator.generateJson(supportedExtensions_1.extensions, emptyFolderCollection);
                            supportedExtensions_1.extensions.supported.filter(file => !file.disabled).forEach(file => {
                                const definition = `${settings_1.extensionSettings.manifestFilePrefix}${file.icon}`;
                                chai_1.expect(schema.iconDefinitions[definition].iconPath).not.to.be.equal('');
                            });
                        });
                        it('that has a light theme version, has an associated icon file', function () {
                            supportedExtensions_1.extensions.supported.filter(file => file.light).forEach(file => {
                                const filename = `${settings_1.extensionSettings.fileLightPrefix}${file.icon}${settings_1.extensionSettings.iconSuffix}.${models_1.FileFormat[file.format]}`;
                                const iconFilePath = path.join(iconsFolderPath, filename);
                                chai_1.expect(fs.existsSync(iconFilePath)).to.be.true;
                            });
                        });
                        it(`that has a light theme version, has a 'light' definition`, function () {
                            const schema = iconGenerator.generateJson(supportedExtensions_1.extensions, emptyFolderCollection);
                            supportedExtensions_1.extensions.supported
                                .filter(file => file.light && !file.disabled)
                                .forEach(file => {
                                const definition = `${settings_1.extensionSettings.manifestFileLightPrefix}${file.icon}`;
                                chai_1.expect(schema.iconDefinitions[definition]).exist;
                            });
                        });
                        it('that has a light theme version, has an icon path', function () {
                            const schema = iconGenerator.generateJson(supportedExtensions_1.extensions, emptyFolderCollection);
                            supportedExtensions_1.extensions.supported
                                .filter(file => file.light && !file.disabled)
                                .forEach(file => {
                                const definition = `${settings_1.extensionSettings.manifestFileLightPrefix}${file.icon}`;
                                chai_1.expect(schema.iconDefinitions[definition].iconPath).not.to.be.equal('');
                            });
                        });
                        it('that is not a filename, has a file extension referencing its definition', function () {
                            const schema = iconGenerator.generateJson(supportedExtensions_1.extensions, emptyFolderCollection);
                            supportedExtensions_1.extensions.supported
                                .filter(file => !file.filename && !file.disabled)
                                .forEach(file => {
                                const definition = `${settings_1.extensionSettings.manifestFilePrefix}${file.icon}`;
                                file.extensions.forEach(extension => chai_1.expect(schema.fileExtensions[extension]).equal(definition));
                            });
                        });
                        it('that is not a filename and has a light theme version, ' +
                            `has a file extension referencing its 'light' definition`, function () {
                            const schema = iconGenerator.generateJson(supportedExtensions_1.extensions, emptyFolderCollection);
                            supportedExtensions_1.extensions.supported
                                .filter(file => !file.filename && file.light && !file.disabled)
                                .forEach(file => {
                                const definition = `${settings_1.extensionSettings.manifestFileLightPrefix}${file.icon}`;
                                file.extensions.forEach(extension => chai_1.expect(schema.light.fileExtensions[extension]).equal(definition));
                            });
                        });
                        it('that is a filename, has a file name referencing its definition', function () {
                            const schema = iconGenerator.generateJson(supportedExtensions_1.extensions, emptyFolderCollection);
                            supportedExtensions_1.extensions.supported
                                .filter(file => file.filename && !file.languages && !file.disabled)
                                .forEach(file => {
                                const definition = `${settings_1.extensionSettings.manifestFilePrefix}${file.icon}`;
                                file.extensions.forEach(extension => chai_1.expect(schema.fileNames[extension]).equal(definition));
                            });
                        });
                        it(`that is a filename and has a light theme version, ` +
                            `has a file name referencing its 'light' definition`, function () {
                            const schema = iconGenerator.generateJson(supportedExtensions_1.extensions, emptyFolderCollection);
                            supportedExtensions_1.extensions.supported
                                .filter(file => file.filename &&
                                !file.languages &&
                                file.light &&
                                !file.disabled)
                                .forEach(file => {
                                const definition = `${settings_1.extensionSettings.manifestFileLightPrefix}${file.icon}`;
                                file.extensions.forEach(extension => chai_1.expect(schema.light.fileNames[extension]).equal(definition));
                            });
                        });
                        it('that is supported by language ids, has a language id referencing its definition', function () {
                            const schema = iconGenerator.generateJson(supportedExtensions_1.extensions, emptyFolderCollection);
                            supportedExtensions_1.extensions.supported
                                .filter(file => file.languages && !file.disabled)
                                .forEach(file => {
                                const definition = `${settings_1.extensionSettings.manifestFilePrefix}${file.icon}`;
                                const assertLanguage = language => {
                                    chai_1.expect(schema.languageIds[language]).equal(definition);
                                };
                                file.languages.forEach(langIds => {
                                    if (Array.isArray(langIds.ids)) {
                                        langIds.ids.forEach(id => assertLanguage(id));
                                    }
                                    else {
                                        assertLanguage(langIds.ids);
                                    }
                                });
                            });
                        });
                        it('that is supported by language ids and has a light theme version, ' +
                            `has a language id referencing its 'light' definition`, function () {
                            const schema = iconGenerator.generateJson(supportedExtensions_1.extensions, emptyFolderCollection);
                            supportedExtensions_1.extensions.supported
                                .filter(file => file.languages && file.light && !file.disabled)
                                .forEach(file => {
                                const definition = `${settings_1.extensionSettings.manifestFileLightPrefix}${file.icon}`;
                                const assertLanguageLight = language => {
                                    chai_1.expect(schema.light.languageIds[language]).equal(definition);
                                };
                                file.languages.forEach(langIds => {
                                    if (Array.isArray(langIds.ids)) {
                                        langIds.ids.forEach(id => assertLanguageLight(id));
                                    }
                                    else {
                                        assertLanguageLight(langIds.ids);
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
        context(`if a default 'light' icon is defined`, function () {
            context('each supported', function () {
                context('file extension', function () {
                    context('that has not a light theme version', function () {
                        it(`and is supported by language ids, ` +
                            `has a 'light' language id referencing its inherited definition`, function () {
                            const dSchema = Object.assign({}, icon_manifest_1.schema);
                            dSchema.iconDefinitions._file_light.iconPath = 'light_icon';
                            const schema = new icon_manifest_1.IconGenerator(utils_1.vscode, dSchema).generateJson(supportedExtensions_1.extensions, emptyFolderCollection);
                            supportedExtensions_1.extensions.supported
                                .filter(file => file.languages && !file.light && !file.disabled)
                                .forEach(file => {
                                const definition = `${settings_1.extensionSettings.manifestFilePrefix}${file.icon}`;
                                const assignLanguagesLight = language => {
                                    chai_1.expect(schema.light.languageIds[language]).equal(definition);
                                };
                                file.languages.forEach(langIds => {
                                    if (Array.isArray(langIds.ids)) {
                                        langIds.ids.forEach(id => assignLanguagesLight(id));
                                    }
                                    else {
                                        assignLanguagesLight(langIds.ids);
                                    }
                                });
                            });
                        });
                        it('and is not a filename, has a file extension referencing its inherited definition', function () {
                            const dSchema = Object.assign({}, icon_manifest_1.schema);
                            dSchema.iconDefinitions._file_light.iconPath = 'light_icon';
                            const schema = new icon_manifest_1.IconGenerator(utils_1.vscode, dSchema).generateJson(supportedExtensions_1.extensions, emptyFolderCollection);
                            supportedExtensions_1.extensions.supported
                                .filter(file => !file.filename && !file.light && !file.disabled)
                                .forEach(file => {
                                const definition = `${settings_1.extensionSettings.manifestFilePrefix}${file.icon}`;
                                file.extensions.forEach(extension => chai_1.expect(schema.light.fileExtensions[extension]).equals(definition));
                            });
                        });
                        it(`has a 'light' definition`, function () {
                            const dSchema = Object.assign({}, icon_manifest_1.schema);
                            dSchema.iconDefinitions._file_light.iconPath = 'light_icon';
                            const schema = new icon_manifest_1.IconGenerator(utils_1.vscode, dSchema).generateJson(supportedExtensions_1.extensions, emptyFolderCollection);
                            supportedExtensions_1.extensions.supported
                                .filter(file => !file.light && !file.disabled)
                                .forEach(file => {
                                const definition = `${settings_1.extensionSettings.manifestFileLightPrefix}${file.icon}`;
                                chai_1.expect(schema.iconDefinitions[definition]).exist;
                            });
                        });
                    });
                    it('that has a light theme version and is a filename, ' +
                        'has a file name referencing its inherited definition', function () {
                        const dSchema = Object.assign({}, icon_manifest_1.schema);
                        dSchema.iconDefinitions._file_light.iconPath = 'light_icon';
                        const schema = new icon_manifest_1.IconGenerator(utils_1.vscode, dSchema).generateJson(supportedExtensions_1.extensions, emptyFolderCollection);
                        supportedExtensions_1.extensions.supported
                            .filter(file => file.filename &&
                            !file.languages &&
                            !file.light &&
                            !file.disabled)
                            .forEach(file => {
                            const definition = `${settings_1.extensionSettings.manifestFilePrefix}${file.icon}`;
                            file.extensions.forEach(extension => chai_1.expect(schema.light.fileNames[extension]).equals(definition));
                        });
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=iconGeneration-files.test.js.map