'use strict';
const convict = require('convict');
const path = require('path');

//determine environment
let environment = 'development';
if (process.env.npm_lifecycle_event == 'build') {
    environment = 'production';
}

function resolveApp(relativePath) {
    return path.resolve(__dirname, relativePath);
}
let configuration = {
    html: {
        template: resolveApp('./template.html')
    },
    paths: {
		app: {
			src: resolveApp('../app/src'),
			node_modules: resolveApp('../node_modules'),
			build: resolveApp('../build')
		},
		react: {
			// src: resolveApp('../src'),
			// development: resolveApp('../development'),
			// node_modules: resolveApp('../node_modules'),
			// stilo: resolveApp('../node_modules/stilo'),
			// build: resolveApp('../build'),
			// styles: resolveApp('../styles'),
        }
    },
    devServer: {
        host: {
            doc: 'Development Server host',
            format: ['0.0.0.0'],
            default: '0.0.0.0',
            arg: 'host'
        },
        port: {
            doc: 'The port to bind.',
            format: 'port',
			default: 3000,
            env: 'PORT'
        }
    },
    api: {
        host: {
            doc: 'Api host',
            default: 'api.dev',
            env: 'PH_API'
        },
        port: {
            doc: 'The port to bind.',
            format: 'port',
            default: 80
        },
        protocol: {
            doc: 'Default protocol for api',
            format: ['http:', 'https:'],
            default: 'http:'
        }
    },
    web: {
        host: {
            doc: 'Web host',
            default: 'phgma.dev',
            env: 'PH_WEB'
        },
        port: {
            doc: 'The port to bind.',
            format: 'port',
            default: 80
        },
        protocol: {
            doc: 'Default protocol for web',
            format: ['http:', 'https:'],
            default: 'http:'
        }
    }
};

if (environment == 'production' || environment == 'development') {
    configuration.env = environment;
    const overrides = require(`./config.${environment}.json`);
    configuration = Object.assign({}, configuration, overrides);
}

const conf = convict(configuration);

// Perform validation
conf.validate({strict: true});

module.exports = conf;
