const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
    mode: process.env.NODE_ENV || "development",

    // Enable sourcemaps for debugging webpack's output.
    devtool: (process.env.NODE_ENV !== "development") ? "source-map" : false,

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },

    entry: "./src/redirects-manager.tsx",
    output: {
        path: path.join(__dirname, "includes/js"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    optimization: {
        minimize: (!process.env.NODE_ENV || process.env.NODE_ENV === "development") ? false : true,
        minimizer: [
            new TerserPlugin({
                include: /\.js$/,
                extractComments: false,
                terserOptions: {
                    compress: {
                        warnings: false,
                    },
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
    },
};
