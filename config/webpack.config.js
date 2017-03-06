'use strict';
const webpack = require('webpack');
const path = require('path');
//webpack plugins
// const validate = require('webpack-validator');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
// const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
//dev server configuration
const devServerConfig = require('./devServerConfig.js');
//loaders configuration
const loadersConfig = require('./loadersConfig.js');
const variables = require('./config.js');

// Ensure correct entry for app depending on environment
let entries = {};
if (variables.get('env') == 'development') {
	entries['app'] = variables.get('paths.app.src');
} else {
	entries['app'] = variables.get('paths.app.src');
}

//helper function to determine if module is external to application
function isExternal(module) {
	const userRequest = module.userRequest;

	if (typeof userRequest !== 'string' || userRequest.indexOf('node_modules\\stilo-toolbox') >= 0) {
		return false;
	}

	return userRequest.indexOf('bower_components') >= 0 ||
		userRequest.indexOf('node_modules') >= 0 ||
		userRequest.indexOf('libraries') >= 0;
}

let config = {
    resolve: {
        modules: [
            //allow webpack to parse react src and node_modules directories
			variables.get('paths.app.src'),
			variables.get('paths.app.node_modules')
        ]

    },
    entry: entries,
    output: {
		path: variables.get('paths.app.build'),
        //creates build/bundle.js
        filename: '[name].js'
    },
    module: {
        rules: loadersConfig
    },
    plugins: [
        //default plugins
        new  webpack.DefinePlugin({
            Test: '0',
            ENV: JSON.stringify(variables.get('env')),
            'process.env': {
                'NODE_ENV': JSON.stringify(variables.get('env'))
            }
        })
    ],
	cache: false,
    target: 'web'
};
if (variables.get('env') == 'production') {
	console.log('Production build!');
	//manifest plugins for creating manifest.json content
	config.plugins.push(new ManifestPlugin({
		fileName: "/app/manifest.json"
	}));
	//extracts stats for the build process with full details
	config.plugins.push(function () {
		this.plugin("done", function (stats) {
			require("fs").writeFileSync(
				path.join(__dirname, "../build", "stats.json"),
				JSON.stringify(stats.toJson()));
		});
	});
	//hash definition, we don't use it in development
	config.output.filename = '/app/[name].[hash].js';
	config.plugins.push(new WebpackMd5Hash());
	//chunk plugin creates bundle chunk
	config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
		name: 'app',
		minChunks: function(module, count) {
			return !isExternal(module) && count >= 2; // adjustable cond
		}
	}));
	config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
		name: 'vendors',
		minChunks: function(module) {
			return isExternal(module);
		}
	}));
	//production config additions
	//sqeezes the code, removes comments and uglifies to save space
	config.plugins.push(new webpack.optimize.UglifyJsPlugin({
		minimize: true,
		mangle: false,
		comments: false,
		compress: {
			warnings: false
		},
		drop_console: true
	}));
} else {
	//development config additions
	config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
		name: 'app',
		minChunks: Infinity
	}));
	config.plugins.push(new HtmlWebpackPlugin({
		template: path.resolve(__dirname, './template.html'),
		inject: 'body'
	}));
	config.plugins.push(new webpack.HotModuleReplacementPlugin());
	config.devServer = devServerConfig;
}
console.log(config.plugins);
module.exports = config;
