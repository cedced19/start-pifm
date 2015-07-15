$(document).ready(function () {
    $.material.init();
    var fs = require('fs'),
        path = require('path'),
        file = path.dirname(process.execPath) + '\\config.json',
        message = $('#message'),
        button = $('#end'),
        form =$('#form');

    var launch = function () {
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

    if (!fs.existsSync(file)) {
        form.show();

       $('#form-submit').click(function (e) {
            e.preventDefault();
            if ($('#form')[0].checkValidity()) {
                fs.writeFile(file, JSON.stringify({
                        ip: $('#form-ip').val(),
                        user: $('#form-username').val(),
                        pass: $('#form-password').val(),
                        command: $('#form-command').val()
                }), function (err) {
                    if (err) {
                        message.html('An error occurred!');
                    } else {
                        $('#form').hide();
                        launch();
                    }
                 });
            }
        });
    } else {
        launch();
    }

});

