$(document).ready(function () {
    $.material.init();
    var fs = require('fs'),
        path = require('path'),
        file = path.dirname(process.execPath) + '\\config.json',
        message = $('#message'),
        button = $('#end');

    if (!fs.existsSync(file)) {
        fs.writeFile(file, JSON.stringify({
                ip: '192.168.0.78',
                user: 'root',
                pass: '****',
                command: 'node pifm-node.js'
            }), function (err) {
                message.html('Please, configure the file <b>' + file + '</b>.');
            });
    } else {
        fs.readFile(file, function (err, data) {
                var SSH = require('simple-ssh'),
                      data = JSON.parse(data);

                var ssh = new SSH({
                    host: data.ip,
                    user: data.user,
                    pass: data.pass
                });

                ssh.exec(data.command).start();

                message.html('Launched.');

                button.show();
                button.click(function () {
                        message.html('It\'ll be stopped ASAP.');
                        ssh.end();
                });
        });
    }

});

