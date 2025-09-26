const https = require('https');

exports.sendOTP = (mobile, var1, var2) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            template_id: '1207172007863021380',
            short_url: '0',
            recipients: [
                {
                    mobiles: mobile,
                    VAR1: var1,
                    VAR2: var2,
                },
            ],
        });

        const options = {
            hostname: 'control.msg91.com',
            path: '/api/v5/flow/',
            method: 'POST',
            headers: {
                authkey: '425583A42T5Z6TDkS66ed9e90P1',
                accept: 'application/json',
                'content-type': 'application/json',
            },
        };

        const req = https.request(options, (res) => {
            let chunks

            res.on('data', (chunk) => chunks?.push(chunk));
            res.on('end', () => {
                const body = Buffer?.concat(chunks)?.toString();
                resolve(body);
            });
        });

        req.on('error', (err) => reject(err));
        req.write(data);
        req.end();
    });
}