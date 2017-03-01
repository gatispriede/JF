(function () {
	const variables = require('./config.js');
	module.exports = [
		{
			test: /\.jsx?$/,
			// exclude: /node_modules/,
			include: [
				variables.get('paths.react.src'),
				variables.get('paths.react.development'),
				variables.get('paths.react.stilo'),
				variables.get('paths.react.build')
			],
			loader: 'babel-loader',
			options: {
				presets: ['react', 'es2015', 'stage-0']
			}
		},
		{
			test: /(\.scss$|\.less$\.css$)/,
			loader: 'ignore'
		},
		{
			test: /.*\.(gif|png|jpe?g|svg)$/i,
			use: [
				{
					loader: 'file',
					options: {
						hash:'sha512',
						digest:'hex',
						name: '[hash].[ext]'
					}
				},
				{
					loader: 'image-webpack',
					options: {
						optimizationLevel: 7,
						interlaced: false,
						pngquant: {
							quality: "65-90",
							speed: 4
						},
						mozjpeg: {
							quality: 65
						}
					}
				}
			]
		}
	];
}());