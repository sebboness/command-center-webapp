const compose = require("next-compose");
const webpack = require("webpack");
const withCSS = require("@zeit/next-css");
const withTypescript = require('@zeit/next-typescript')

require("dotenv").config();
const path = require("path");
const Dotenv = require("dotenv-webpack");

console.log("building...", process.env.NODE_ENV);

module.exports = withCSS(
    withTypescript({
        webpack(config, options) {
            //config.plugins = config.plugins || [];
            config.plugins = [
                ...config.plugins,
                new Dotenv({
                    defaults: true,
                    path: path.join(__dirname, ".env"),
                    systemvars: true
                }),
                new webpack.IgnorePlugin(/^encoding$/)
            ];
            config.node = {
                fs: "empty"
            };
            return config;
        }
    })
)