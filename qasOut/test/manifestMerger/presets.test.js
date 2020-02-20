"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable only-arrow-functions
// tslint:disable no-unused-expression
const chai_1 = require("chai");
const supportedExtensions_1 = require("../support/supportedExtensions");
const supportedFolders_1 = require("../support/supportedFolders");
const iconManifest = require("../../src/icon-manifest");
const models_1 = require("../../src/models");
describe('Presets: merging configuration documents', function () {
    context('ensures that', function () {
        let custom;
        beforeEach(() => {
            custom = {
                default: null,
                supported: [],
            };
        });
        it('all angular extensions get disabled', function () {
            const result = iconManifest.toggleAngularPreset(true, supportedExtensions_1.extensions);
            const nggroup = result.supported.filter(x => x.icon.startsWith('ng_') && x.disabled);
            chai_1.expect(nggroup.length).to.equal(34);
        });
        it('only first set of angular extensions get enabled', function () {
            const result = iconManifest.toggleAngularPreset(false, supportedExtensions_1.extensions);
            const nggroup = result.supported.filter(x => x.icon.startsWith('ng_') && !x.disabled);
            chai_1.expect(nggroup.length).to.equal(18);
        });
        it('only second set of angular extensions get enabled', function () {
            custom.supported.push({
                icon: 'ng_component_ts2',
                extensions: ['component.ts'],
                format: 'svg',
            }, {
                icon: 'ng_component_js2',
                extensions: ['component.js'],
                format: 'svg',
            }, {
                icon: 'ng_smart_component_ts2',
                extensions: ['page.ts', 'container.ts'],
                format: 'svg',
            }, {
                icon: 'ng_smart_component_js2',
                extensions: ['page.js', 'container.js'],
                format: 'svg',
            }, {
                icon: 'ng_directive_ts2',
                extensions: ['directive.ts'],
                format: 'svg',
            }, {
                icon: 'ng_directive_js2',
                extensions: ['directive.js'],
                format: 'svg',
            }, { icon: 'ng_pipe_ts2', extensions: ['pipe.ts'], format: 'svg' }, { icon: 'ng_pipe_js2', extensions: ['pipe.js'], format: 'svg' }, { icon: 'ng_service_ts2', extensions: ['service.ts'], format: 'svg' }, { icon: 'ng_service_js2', extensions: ['service.js'], format: 'svg' }, { icon: 'ng_module_ts2', extensions: ['module.ts'], format: 'svg' }, { icon: 'ng_module_js2', extensions: ['module.js'], format: 'svg' }, { icon: 'ng_routing_ts2', extensions: ['routing.ts'], format: 'svg' }, { icon: 'ng_routing_js2', extensions: ['routing.js'], format: 'svg' }, {
                icon: 'ng_routing_ts2',
                extensions: ['app-routing.module.ts'],
                filename: true,
                format: 'svg',
            }, {
                icon: 'ng_routing_js2',
                extensions: ['app-routing.module.js'],
                filename: true,
                format: 'svg',
            });
            const result = iconManifest.toggleAngularPreset(false, custom);
            const ngGroup = result.supported.filter(x => /^ng_.*2$/.test(x.icon) && !x.disabled);
            chai_1.expect(ngGroup.length).to.equal(16);
        });
        it('all angular extensions are disabled even if duplicity is present', function () {
            custom.supported.push({ icon: 'ng_routing_ts', extensions: ['routing.ts'], format: 'svg' }, { icon: 'ng_routing_js', extensions: ['routing.js'], format: 'svg' }, {
                icon: 'ng_routing_ts',
                extensions: ['app-routing.module.ts'],
                filename: true,
                format: 'svg',
            }, {
                icon: 'ng_routing_js',
                extensions: ['app-routing.module.js'],
                filename: true,
                format: 'svg',
            });
            const result = iconManifest.toggleAngularPreset(true, custom);
            const ngGroup = result.supported.filter(x => x.icon.startsWith('ng_') && x.disabled);
            chai_1.expect(ngGroup.length).to.equal(4);
        });
        it('JS official extension is enabled', function () {
            const result = iconManifest.toggleOfficialIconsPreset(false, custom, [models_1.IconNames.jsOfficial], ['js']);
            const official = result.supported.find(x => x.icon === models_1.IconNames.jsOfficial);
            const unofficial = result.supported.find(x => x.icon === 'js');
            chai_1.expect(official.disabled).to.be.false;
            chai_1.expect(unofficial.disabled).to.be.true;
        });
        it('JS official extension toggling forth and back is working properly', function () {
            let official;
            let unofficial;
            const toggle = (disable) => {
                const result = iconManifest.toggleOfficialIconsPreset(disable, custom, [models_1.IconNames.jsOfficial], ['js']);
                official = result.supported.find(x => x.icon === models_1.IconNames.jsOfficial);
                unofficial = result.supported.find(x => x.icon === 'js');
            };
            toggle(false);
            chai_1.expect(official.disabled).to.be.false;
            chai_1.expect(unofficial.disabled).to.be.true;
            toggle(true);
            chai_1.expect(official.disabled).to.be.true;
            chai_1.expect(unofficial.disabled).to.be.false;
        });
        it('TS official extension is enabled', function () {
            const result = iconManifest.toggleOfficialIconsPreset(false, custom, [models_1.IconNames.tsOfficial, 'typescriptdef_official'], ['typescript', 'typescriptdef']);
            const official = result.supported.find(x => x.icon === models_1.IconNames.tsOfficial);
            const unofficial = result.supported.find(x => x.icon === 'typescript');
            const officialDef = result.supported.find(x => x.icon === 'typescriptdef_official');
            const unofficialDef = result.supported.find(x => x.icon === 'typescriptdef');
            chai_1.expect(official.disabled).to.be.false;
            chai_1.expect(unofficial.disabled).to.be.true;
            chai_1.expect(officialDef.disabled).to.be.false;
            chai_1.expect(unofficialDef.disabled).to.be.true;
        });
        it('TS official extension toggling forth and back is working properly', function () {
            let official;
            let unofficial;
            let officialDef;
            let unofficialDef;
            const toggle = (disable) => {
                const result = iconManifest.toggleOfficialIconsPreset(disable, custom, [models_1.IconNames.tsOfficial, 'typescriptdef_official'], ['typescript', 'typescriptdef']);
                official = result.supported.find(x => x.icon === models_1.IconNames.tsOfficial);
                unofficial = result.supported.find(x => x.icon === 'typescript');
                officialDef = result.supported.find(x => x.icon === 'typescriptdef_official');
                unofficialDef = result.supported.find(x => x.icon === 'typescriptdef');
            };
            toggle(false);
            chai_1.expect(official.disabled).to.be.false;
            chai_1.expect(unofficial.disabled).to.be.true;
            chai_1.expect(officialDef.disabled).to.be.false;
            chai_1.expect(unofficialDef.disabled).to.be.true;
            toggle(true);
            chai_1.expect(official.disabled).to.be.true;
            chai_1.expect(unofficial.disabled).to.be.false;
            chai_1.expect(officialDef.disabled).to.be.true;
            chai_1.expect(unofficialDef.disabled).to.be.false;
        });
        it('JSON official extension is enabled', function () {
            const result = iconManifest.toggleOfficialIconsPreset(false, custom, [models_1.IconNames.jsonOfficial], ['json']);
            const official = result.supported.find(x => x.icon === models_1.IconNames.jsonOfficial);
            const unofficial = result.supported.find(x => x.icon === 'json');
            chai_1.expect(official.disabled).to.be.false;
            chai_1.expect(unofficial.disabled).to.be.true;
        });
        it('JSON official extension toggling forth and back is working properly', function () {
            let official;
            let unofficial;
            const toggle = (disable) => {
                const result = iconManifest.toggleOfficialIconsPreset(disable, custom, [models_1.IconNames.jsonOfficial], ['json']);
                official = result.supported.find(x => x.icon === models_1.IconNames.jsonOfficial);
                unofficial = result.supported.find(x => x.icon === 'json');
            };
            toggle(false);
            chai_1.expect(official.disabled).to.be.false;
            chai_1.expect(unofficial.disabled).to.be.true;
            toggle(true);
            chai_1.expect(official.disabled).to.be.true;
            chai_1.expect(unofficial.disabled).to.be.false;
        });
        context('hide folders preset', function () {
            it('hides all folders', function () {
                supportedFolders_1.extensions.default.folder_light = {
                    icon: 'folderIconLight',
                    format: 'svg',
                };
                supportedFolders_1.extensions.default.root_folder_light = {
                    icon: 'rootFolderIconLight',
                    format: 'svg',
                };
                const result = iconManifest.toggleHideFoldersPreset(true, supportedFolders_1.extensions);
                const supported = result.supported.find(x => x.icon === 'aws');
                chai_1.expect(supported.disabled).to.be.true;
                chai_1.expect(result.default.folder.disabled).to.be.true;
                chai_1.expect(result.default.folder_light.disabled).to.be.true;
                chai_1.expect(result.default.root_folder.disabled).to.be.true;
                chai_1.expect(result.default.root_folder_light.disabled).to.be.true;
            });
            it('toggling forth and back is working properly', function () {
                supportedFolders_1.extensions.default.folder_light = {
                    icon: 'folderIconLight',
                    format: 'svg',
                };
                supportedFolders_1.extensions.default.root_folder_light = {
                    icon: 'rootFolderIconLight',
                    format: 'svg',
                };
                let result;
                let supported;
                const toggle = (disable) => {
                    result = iconManifest.toggleHideFoldersPreset(disable, supportedFolders_1.extensions);
                    supported = result.supported.find(x => x.icon === 'aws');
                };
                toggle(true);
                chai_1.expect(supported.disabled).to.be.true;
                chai_1.expect(result.default.folder.disabled).to.be.true;
                chai_1.expect(result.default.folder_light.disabled).to.be.true;
                chai_1.expect(result.default.root_folder.disabled).to.be.true;
                chai_1.expect(result.default.root_folder_light.disabled).to.be.true;
                toggle(false);
                chai_1.expect(supported.disabled).to.be.false;
                chai_1.expect(result.default.folder.disabled).to.be.false;
                chai_1.expect(result.default.folder_light.disabled).to.be.false;
                chai_1.expect(result.default.root_folder.disabled).to.be.false;
                chai_1.expect(result.default.root_folder_light.disabled).to.be.false;
            });
            it('hides all folders even custom ones', function () {
                custom.default = {
                    folder: null,
                    folder_light: null,
                    root_folder: null,
                    root_folder_light: null,
                };
                custom.supported.push({
                    icon: 'newExt',
                    extensions: ['aws'],
                    format: 'svg',
                });
                const result = iconManifest.toggleHideFoldersPreset(true, custom);
                const supported = result.supported.find(x => x.icon === 'newExt');
                chai_1.expect(supported.disabled).to.be.true;
                chai_1.expect(result.default.folder).to.be.null;
                chai_1.expect(result.default.folder_light).to.be.null;
                chai_1.expect(result.default.root_folder).to.be.null;
                chai_1.expect(result.default.root_folder_light).to.be.null;
            });
        });
        context('folders all default icon preset', function () {
            it('shows all folders with the default folder icon', function () {
                supportedFolders_1.extensions.default.folder_light = {
                    icon: 'folderIconLight',
                    format: 'svg',
                };
                supportedFolders_1.extensions.default.root_folder_light = {
                    icon: 'rootFolderIconLight',
                    format: 'svg',
                };
                const result = iconManifest.toggleFoldersAllDefaultIconPreset(true, supportedFolders_1.extensions);
                const supported = result.supported.find(x => x.icon === 'aws');
                chai_1.expect(supported.disabled).to.be.true;
                chai_1.expect(result.default.root_folder.disabled).to.be.false;
                chai_1.expect(result.default.root_folder_light.disabled).to.be.false;
                chai_1.expect(result.default.folder.disabled).to.be.false;
                chai_1.expect(result.default.folder_light.disabled).to.be.false;
            });
            it('toggling forth and back is working properly', function () {
                supportedFolders_1.extensions.default.folder_light = {
                    icon: 'folderIconLight',
                    format: 'svg',
                };
                supportedFolders_1.extensions.default.root_folder_light = {
                    icon: 'rootFolderIconLight',
                    format: 'svg',
                };
                let result;
                let supported;
                const toggle = (disable) => {
                    result = iconManifest.toggleFoldersAllDefaultIconPreset(disable, supportedFolders_1.extensions);
                    supported = result.supported.find(x => x.icon === 'aws');
                };
                toggle(true);
                chai_1.expect(supported.disabled).to.be.true;
                chai_1.expect(result.default.root_folder.disabled).to.be.false;
                chai_1.expect(result.default.root_folder_light.disabled).to.be.false;
                chai_1.expect(result.default.folder.disabled).to.be.false;
                chai_1.expect(result.default.folder_light.disabled).to.be.false;
                toggle(false);
                chai_1.expect(supported.disabled).to.be.false;
                chai_1.expect(result.default.root_folder.disabled).to.be.false;
                chai_1.expect(result.default.root_folder_light.disabled).to.be.false;
                chai_1.expect(result.default.folder.disabled).to.be.false;
                chai_1.expect(result.default.folder_light.disabled).to.be.false;
            });
            it('shows all folders with the default folder icon even custom ones', function () {
                custom.default = {
                    folder: null,
                    folder_light: null,
                    root_folder: null,
                    root_folder_light: null,
                };
                custom.supported.push({
                    icon: 'newExt',
                    extensions: ['aws'],
                    format: 'svg',
                });
                const result = iconManifest.toggleFoldersAllDefaultIconPreset(true, custom);
                const supported = result.supported.find(x => x.icon === 'newExt');
                chai_1.expect(supported.disabled).to.be.true;
                chai_1.expect(result.default.folder).to.be.null;
                chai_1.expect(result.default.folder_light).to.be.null;
                chai_1.expect(result.default.root_folder).to.be.null;
                chai_1.expect(result.default.root_folder_light).to.be.null;
            });
        });
    });
});
//# sourceMappingURL=presets.test.js.map