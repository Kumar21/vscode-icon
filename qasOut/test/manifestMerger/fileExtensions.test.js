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
describe('FileExtensions: merging configuration documents', function () {
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
                supported: [
                    { icon: 'actionscript', extensions: ['as2'], format: 'svg' },
                ],
            };
            const json = icon_manifest_1.mergeConfig(custom, supportedExtensions_1.extensions, null, supportedFolders_1.extensions, iconGenerator);
            const def = json.iconDefinitions['_f_actionscript'];
            chai_1.expect(def).exist;
            chai_1.expect(def.iconPath).exist;
            chai_1.expect(json.fileExtensions['as2']).to.equal('_f_actionscript');
            chai_1.expect(path.extname(def.iconPath)).to.equal('.svg');
        });
        it('overrides removes the specified extension', function () {
            const custom = {
                default: null,
                supported: [
                    {
                        icon: 'actionscript2',
                        extensions: ['as2'],
                        overrides: 'actionscript',
                        format: 'svg',
                    },
                ],
            };
            const json = icon_manifest_1.mergeConfig(custom, supportedExtensions_1.extensions, null, supportedFolders_1.extensions, iconGenerator);
            const overridenDef = json.iconDefinitions['_f_actionscript'];
            const newPath = json.iconDefinitions['_f_actionscript2'].iconPath;
            chai_1.expect(overridenDef).to.not.exist;
            chai_1.expect(newPath).exist;
        });
        it('extends replaces the extension', function () {
            const custom = {
                default: null,
                supported: [
                    {
                        icon: 'newExt',
                        extensions: ['mynew'],
                        extends: 'actionscript',
                        format: 'png',
                    },
                ],
            };
            const json = icon_manifest_1.mergeConfig(custom, supportedExtensions_1.extensions, null, supportedFolders_1.extensions, iconGenerator);
            const extendedDef = json.iconDefinitions['_f_actionscript'];
            const newPath = json.iconDefinitions['_f_newExt'].iconPath;
            chai_1.expect(extendedDef).not.to.exist;
            chai_1.expect(newPath).exist;
            chai_1.expect(json.fileExtensions['as']).to.equal('_f_newExt');
            chai_1.expect(json.fileExtensions['mynew']).to.equal('_f_newExt');
            chai_1.expect(path.extname(newPath)).not.to.equal('.svg');
        });
        it('disabled extensions are not included into the manifest', function () {
            const custom = {
                default: null,
                supported: [
                    {
                        icon: 'actionscript',
                        extensions: [],
                        disabled: true,
                        format: 'svg',
                    },
                ],
            };
            const json = icon_manifest_1.mergeConfig(custom, supportedExtensions_1.extensions, null, supportedFolders_1.extensions, iconGenerator);
            const def = json.iconDefinitions['_f_actionscript'];
            chai_1.expect(def).not.to.exist;
        });
        it('not disabled extensions are included into the manifest', function () {
            const custom = {
                default: null,
                supported: [
                    {
                        icon: 'actionscript',
                        extensions: [],
                        disabled: false,
                        format: 'svg',
                    },
                ],
            };
            const json = icon_manifest_1.mergeConfig(custom, supportedExtensions_1.extensions, null, supportedFolders_1.extensions, iconGenerator);
            const def = json.iconDefinitions['_f_actionscript'];
            chai_1.expect(def).to.exist;
        });
        it('if extensions is not defined, it gets added internally', function () {
            const custom = {
                default: null,
                supported: [{ icon: 'actionscript', disabled: false, format: 'svg' }],
            };
            const json = icon_manifest_1.mergeConfig(custom, supportedExtensions_1.extensions, null, supportedFolders_1.extensions, iconGenerator);
            const def = json.iconDefinitions['_f_actionscript'];
            chai_1.expect(def).to.exist;
        });
        context('existing extensions', function () {
            it('of second set are getting enabled', function () {
                const custom = {
                    default: null,
                    supported: [
                        {
                            icon: 'ng_component_ts2',
                            extensions: ['component.ts'],
                            format: 'svg',
                        },
                        {
                            icon: 'ng_component_js2',
                            extensions: ['component.js'],
                            format: 'svg',
                        },
                        {
                            icon: 'ng_smart_component_ts2',
                            extensions: ['page.ts', 'container.ts'],
                            format: 'svg',
                        },
                        {
                            icon: 'ng_smart_component_js2',
                            extensions: ['page.js', 'container.js'],
                            format: 'svg',
                        },
                        {
                            icon: 'ng_directive_ts2',
                            extensions: ['directive.ts'],
                            format: 'svg',
                        },
                        {
                            icon: 'ng_directive_js2',
                            extensions: ['directive.js'],
                            format: 'svg',
                        },
                        { icon: 'ng_pipe_ts2', extensions: ['pipe.ts'], format: 'svg' },
                        { icon: 'ng_pipe_js2', extensions: ['pipe.js'], format: 'svg' },
                        {
                            icon: 'ng_service_ts2',
                            extensions: ['service.ts'],
                            format: 'svg',
                        },
                        {
                            icon: 'ng_service_js2',
                            extensions: ['service.js'],
                            format: 'svg',
                        },
                        { icon: 'ng_module_ts2', extensions: ['module.ts'], format: 'svg' },
                        { icon: 'ng_module_js2', extensions: ['module.js'], format: 'svg' },
                        {
                            icon: 'ng_routing_ts2',
                            extensions: ['routing.ts'],
                            format: 'svg',
                        },
                        {
                            icon: 'ng_routing_js2',
                            extensions: ['routing.js'],
                            format: 'svg',
                        },
                    ],
                };
                const json = icon_manifest_1.mergeConfig(custom, supportedExtensions_1.extensions, null, supportedFolders_1.extensions, iconGenerator);
                const ngGroup = Object.keys(json.iconDefinitions).filter(x => /^_f_ng_.*2$/.test(x));
                chai_1.expect(ngGroup.length).to.equal(14);
            });
            it('are removed from the original extension', function () {
                const custom = {
                    default: null,
                    supported: [
                        { icon: 'newExt', extensions: ['bin', 'o'], format: 'svg' },
                    ],
                };
                const json = icon_manifest_1.mergeConfig(custom, supportedExtensions_1.extensions, null, supportedFolders_1.extensions, iconGenerator);
                chai_1.expect(json.iconDefinitions['_f_newExt']).exist;
                chai_1.expect(json.fileExtensions['bin']).to.equal('_f_newExt');
                chai_1.expect(json.fileExtensions['o']).to.equal('_f_newExt');
            });
            it('accept languageId', function () {
                const custom = {
                    default: null,
                    supported: [
                        {
                            icon: 'actionscript',
                            extensions: [],
                            format: 'svg',
                            languages: [{ ids: 'newlang', defaultExtension: 'newlang' }],
                        },
                    ],
                };
                const json = icon_manifest_1.mergeConfig(custom, supportedExtensions_1.extensions, null, supportedFolders_1.extensions, iconGenerator);
                chai_1.expect(json.iconDefinitions['_f_actionscript']).exist;
                chai_1.expect(json.languageIds['newlang']).to.equal('_f_actionscript');
            });
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
                const json = icon_manifest_1.mergeConfig(custom, supportedExtensions_1.extensions, null, supportedFolders_1.extensions, iconGenerator);
                const customDef = json.iconDefinitions['_f_custom_icon'];
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
                const iconName = `${settings_1.extensionSettings.filePrefix}${custom.supported[0].icon}` +
                    `${settings_1.extensionSettings.iconSuffix}.${custom.supported[0].format}`;
                const iconNamePath = path.join(settings_1.extensionSettings.customIconFolderName, iconName);
                try {
                    fs.writeFileSync(iconNamePath, '');
                    const json = icon_manifest_1.mergeConfig(custom, supportedExtensions_1.extensions, null, supportedFolders_1.extensions, iconGenerator);
                    const customDef = json.iconDefinitions['_f_custom_icon'];
                    chai_1.expect(customDef).exist;
                    chai_1.expect(customDef.iconPath).to.contain(settings_1.extensionSettings.customIconFolderName);
                    chai_1.expect(json.fileExtensions['custom']).to.equal('_f_custom_icon');
                }
                finally {
                    fs.unlinkSync(iconNamePath);
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
                const iconName = `${settings_1.extensionSettings.filePrefix}${custom.supported[0].icon}` +
                    `${settings_1.extensionSettings.iconSuffix}.${custom.supported[0].format}`;
                const iconNamePath = path.join(customIconFolderPathFull, iconName);
                try {
                    fs.writeFileSync(iconNamePath, '');
                    const json = icon_manifest_1.mergeConfig(custom, supportedExtensions_1.extensions, null, supportedFolders_1.extensions, iconGenerator);
                    const customDef = json.iconDefinitions['_f_custom_icon'];
                    chai_1.expect(customDef).exist;
                    chai_1.expect(customDef.iconPath).to.contain(customIconFolderPathFull);
                }
                finally {
                    fs.unlinkSync(iconNamePath);
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
                const iconName = `${settings_1.extensionSettings.filePrefix}${custom.supported[0].icon}` +
                    `${settings_1.extensionSettings.iconSuffix}.${custom.supported[0].format}`;
                const iconNamePath = path.join(customIconFolderPathFull, iconName);
                try {
                    fs.writeFileSync(iconNamePath, '');
                    const json = icon_manifest_1.mergeConfig(custom, supportedExtensions_1.extensions, null, supportedFolders_1.extensions, iconGenerator);
                    const customDef = json.iconDefinitions['_f_custom_icon'];
                    chai_1.expect(customDef).exist;
                    chai_1.expect(customDef.iconPath.startsWith(iconGenerator.iconsFolderBasePath)).to.be.true;
                }
                finally {
                    fs.unlinkSync(iconNamePath);
                }
            });
        });
    });
});
//# sourceMappingURL=fileExtensions.test.js.map