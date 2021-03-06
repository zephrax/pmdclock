"use strict";

const PMDClient = require("../client");
const Session = require("../session");

module.exports = function () {

    var client = new PMDClient();

    client.on("connect", () => {
        client.cmd("finish")
            .then((info) => {
                var {finish, started} = info;
                var diffMs = finish - started;
                var delta = Math.round(
                    ((diffMs % 86400000) % 3600000) / 60000); // minutes


                if (info._type === Session.types.TYPE_TASK) {
                    process.stdout.write(
                        `Task finished! in ${delta} minutes\n`);
                } else {
                    process.stdout.write(`Rest finished at ${delta} minutes\n`);
                }
                process.exit(0);
            })
            .catch((e) => {
                process.stderr.write(`${e}\n`);
                process.exit(1);
            });
    });

    client.on("error", (e) => {
        process.stderr.write(`${e}\n`);
        process.exit(1);
    });

    try {
        client.connect();
    } catch (e) {
        process.stderr.write(`${e}\n`);
        process.exit(2);
    }

};
