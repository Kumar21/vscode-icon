"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const Mocha = require("mocha");
const glob = require("glob");
exports.run = (testsRoot) => {
    const mocha = new Mocha({
        ui: 'bdd',
        timeout: 15000,
        useColors: true,
    });
    return new Promise((res, rej) => {
        glob('**/**.test.js', { cwd: testsRoot }, (error, files) => {
            if (error) {
                return rej(error);
            }
            try {
                // Fill into Mocha
                files.forEach((file) => mocha.addFile(path.join(testsRoot, file)));
                // Run the tests
                mocha.run(failures => {
                    if (failures > 0) {
                        rej(new Error(`${failures} tests failed.`));
                    }
                    else {
                        res();
                    }
                });
            }
            catch (err) {
                return rej(err);
            }
        });
    });
};
//# sourceMappingURL=index.js.map