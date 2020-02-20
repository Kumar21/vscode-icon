"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable only-arrow-functions
// tslint:disable no-unused-expression
const chai_1 = require("chai");
const languageResourceManager_1 = require("../../src/i18n/languageResourceManager");
const langResourceCollection_1 = require("../../src/i18n/langResourceCollection");
const i18n_1 = require("../../src/models/i18n");
const packageJson = require("../../../package.json");
const nls = require("../../../package.nls.json");
const nlsTemplate = require("../../../package.nls.template.json");
describe('I18n: tests', function () {
    context('ensures that', function () {
        it('LangResourceKeys properties match ILangResource properties', function () {
            for (const key in i18n_1.LangResourceKeys) {
                // We only care about the enum members not the values
                if (isNaN(parseInt(key, 10))) {
                    chai_1.expect(Reflect.has(langResourceCollection_1.langResourceCollection.en, key)).to.be.true;
                }
            }
        });
        it('ILangResource properties match LangResourceKeys properties', function () {
            for (const key of Reflect.ownKeys(langResourceCollection_1.langResourceCollection.en)) {
                chai_1.expect(i18n_1.LangResourceKeys[key]).to.exist;
            }
        });
        context('OS specific messages', function () {
            let resourceCollection;
            let originalPlatform;
            before(() => {
                originalPlatform = process.platform;
                resourceCollection = {
                    test: {
                        welcome: {
                            darwin: 'Macintosh',
                            linux: 'Linux',
                            win32: 'Windows',
                        },
                    },
                };
            });
            after(() => {
                Object.defineProperty(process, 'platform', { value: originalPlatform });
            });
            context('are properly shown for', function () {
                it('osx (darwin)', function () {
                    Object.defineProperty(process, 'platform', { value: 'darwin' });
                    const msg = new languageResourceManager_1.LanguageResourceManager('test', resourceCollection).getMessage(i18n_1.LangResourceKeys.welcome);
                    chai_1.expect(msg).to.equal(resourceCollection.test.welcome[process.platform]);
                });
                it('linux', function () {
                    Object.defineProperty(process, 'platform', { value: 'linux' });
                    const msg = new languageResourceManager_1.LanguageResourceManager('test', resourceCollection).getMessage(i18n_1.LangResourceKeys.welcome);
                    chai_1.expect(msg).to.equal(resourceCollection.test.welcome[process.platform]);
                });
                it('win32 (windows)', function () {
                    Object.defineProperty(process, 'platform', { value: 'win32' });
                    const msg = new languageResourceManager_1.LanguageResourceManager('test', resourceCollection).getMessage(i18n_1.LangResourceKeys.welcome);
                    chai_1.expect(msg).to.equal(resourceCollection.test.welcome[process.platform]);
                });
            });
            it('will throw an error for not implemented platforms', function () {
                Object.defineProperty(process, 'platform', { value: 'freebsd' });
                const i18nManager = new languageResourceManager_1.LanguageResourceManager('test', resourceCollection);
                chai_1.expect(i18nManager.getMessage.bind(i18nManager, i18n_1.LangResourceKeys.welcome)).to.throw(Error, /Not Implemented/);
            });
        });
        it('a combination of resource and literal messages are properly shown', function () {
            const resourceCollection = {
                en: {
                    newVersion: 'brave flees',
                    restart: 'jumped over the fence',
                },
            };
            const literalString1 = '10';
            const literalString2 = ' ';
            const literalString3 = '!';
            const msg = new languageResourceManager_1.LanguageResourceManager('en', resourceCollection).getMessage(literalString1, literalString2, i18n_1.LangResourceKeys.newVersion, literalString2, i18n_1.LangResourceKeys.restart, literalString3);
            const expectedMsg = `${literalString1}${literalString2}${resourceCollection.en.newVersion}` +
                `${literalString2}${resourceCollection.en.restart}${literalString3}`;
            chai_1.expect(msg).to.equal(expectedMsg);
        });
        it('if a language resource does not exist, the English resource is used', function () {
            const resourceCollection = {
                en: {
                    restart: 'Test',
                },
            };
            const msg = new languageResourceManager_1.LanguageResourceManager('en', resourceCollection).getMessage(i18n_1.LangResourceKeys.restart);
            chai_1.expect(msg).to.equal(resourceCollection.en.restart);
        });
        it('if no message exists for the provided resource, the message of the English resource is used', function () {
            const resourceCollection = {
                lang: {
                    reload: '',
                },
            };
            const msg = new languageResourceManager_1.LanguageResourceManager('lang', resourceCollection).getMessage(i18n_1.LangResourceKeys.reload);
            chai_1.expect(msg).to.equal('Restart');
        });
        it('if an empty resource collection is provided, an empty string is returned', function () {
            const msg = new languageResourceManager_1.LanguageResourceManager('en', {}).getMessage(undefined);
            chai_1.expect(msg).to.equal('');
        });
        it('if no resource collection is provided, the default language resource collection is used', function () {
            const msg = new languageResourceManager_1.LanguageResourceManager('en', null).getMessage('Test');
            chai_1.expect(msg).to.equal('Test');
        });
        context('the message is properly shown for', function () {
            let resourceCollection;
            before(() => {
                resourceCollection = {
                    en: {
                        newVersion: '10 brave flees jumped ',
                        welcome: 'over the fence',
                    },
                };
            });
            it('a literal string', function () {
                const literalString = 'test';
                const msg = new languageResourceManager_1.LanguageResourceManager('en', resourceCollection).getMessage(literalString);
                chai_1.expect(msg).to.equal(literalString);
            });
            it('a literal string with punctuation marks', function () {
                const literalString = `test's can often fail. Or do they?`;
                const msg = new languageResourceManager_1.LanguageResourceManager('en', resourceCollection).getMessage(literalString);
                chai_1.expect(msg).to.equal(literalString);
            });
            it('an array of literal strings', function () {
                const literalString1 = '10';
                const literalString2 = ' brave flees jumped ';
                const literalString3 = 'over the fence.';
                const msg = new languageResourceManager_1.LanguageResourceManager('en', resourceCollection).getMessage(literalString1, literalString2, literalString3);
                chai_1.expect(msg).to.equal(`${literalString1}${literalString2}${literalString3}`);
            });
            it('an array of LangResourceKeys', function () {
                const msg = new languageResourceManager_1.LanguageResourceManager('en', resourceCollection).getMessage(i18n_1.LangResourceKeys.newVersion, ' ', i18n_1.LangResourceKeys.welcome);
                chai_1.expect(msg).to.equal(`${resourceCollection.en.newVersion} ${resourceCollection.en.welcome}`);
            });
            context('otherwise an error is thrown for invalid', function () {
                it('resource keys', function () {
                    const i18nManager = new languageResourceManager_1.LanguageResourceManager('en', resourceCollection);
                    chai_1.expect(i18nManager.getMessage.bind(i18nManager, i18n_1.LangResourceKeys.restart)).to.throw(Error, /is not valid/);
                });
                it('characters', function () {
                    const literalString = '#';
                    const i18nManager = new languageResourceManager_1.LanguageResourceManager('en', resourceCollection);
                    chai_1.expect(i18nManager.getMessage.bind(i18nManager, literalString)).to.throw(Error, /is not valid/);
                });
            });
        });
        context('each', function () {
            it('command title has an nls entry', function () {
                chai_1.expect(packageJson.contributes).to.exist;
                chai_1.expect(packageJson.contributes.commands).to.exist;
                chai_1.expect(packageJson.contributes.commands).to.be.an.instanceOf(Array);
                packageJson.contributes.commands.forEach(command => {
                    const title = command.title;
                    const nlsEntry = title.replace(/%/g, '');
                    chai_1.expect(title).to.exist;
                    chai_1.expect(title).to.be.a('string');
                    chai_1.expect(nls[nlsEntry]).to.exist;
                });
            });
            it('configuration title has an nls entry', function () {
                chai_1.expect(packageJson.contributes).to.exist;
                chai_1.expect(packageJson.contributes.configuration).to.exist;
                const title = packageJson.contributes.configuration.title;
                const nlsEntry = title.replace(/%/g, '');
                chai_1.expect(title).to.exist;
                chai_1.expect(title).to.be.a('string');
                chai_1.expect(nls[nlsEntry]).to.exist;
            });
            it('configuration description has an nls entry', function () {
                chai_1.expect(packageJson.contributes).to.exist;
                chai_1.expect(packageJson.contributes.configuration).to.exist;
                const properties = packageJson.contributes.configuration.properties;
                chai_1.expect(properties).to.exist;
                chai_1.expect(properties).to.be.an.instanceOf(Object);
                for (const prop of Reflect.ownKeys(properties)) {
                    const description = properties[prop].description;
                    const nlsEntry = description.replace(/%/g, '');
                    chai_1.expect(description).to.exist;
                    chai_1.expect(description).to.be.a('string');
                    chai_1.expect(nls[nlsEntry]).to.exist;
                }
            });
        });
        context('nls', function () {
            it('match nls template', function () {
                for (const key of Reflect.ownKeys(nls)) {
                    chai_1.expect(nlsTemplate[key]).to.exist;
                }
            });
            it('template match nls', function () {
                for (const key of Reflect.ownKeys(nlsTemplate)) {
                    chai_1.expect(nls[key]).to.exist;
                }
            });
        });
    });
});
//# sourceMappingURL=i18n.test.js.map