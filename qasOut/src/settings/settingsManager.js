"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = require("semver");
const errorHandler_1 = require("../common/errorHandler");
const fsAsync_1 = require("../common/fsAsync");
const constants_1 = require("../constants");
const models_1 = require("../models");
const utils_1 = require("../utils");
class SettingsManager {
    constructor(vscodeManager) {
        this.vscodeManager = vscodeManager;
        if (!vscodeManager) {
            throw new ReferenceError(`'vscodeManager' not set to an instance`);
        }
    }
    get isNewVersion() {
        return semver_1.lt(this.getState().version, constants_1.constants.extension.version);
    }
    getState() {
        const state = this.vscodeManager.context.globalState.get(constants_1.constants.vsicons.name);
        return state || SettingsManager.defaultState;
    }
    setState(state) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.vscodeManager.context.globalState.update(constants_1.constants.vsicons.name, state);
            }
            catch (reason) {
                errorHandler_1.ErrorHandler.logError(reason);
            }
        });
    }
    updateStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = this.getState();
            state.version = constants_1.constants.extension.version;
            state.status = status == null ? state.status : status;
            state.welcomeShown = true;
            yield this.setState(state);
            return state;
        });
    }
    deleteState() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.vscodeManager.context.globalState.update(constants_1.constants.vsicons.name, undefined);
            }
            catch (error) {
                errorHandler_1.ErrorHandler.logError(error);
            }
        });
    }
    moveStateFromLegacyPlace() {
        return __awaiter(this, void 0, void 0, function* () {
            // read state from legacy place
            const state = yield this.getStateLegacy();
            // state not found in legacy place
            if (semver_1.eq(state.version, SettingsManager.defaultState.version)) {
                return;
            }
            // store in new place: 'globalState'
            yield this.setState(state);
            // delete state from legacy place
            return this.deleteStateLegacy();
        });
    }
    /** Obsolete */
    getStateLegacy() {
        return __awaiter(this, void 0, void 0, function* () {
            const extensionSettingsLegacyFilePath = utils_1.Utils.pathUnixJoin(this.vscodeManager.getAppUserDirPath(), constants_1.constants.extension.settingsFilename);
            const pathExists = yield fsAsync_1.existsAsync(extensionSettingsLegacyFilePath);
            if (!pathExists) {
                return SettingsManager.defaultState;
            }
            try {
                const state = yield fsAsync_1.readFileAsync(extensionSettingsLegacyFilePath, 'utf8');
                return utils_1.Utils.parseJSON(state) || SettingsManager.defaultState;
            }
            catch (error) {
                errorHandler_1.ErrorHandler.logError(error, true);
                return SettingsManager.defaultState;
            }
        });
    }
    /** Obsolete */
    deleteStateLegacy() {
        return __awaiter(this, void 0, void 0, function* () {
            const extensionSettingsLegacyFilePath = utils_1.Utils.pathUnixJoin(this.vscodeManager.getAppUserDirPath(), constants_1.constants.extension.settingsFilename);
            try {
                yield fsAsync_1.unlinkAsync(extensionSettingsLegacyFilePath);
            }
            catch (error) {
                errorHandler_1.ErrorHandler.logError(error);
            }
        });
    }
}
exports.SettingsManager = SettingsManager;
SettingsManager.defaultState = {
    version: '0.0.0',
    status: models_1.ExtensionStatus.deactivated,
    welcomeShown: false,
};
//# sourceMappingURL=settingsManager.js.map