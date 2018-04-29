'use strict';

const { fork } = require('child_process');
const { Stream } = require('stream');
const pump = require('pump');
const through = require('through2');

module.exports = (configuration) => {
    if (!configuration || !Array.isArray(configuration)) {
        // No valid configuration provided. Passthrough to stdout.
        return process.stdout;
    }

    let outputs = [];

    // Validate each output config
    configuration.forEach(output => {
        if (output instanceof Stream) {
            outputs.push({
                stream: output
            });
        }

        if (typeof output === 'string') {
            outputs.push({
                module: require.resolve(output)
            });
        }

        if (typeof output === 'object') {
            if (typeof output.module === 'string') {
                output.module = require.resolve(output.module);
            }

            outputs.push(output);
        }
    });

    const passThroughTransport = through.obj(function (chunk, enc, callback) {
        this.push(chunk);
        callback();
    });

    outputs.forEach(output => {
        if (output.stream !== undefined) {
            pump(passThroughTransport, output.stream);
        }

        if (output.module !== undefined) {
            output.child = fork(require.resolve(output.module), output.args || [], {
                stdio: ['pipe', process.stdout, process.stderr, 'ipc']
            });
            pump(passThroughTransport, output.child.stdin);
        }
    });

    return passThroughTransport;
}