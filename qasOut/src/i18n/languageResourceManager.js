"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const langResources = require("../../../lang.nls.bundle.json");
const constants_1 = require("../constants");
class LanguageResourceManager {
    constructor(locale) {
        this.locale = locale;
        this.defaultLangResource = langResources.en;
        this.currentLangResource =
            (this.locale && langResources[this.locale]) || this.defaultLangResource;
    }
    localize(...keys) {
        let msg = '';
        keys
            .filter((key) => key !== null && key !== undefined)
            .forEach((key) => {
            if (typeof key === 'number') {
                const resourceKey = key;
                if (this.currentLangResource.length > resourceKey) {
                    // If no message is found fallback to english message
                    let message = this.currentLangResource[resourceKey] ||
                        this.defaultLangResource[resourceKey];
                    // If not a string then it's of type IOSSpecific
                    if (typeof message !== 'string') {
                        if (Reflect.has(message, process.platform)) {
                            message = message[process.platform];
                        }
                        else {
                            throw new Error(`Not Implemented: ${process.platform}`);
                        }
                    }
                    msg += message;
                    return;
                }
                throw new Error(`Language resource key '${key}' is not valid`);
            }
            key.split('').forEach(char => {
                if (char.match(/[#^*|\\/{}+=]/g)) {
                    throw new Error(`${char} is not valid`);
                }
                msg += char;
            });
        });
        return msg.replace(/%extensionName%/gi, constants_1.constants.extension.name).trim();
    }
    getLangResourceKey(message) {
        if (!message) {
            return undefined;
        }
        const key = this.currentLangResource.findIndex(res => res === message);
        return key > -1 ? key : undefined;
    }
}
exports.LanguageResourceManager = LanguageResourceManager;
//# sourceMappingURL=languageResourceManager.js.map