# Webpack
Webpack is a module bundler. It takes javascript modules with dependencies and generates static assets representing those modules.

Webpack has a provides us with a server for local development and also compiles our code and assets into javascript bundles for deployment. We also use various 'loaders' and 'plugins' provided by webpack to transpile our ES6/7 suorce code into browser compatible javascript and run optimisations.

There are 2 setups that we maintain for webpack: `config/webpack.config.js` and `config/compilers/style/webpack.config.js`.

## config/webpack.config.js setup
When you run the following scripts: `npm run build | npm start`, webpack will derive it configuration from: `webpack.config.js`

#### npm run build

Creates `manifest.json`, `vendor` and `react-mdoules` hashed bundles which are used by PH-Enterprise. The build process resolves all dependencies from **`src/index.js`**.

`manifest.json` - holds hashed names for bundles, used by PH-Enterprise caching purposes.

Example manifest.json file:
```
{
  "react-modules.js": "/react-modules/react-modules.45fef2eed94a7aa07417.js",
  "vendors.js": "/react-modules/vendors.45fef2eed94a7aa07417.js"
}
```
`vendor.[hash].js` - holds all application dependancies like React, Stilo...

`react-modules.[hash].js` - holds the application code

Takes configuration from `config.js` and `loadersConfig.js` files. (for more information see below)

#### npm start

Runs the web server on `localhost:8080`. All application dependencies are resolved from **`development/index.js`**.

Takes configuration from `config.js`, `devServerConfig.js` and `loadersConfig.js` files. (for more information see below)

#### Configuration files
`config.js` - Configures the development server and sets up environment variables. This file can be overwritten with specific variable from  `config.production.json` or `config.development.json` depending on the environment.

`loadersConfig.js` - This is where babel transpiler, json loader, image loaders are defined and where styles are removed from source code.

`devServerConfig.js` - Configures a proxy to access the backend api. Enables loading theme bundles from `build/styles` directory.

## /config/compilers/style/webpack.config.js setup
```
compilers/style/webpack.config.js
```
Provides the `npm run pack-styles` command.

This setup populates most of the files in the `/build` directory.

Reads through EV3 directories and creates a list of `exports` to create the `build/EV3Apps.js`.

Reads the EV3 `styles/networks` directory and writes a theme bundle for each network into the `build/styles/` directory.

Copies EV2 assets into the `build/EV2/` directory, and generates a list of theme names which is written to `build/EV2CssMap.json`
