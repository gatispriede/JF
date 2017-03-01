const variables = require('./config.js');
/*
    Webpack proxies all requests to the vagrant box
    Requests to '/assets' need to be proxied to phgma.dev (or equivalent)
    All other requests are assumed to be api call and directed to api.dev
 */
(function () {
    module.exports = {
        //--hot --inline --history - api - fallback--content- base.
        contentBase: './',  //Relative directory for base of server
        hot: true,
        inline: true,
        host: variables.get('devServer.host'),
        port: variables.get('devServer.port'),
        proxy: {
            '/assets/*': {
                target: {
                    'host': variables.get('web.host'),
                    'protocol': variables.get('web.protocol'),
                    'port': variables.get('web.port')
                },
                changeOrigin: true,
                secure: false,
                logLevel: 'debug'
            },
            '**': {
                target: {
                    'host': variables.get('api.host'),
                    'protocol': variables.get('api.protocol'),
                    'port': variables.get('api.port')
                },
                changeOrigin: true,
                secure: false,
                logLevel: 'debug'
            }
        },
        historyApiFallback: true,
        noInfo: false
    };
}());