"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable max-line-length */
const models_1 = require("../../src/models");
exports.extensions = {
    default: {
        folder: { icon: 'folder', format: models_1.FileFormat.svg },
        root_folder: { icon: 'root_folder', format: models_1.FileFormat.svg },
    },
    supported: [
        { icon: 'aws', extensions: ['aws', '.aws'], format: models_1.FileFormat.svg },
    ],
};
//# sourceMappingURL=supportedFolders.js.map