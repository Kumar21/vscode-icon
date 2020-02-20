"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable only-arrow-functions
// tslint:disable no-unused-expression
const fs = require("fs");
const path = require("path");
const chai_1 = require("chai");
const supportedExtensions_1 = require("../support/supportedExtensions");
const supportedFolders_1 = require("../support/supportedFolders");
const settings_1 = require("../../src/settings");
const icon_manifest_1 = require("../../src/icon-manifest");
const utils = require("../../src/utils");
describe('DefaultExtensions: merging configuration documents', function () {
    const tempFolderPath = utils.tempPath();
    before(() => {
        // ensure the tests write to the temp folder
        process.chdir(tempFolderPath);
        utils.createDirectoryRecursively(settings_1.extensionSettings.customIconFolderName);
    });
    after(() => {
        utils.deleteDirectoryRecursively(settings_1.extensionSettings.customIconFolderName);
    });
    let iconGenerator;
    beforeEach(() => {
        iconGenerator = new icon_manifest_1.IconGenerator(utils.vscode, icon_manifest_1.schema);
        iconGenerator.settings.vscodeAppUserPath = tempFolderPath;
    });
    afterEach(() => {
        iconGenerator = null;
    });
    context('ensures that', function () {
        context('default file icons can be', function () {
            it('added', function () {
                const custom = {
                    default: {
                        file_light: { icon: 'customFileIconLight', format: 'svg' },
                    },
                    supported: [],
                };
                const iconName = `${settings_1.extensionSettings.defaultExtensionPrefix}${custom.default.file_light.icon}` +
                    `${settings_1.extensionSettings.iconSuffix}.${custom.default.file_light.format}`;
                const iconNamePath = path.join(settings_1.extensionSettings.customIconFolderName, iconName);
                try {
                    fs.writeFileSync(iconNamePath, '');
                    const json = icon_manifest_1.mergeConfig(custom, supportedExtensions_1.extensions, null, supportedFolders_1.extensions, iconGenerator);
                    const def = json.iconDefinitions._file_light;
                    chai_1.expect(def).exist;
                    chai_1.expect(def.iconPath).exist;
                    chai_1.expect(def.iconPath).to.contain(iconName);
                    chai_1.expect(def.iconPath).to.contain(settings_1.extensionSettings.customIconFolderName);
                }
                finally {
                    fs.unlinkSync(iconNamePath);
                }
            });
            it('overriden', function () {
                const custom = {
                    default: {
                        file: { icon: 'customFileIcon', format: 'svg' },
                    },
                    supported: [],
                };
                const iconName = `${settings_1.extensionSettings.defaultExtensionPrefix}${custom.default.file.icon}` + `${settings_1.extensionSettings.iconSuffix}.${custom.default.file.format}`;
                const iconNamePath = path.join(settings_1.extensionSettings.customIconFolderName, iconName);
                try {
                    fs.writeFileSync(iconNamePath, '');
                    const json = icon_manifest_1.mergeConfig(custom, supportedExtensions_1.extensions, null, supportedFolders_1.extensions, iconGenerator);
                    const def = json.iconDefinitions._file;
                    chai_1.expect(def).exist;
                    chai_1.expect(def.iconPath).exist;
                    chai_1.expect(def.iconPath).to.contain(iconName);
                    chai_1.expect(def.iconPath).to.contain(settings_1.extensionSettings.customIconFolderName);
                }
                finally {
                    fs.unlinkSync(iconNamePath);
                }
            });
            it('disabled', function () {
                const custom = {
                    default: {
                        file: { icon: '', format: 'svg', disabled: true },
                    },
                    supported: [],
                };
                const json = icon_manifest_1.mergeConfig(custom, supportedExtensions_1.extensions, null, supportedFolders_1.extensions, iconGenerator);
                const def = json.iconDefinitions._file;
                chai_1.expect(def).exist;
                chai_1.expect(def.iconPath).to.be.empty;
            });
        });
        context('default folder icons can be', function () {
            it('added', function () {
                const custom = {
                    default: {
                        folder_light: { icon: 'customFolderIconLight', format: 'svg' },
                    },
                    supported: [],
                };
                const iconName = `${settings_1.extensionSettings.defaultExtensionPrefix}${custom.default.folder_light.icon}` +
                    `${settings_1.extensionSettings.iconSuffix}.${custom.default.folder_light.format}`;
                const iconNameOpen = `${settings_1.extensionSettings.defaultExtensionPrefix}${custom.default.folder_light.icon}_opened` +
                    `${settings_1.extensionSettings.iconSuffix}.${custom.default.folder_light.format}`;
                const iconNamePath = path.join(settings_1.extensionSettings.customIconFolderName, iconName);
                const iconNameOpenPath = path.join(settings_1.extensionSettings.customIconFolderName, iconNameOpen);
                try {
                    fs.writeFileSync(iconNamePath, '');
                    fs.writeFileSync(iconNameOpenPath, '');
                    const json = icon_manifest_1.mergeConfig(null, supportedExtensions_1.extensions, custom, supportedFolders_1.extensions, iconGenerator);
                    const def = json.iconDefinitions._folder_light;
                    const defOpen = json.iconDefinitions._folder_light_open;
                    chai_1.expect(def).exist;
                    chai_1.expect(defOpen).exist;
                    chai_1.expect(def.iconPath).exist;
                    chai_1.expect(defOpen.iconPath).exist;
                    chai_1.expect(def.iconPath).to.contain(iconName);
                    chai_1.expect(defOpen.iconPath).to.contain(iconNameOpen);
                    chai_1.expect(def.iconPath).to.contain(settings_1.extensionSettings.customIconFolderName);
                    chai_1.expect(defOpen.iconPath).to.contain(settings_1.extensionSettings.customIconFolderName);
                }
                finally {
                    fs.unlinkSync(iconNamePath);
                    fs.unlinkSync(iconNameOpenPath);
                }
            });
            it('overriden', function () {
                const custom = {
                    default: {
                        folder: { icon: 'customFolderIcon', format: 'svg' },
                    },
                    supported: [],
                };
                const iconName = `${settings_1.extensionSettings.defaultExtensionPrefix}${custom.default.folder.icon}` +
                    `${settings_1.extensionSettings.iconSuffix}.${custom.default.folder.format}`;
                const iconNameOpen = `${settings_1.extensionSettings.defaultExtensionPrefix}${custom.default.folder.icon}_opened` +
                    `${settings_1.extensionSettings.iconSuffix}.${custom.default.folder.format}`;
                const iconNamePath = path.join(settings_1.extensionSettings.customIconFolderName, iconName);
                const iconNameOpenPath = path.join(settings_1.extensionSettings.customIconFolderName, iconNameOpen);
                try {
                    fs.writeFileSync(iconNamePath, '');
                    fs.writeFileSync(iconNameOpenPath, '');
                    const json = icon_manifest_1.mergeConfig(null, supportedExtensions_1.extensions, custom, supportedFolders_1.extensions, iconGenerator);
                    const def = json.iconDefinitions._folder;
                    const defOpen = json.iconDefinitions._folder_open;
                    chai_1.expect(def).exist;
                    chai_1.expect(defOpen).exist;
                    chai_1.expect(def.iconPath).exist;
                    chai_1.expect(defOpen.iconPath).exist;
                    chai_1.expect(def.iconPath).to.contain(iconName);
                    chai_1.expect(defOpen.iconPath).to.contain(iconNameOpen);
                    chai_1.expect(def.iconPath).to.contain(settings_1.extensionSettings.customIconFolderName);
                    chai_1.expect(defOpen.iconPath).to.contain(settings_1.extensionSettings.customIconFolderName);
                }
                finally {
                    fs.unlinkSync(iconNamePath);
                    fs.unlinkSync(iconNameOpenPath);
                }
            });
            it('disabled', function () {
                const custom = {
                    default: {
                        folder: { icon: '', format: 'svg', disabled: true },
                    },
                    supported: [],
                };
                const json = icon_manifest_1.mergeConfig(null, supportedExtensions_1.extensions, custom, supportedFolders_1.extensions, iconGenerator);
                const def = json.iconDefinitions._folder;
                const defOpen = json.iconDefinitions._folder_open;
                chai_1.expect(def).exist;
                chai_1.expect(defOpen).exist;
                chai_1.expect(def.iconPath).to.be.empty;
                chai_1.expect(defOpen.iconPath).to.be.empty;
            });
        });
        context('default root folder icons can be', function () {
            it('added', function () {
                const custom = {
                    default: {
                        root_folder_light: {
                            icon: 'customRootFolderIconLight',
                            format: 'svg',
                        },
                    },
                    supported: [],
                };
                const iconName = `${settings_1.extensionSettings.defaultExtensionPrefix}${custom.default.root_folder_light.icon}` +
                    `${settings_1.extensionSettings.iconSuffix}.${custom.default.root_folder_light.format}`;
                const iconNameOpen = `${settings_1.extensionSettings.defaultExtensionPrefix}${custom.default.root_folder_light.icon}_opened` +
                    `${settings_1.extensionSettings.iconSuffix}.${custom.default.root_folder_light.format}`;
                const iconNamePath = path.join(settings_1.extensionSettings.customIconFolderName, iconName);
                const iconNameOpenPath = path.join(settings_1.extensionSettings.customIconFolderName, iconNameOpen);
                try {
                    fs.writeFileSync(iconNamePath, '');
                    fs.writeFileSync(iconNameOpenPath, '');
                    const json = icon_manifest_1.mergeConfig(null, supportedExtensions_1.extensions, custom, supportedFolders_1.extensions, iconGenerator);
                    const def = json.iconDefinitions._root_folder_light;
                    const defOpen = json.iconDefinitions._root_folder_light_open;
                    chai_1.expect(def).exist;
                    chai_1.expect(defOpen).exist;
                    chai_1.expect(def.iconPath).exist;
                    chai_1.expect(defOpen.iconPath).exist;
                    chai_1.expect(def.iconPath).to.contain(iconName);
                    chai_1.expect(defOpen.iconPath).to.contain(iconNameOpen);
                    chai_1.expect(def.iconPath).to.contain(settings_1.extensionSettings.customIconFolderName);
                    chai_1.expect(defOpen.iconPath).to.contain(settings_1.extensionSettings.customIconFolderName);
                }
                finally {
                    fs.unlinkSync(iconNamePath);
                    fs.unlinkSync(iconNameOpenPath);
                }
            });
            it('overriden', function () {
                const custom = {
                    default: {
                        root_folder: { icon: 'customRootFolderIcon', format: 'svg' },
                    },
                    supported: [],
                };
                const iconName = `${settings_1.extensionSettings.defaultExtensionPrefix}${custom.default.root_folder.icon}` +
                    `${settings_1.extensionSettings.iconSuffix}.${custom.default.root_folder.format}`;
                const iconNameOpen = `${settings_1.extensionSettings.defaultExtensionPrefix}${custom.default.root_folder.icon}_opened` +
                    `${settings_1.extensionSettings.iconSuffix}.${custom.default.root_folder.format}`;
                const iconNamePath = path.join(settings_1.extensionSettings.customIconFolderName, iconName);
                const iconNameOpenPath = path.join(settings_1.extensionSettings.customIconFolderName, iconNameOpen);
                try {
                    fs.writeFileSync(iconNamePath, '');
                    fs.writeFileSync(iconNameOpenPath, '');
                    const json = icon_manifest_1.mergeConfig(null, supportedExtensions_1.extensions, custom, supportedFolders_1.extensions, iconGenerator);
                    const def = json.iconDefinitions._root_folder;
                    const defOpen = json.iconDefinitions._root_folder_open;
                    chai_1.expect(def).exist;
                    chai_1.expect(defOpen).exist;
                    chai_1.expect(def.iconPath).exist;
                    chai_1.expect(defOpen.iconPath).exist;
                    chai_1.expect(def.iconPath).to.contain(iconName);
                    chai_1.expect(defOpen.iconPath).to.contain(iconNameOpen);
                    chai_1.expect(def.iconPath).to.contain(settings_1.extensionSettings.customIconFolderName);
                    chai_1.expect(defOpen.iconPath).to.contain(settings_1.extensionSettings.customIconFolderName);
                }
                finally {
                    fs.unlinkSync(iconNamePath);
                    fs.unlinkSync(iconNameOpenPath);
                }
            });
            it('disabled', function () {
                const custom = {
                    default: {
                        root_folder: { icon: '', format: 'svg', disabled: true },
                    },
                    supported: [],
                };
                const json = icon_manifest_1.mergeConfig(null, supportedExtensions_1.extensions, custom, supportedFolders_1.extensions, iconGenerator);
                const def = json.iconDefinitions._root_folder;
                const defOpen = json.iconDefinitions._root_folder_open;
                chai_1.expect(def).exist;
                chai_1.expect(defOpen).exist;
                chai_1.expect(def.iconPath).to.be.empty;
                chai_1.expect(defOpen.iconPath).to.be.empty;
            });
        });
    });
});
//# sourceMappingURL=defaultExtensions.test.js.map