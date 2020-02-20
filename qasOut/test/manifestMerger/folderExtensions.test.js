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
describe('FolderExtensions: merging configuration documents', function () {
    const tempFolderPath = utils.tempPath();
    const customIconFolderPath = 'some/custom/icons/folder/path';
    const customIconFolderPathFull = utils.pathUnixJoin(customIconFolderPath, settings_1.extensionSettings.customIconFolderName);
    before(() => {
        // ensure the tests write to the temp folder
        process.chdir(tempFolderPath);
        utils.createDirectoryRecursively(settings_1.extensionSettings.customIconFolderName);
        utils.createDirectoryRecursively(customIconFolderPathFull);
    });
    after(() => {
        utils.deleteDirectoryRecursively(settings_1.extensionSettings.customIconFolderName);
        utils.deleteDirectoryRecursively(customIconFolderPathFull);
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
        it('new extensions are added to existing file extension and respect the extension type', function () {
            const custom = {
                default: null,
                supported: [{ icon: 'aws', extensions: ['aws3'], format: 'svg' }],
            };
            const json = icon_manifest_1.mergeConfig(null, supportedExtensions_1.extensions, custom, supportedFolders_1.extensions, iconGenerator);
            const def = json.iconDefinitions['_fd_aws'];
            chai_1.expect(def).exist;
            chai_1.expect(def.iconPath).exist;
            chai_1.expect(json.folderNames['aws3']).to.equal('_fd_aws');
            chai_1.expect(json.folderNamesExpanded['aws3']).to.equal('_fd_aws_open');
            chai_1.expect(path.extname(def.iconPath)).to.equal('.svg');
        });
        it('overrides removes the specified extension', function () {
            const custom = {
                default: null,
                supported: [
                    {
                        icon: 'aws2',
                        extensions: ['aws2'],
                        overrides: 'aws',
                        format: 'svg',
                    },
                ],
            };
            const json = icon_manifest_1.mergeConfig(null, supportedExtensions_1.extensions, custom, supportedFolders_1.extensions, iconGenerator);
            const overridenPath = json.iconDefinitions['_fd_aws'];
            const newPath = json.iconDefinitions['_fd_aws2'].iconPath;
            chai_1.expect(overridenPath).to.not.exist;
            chai_1.expect(newPath).exist;
        });
        it('extends replaces the extension', function () {
            const custom = {
                default: null,
                supported: [
                    {
                        icon: 'newExt',
                        extensions: ['mynew'],
                        extends: 'aws',
                        format: 'png',
                    },
                ],
            };
            const json = icon_manifest_1.mergeConfig(null, supportedExtensions_1.extensions, custom, supportedFolders_1.extensions, iconGenerator);
            const extendedPath = json.iconDefinitions['_fd_aws'];
            const newPath = json.iconDefinitions['_fd_newExt'].iconPath;
            chai_1.expect(extendedPath).not.to.exist;
            chai_1.expect(newPath).exist;
            chai_1.expect(json.folderNames['aws']).to.equal('_fd_newExt');
            chai_1.expect(json.folderNamesExpanded['aws']).to.equal('_fd_newExt_open');
            chai_1.expect(json.folderNames['mynew']).to.equal('_fd_newExt');
            chai_1.expect(json.folderNamesExpanded['mynew']).to.equal('_fd_newExt_open');
            chai_1.expect(path.extname(newPath)).not.to.equal('.svg');
        });
        it('disabled extensions are not included into the manifest', function () {
            const custom = {
                default: null,
                supported: [
                    { icon: 'aws', extensions: [], disabled: true, format: 'svg' },
                ],
            };
            const json = icon_manifest_1.mergeConfig(null, supportedExtensions_1.extensions, custom, supportedFolders_1.extensions, iconGenerator);
            const def = json.iconDefinitions['_fd_aws'];
            chai_1.expect(def).not.to.exist;
            chai_1.expect(json.iconDefinitions['_fd_newExt']).not.to.exist;
        });
        it('not disabled extensions are included into the manifest', function () {
            const custom = {
                default: null,
                supported: [
                    { icon: 'aws', extensions: [], disabled: false, format: 'svg' },
                ],
            };
            const json = icon_manifest_1.mergeConfig(null, supportedExtensions_1.extensions, custom, supportedFolders_1.extensions, iconGenerator);
            const def = json.iconDefinitions['_fd_aws'];
            chai_1.expect(def).to.exist;
            chai_1.expect(json.iconDefinitions['_fd_newExt']).not.to.exist;
        });
        it('if extensions is not defined, it gets added internally', function () {
            const custom = {
                default: null,
                supported: [{ icon: 'aws', disabled: false, format: 'svg' }],
            };
            const json = icon_manifest_1.mergeConfig(null, supportedExtensions_1.extensions, custom, supportedFolders_1.extensions, iconGenerator);
            const def = json.iconDefinitions['_fd_aws'];
            chai_1.expect(def).to.exist;
            chai_1.expect(json.iconDefinitions['_fd_newExt']).not.to.exist;
        });
        it('existing extensions are removed from the original extension', function () {
            const custom = {
                default: null,
                supported: [{ icon: 'newExt', extensions: ['aws'], format: 'svg' }],
            };
            const json = icon_manifest_1.mergeConfig(null, supportedExtensions_1.extensions, custom, supportedFolders_1.extensions, iconGenerator);
            chai_1.expect(json.iconDefinitions['_fd_newExt']).exist;
            chai_1.expect(json.folderNames['aws']).to.equal('_fd_newExt');
        });
        context('custom icon', function () {
            it('keeps the correct extension', function () {
                const custom = {
                    default: null,
                    supported: [
                        {
                            icon: 'custom_icon',
                            extensions: ['custom'],
                            format: 'svg',
                        },
                    ],
                };
                const json = icon_manifest_1.mergeConfig(null, supportedExtensions_1.extensions, custom, supportedFolders_1.extensions, iconGenerator);
                const customDef = json.iconDefinitions['_fd_custom_icon'];
                chai_1.expect(customDef).exist;
                chai_1.expect(path.extname(customDef.iconPath)).to.equal('.svg');
            });
            it('has a custom path', function () {
                const custom = {
                    default: null,
                    supported: [
                        {
                            icon: 'custom_icon',
                            extensions: ['custom'],
                            format: 'svg',
                        },
                    ],
                };
                const iconName = `${settings_1.extensionSettings.folderPrefix}${custom.supported[0].icon}` +
                    `${settings_1.extensionSettings.iconSuffix}.${custom.supported[0].format}`;
                const iconNameOpen = `${settings_1.extensionSettings.folderPrefix}${custom.supported[0].icon}_opened` +
                    `${settings_1.extensionSettings.iconSuffix}.${custom.supported[0].format}`;
                const iconNamePath = path.join(settings_1.extensionSettings.customIconFolderName, iconName);
                const iconNameOpenPath = path.join(settings_1.extensionSettings.customIconFolderName, iconNameOpen);
                try {
                    fs.writeFileSync(iconNamePath, '');
                    fs.writeFileSync(iconNameOpenPath, '');
                    const json = icon_manifest_1.mergeConfig(null, supportedExtensions_1.extensions, custom, supportedFolders_1.extensions, iconGenerator);
                    const customDef = json.iconDefinitions['_fd_custom_icon'];
                    chai_1.expect(customDef).exist;
                    chai_1.expect(customDef.iconPath).contains(settings_1.extensionSettings.customIconFolderName);
                    chai_1.expect(json.folderNames['custom']).to.equal('_fd_custom_icon');
                    chai_1.expect(json.folderNamesExpanded['custom']).to.equal('_fd_custom_icon_open');
                }
                finally {
                    fs.unlinkSync(iconNamePath);
                    fs.unlinkSync(iconNameOpenPath);
                }
            });
        });
        context('the manifest generator', function () {
            it('uses the custom icon folder path, when provided', function () {
                const custom = {
                    default: null,
                    supported: [
                        {
                            icon: 'custom_icon',
                            extensions: ['custom'],
                            format: 'svg',
                        },
                    ],
                };
                iconGenerator = new icon_manifest_1.IconGenerator(utils.vscode, icon_manifest_1.schema, customIconFolderPath);
                iconGenerator.settings.vscodeAppUserPath = tempFolderPath;
                const iconName = `${settings_1.extensionSettings.folderPrefix}${custom.supported[0].icon}` +
                    `${settings_1.extensionSettings.iconSuffix}.${custom.supported[0].format}`;
                const iconNameOpen = `${settings_1.extensionSettings.folderPrefix}${custom.supported[0].icon}_opened` +
                    `${settings_1.extensionSettings.iconSuffix}.${custom.supported[0].format}`;
                const iconNamePath = path.join(customIconFolderPathFull, iconName);
                const iconNameOpenPath = path.join(customIconFolderPathFull, iconNameOpen);
                try {
                    fs.writeFileSync(iconNamePath, '');
                    fs.writeFileSync(iconNameOpenPath, '');
                    const json = icon_manifest_1.mergeConfig(null, supportedExtensions_1.extensions, custom, supportedFolders_1.extensions, iconGenerator);
                    const customDef = json.iconDefinitions['_fd_custom_icon'];
                    chai_1.expect(customDef).exist;
                    chai_1.expect(customDef.iconPath).to.contain(customIconFolderPathFull);
                    chai_1.expect(json.folderNames['custom']).to.equal('_fd_custom_icon');
                    chai_1.expect(json.folderNamesExpanded['custom']).to.equal('_fd_custom_icon_open');
                }
                finally {
                    fs.unlinkSync(iconNamePath);
                    fs.unlinkSync(iconNameOpenPath);
                }
            });
            it('avoids custom icons detection', function () {
                const custom = {
                    default: null,
                    supported: [
                        {
                            icon: 'custom_icon',
                            extensions: ['custom'],
                            format: 'svg',
                        },
                    ],
                };
                iconGenerator = new icon_manifest_1.IconGenerator(utils.vscode, icon_manifest_1.schema, customIconFolderPath, 
                /*avoidCustomDetection*/ true);
                iconGenerator.settings.vscodeAppUserPath = tempFolderPath;
                const iconName = `${settings_1.extensionSettings.folderPrefix}${custom.supported[0].icon}` +
                    `${settings_1.extensionSettings.iconSuffix}.${custom.supported[0].format}`;
                const iconNameOpen = `${settings_1.extensionSettings.folderPrefix}${custom.supported[0].icon}_opened` +
                    `${settings_1.extensionSettings.iconSuffix}.${custom.supported[0].format}`;
                const iconNamePath = path.join(customIconFolderPathFull, iconName);
                const iconNameOpenPath = path.join(customIconFolderPathFull, iconNameOpen);
                try {
                    fs.writeFileSync(iconNamePath, '');
                    fs.writeFileSync(iconNameOpenPath, '');
                    const json = icon_manifest_1.mergeConfig(null, supportedExtensions_1.extensions, custom, supportedFolders_1.extensions, iconGenerator);
                    const customDef = json.iconDefinitions['_fd_custom_icon'];
                    chai_1.expect(customDef).exist;
                    chai_1.expect(customDef.iconPath.startsWith(iconGenerator.iconsFolderBasePath)).to.be.true;
                    chai_1.expect(json.folderNames['custom']).to.equal('_fd_custom_icon');
                    chai_1.expect(json.folderNamesExpanded['custom']).to.equal('_fd_custom_icon_open');
                }
                finally {
                    fs.unlinkSync(iconNamePath);
                    fs.unlinkSync(iconNameOpenPath);
                }
            });
        });
    });
});
//# sourceMappingURL=folderExtensions.test.js.map