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
/* eslint-disable prefer-arrow-callback */
const debugger_1 = require("./common/debugger");
const constants_1 = require("./constants");
const models_1 = require("./models");
const compositionRootService_1 = require("./services/compositionRootService");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const crs = new compositionRootService_1.CompositionRootService(context);
        const extension = crs.get(models_1.SYMBOLS.IExtensionManager);
        yield extension.activate();
        if (!debugger_1.Debugger.isAttached) {
            // eslint-disable-next-line no-console
            console.info(`[${constants_1.constants.extension.name}] v${constants_1.constants.extension.version} activated!`);
        }
    });
}
exports.activate = activate;
// this method is called when your vscode is closed
function deactivate() {
    // no code here at the moment
}
exports.deactivate = deactivate;
//# sourceMappingURL=index.js.map