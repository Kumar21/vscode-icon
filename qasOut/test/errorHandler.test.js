"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable only-arrow-functions
// tslint:disable no-unused-expression
const chai_1 = require("chai");
const sinon = require("sinon");
const errorHandler_1 = require("../src/errorHandler");
describe('ErrorHandler: tests', function () {
    context('ensures that', function () {
        let sandbox;
        let consoleErrorStub;
        beforeEach(function () {
            sandbox = sinon.createSandbox();
            consoleErrorStub = sandbox.stub(console, 'error');
        });
        afterEach(function () {
            sandbox.restore();
        });
        context('it logs', function () {
            it('the error stack', function () {
                const error = new Error();
                error.stack = 'contextOfStack';
                errorHandler_1.ErrorHandler.logError(error);
                chai_1.expect(consoleErrorStub.called).to.be.true;
                chai_1.expect(consoleErrorStub.calledWithMatch(/contextOfStack/)).to.be.true;
                chai_1.expect(error)
                    .to.haveOwnProperty('stack')
                    .and.to.equal(error.stack);
            });
            it('the error message, when no error stack is available', function () {
                const error = new Error('message');
                delete error.stack;
                errorHandler_1.ErrorHandler.logError(error);
                chai_1.expect(consoleErrorStub.called).to.be.true;
                chai_1.expect(consoleErrorStub.calledWithMatch(/message/)).to.be.true;
                chai_1.expect(error).to.not.haveOwnProperty('stack').to.be.true;
            });
            it('the error itself, when no error stack and message are available', function () {
                const error = new Error();
                delete error.stack;
                delete error.message;
                errorHandler_1.ErrorHandler.logError(error);
                chai_1.expect(consoleErrorStub.called).to.be.true;
                chai_1.expect(error).to.not.haveOwnProperty('stack').to.be.true;
                chai_1.expect(error).to.not.haveOwnProperty('message').to.be.true;
            });
            it('handled errors', function () {
                const error = new Error();
                errorHandler_1.ErrorHandler.logError(error, true);
                chai_1.expect(consoleErrorStub.called).to.be.true;
                chai_1.expect(consoleErrorStub.calledWithMatch(/Handled/)).to.be.true;
            });
            it('unhandled errors', function () {
                const error = new Error();
                delete error.stack;
                delete error.message;
                errorHandler_1.ErrorHandler.logError(error);
                chai_1.expect(consoleErrorStub.called).to.be.true;
                chai_1.expect(consoleErrorStub.calledWithMatch(/Unhandled/)).to.be.true;
            });
        });
    });
});
//# sourceMappingURL=errorHandler.test.js.map