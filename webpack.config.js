const webpack = require('webpack');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin-next');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const fs = require("fs");
const zip = require("@zip.js/zip.js");
const jsdoc = require("jsdoc-api");
const package = require("./package.json");

/* global require, module, process, __dirname */

const inDevServer = process.env.WEBPACK_DEV_SERVER || process.env.WEBPACK_SERVE;

function extractFiles(_folder, _filterFn) {
    return fs.readdirSync(_folder)
            .map(file => {
                let filePath = path.join(_folder, file);
                let stats = fs.statSync(filePath);
                if (stats.isFile()) {
                    if (_filterFn(filePath)) {
                        return filePath;
                    }
                } else if (stats.isDirectory()) {
                    return extractFiles(filePath, _filterFn);
                }
            }).filter(file => !!file).flat();
}

var stepActionSignaturesCache = undefined;

function extractStepActionSignatures(_folder) {
    if (!stepActionSignaturesCache) {
        console.log("提取步骤方法签名信息");
        let files = extractFiles(_folder, (filePath) => path.extname(filePath).toLowerCase() === ".js");
        let signatures = {};
        jsdoc.explainSync({files}).forEach((item) => {
            let itemTags = item.tags;
            if ((item.kind === "function") && itemTags?.find(e => e.originalTitle === "StepActionSignature")) {
                let meetOptional = false;
                let args = (item.params||[]).map((param, idx) => {
                    if (meetOptional !== !!param.optional) {
                        if (param.optional) {
                            meetOptional = true;
                        } else {
                            throw `\x1b[31;1m不允许在可选参数后面出现非可选参数, ${item.name}(.., ${param.name}, ...)\x1b[0m`;
                        }
                    }
                    let target = { name: param.name, variable: param.variable };
                    (param.optional) && (target.optional = true);
                    if ("defaultvalue" in param) {
                        target.optional = true;
                        target.defaulValue = param.defaultvalue;
                    }
                    let type = param.type?.names;
                    if (type) {
                        if (type.includes?.call(type, "Context")) {
                            target.isContext = true;
                        } else if (!type?.includes?.call(type, "*")) {
                            target.type = type;
                        }
                    }
                    let description = String(param.description||"");
                    let extOptionsIdx = description.indexOf("<<<");
                    if (extOptionsIdx >= 0) {
                        // console.log(description.substring(extOptionsIdx + 3).trim());
                        let extOptions = (new Function("return " + description.substring(extOptionsIdx + 3).trim()))();
                        description = description.substring(0, extOptionsIdx);
                        extOptions && (typeof extOptions === "object") && (target.options = extOptions);
                    }
                    target.description = description.replaceAll(/\r(?!\n)/ig, "\n").trim();
                    return target;
                });
                let returnType = Array.from(Object(item.yields || item.returns)).map(item => {
                    return item.type?.names?.map(e => {return {type: e, description: String(item.description||"").replaceAll(/\r(?!\n)/ig, "\n")}});
                }).flat().filter(item => !!item);
                (!(returnType?.length > 0)) && (returnType = undefined);
                let title = String(item.description||"").replaceAll(/\r(?!\n)/ig, "\n");
                let description = "";
                let descIdx = title.indexOf("\n");
                if (descIdx >= 0) {
                    description = title.substring(descIdx + 1).trim();
                    title = title.substring(0, descIdx).trim();
                }
                let category = itemTags?.find(e => e.originalTitle === "category");
                let autoRelationAction = itemTags?.find(e => e.originalTitle === "autoRelationWith");
                signatures[item.name] = {
                    name: item.name,
                    title,
                    description,
                    arguments: args,
                    returnType,
                    isIterator: (item.yields?.length > 0),
                    category: category?.text?.split("|")?.map(e => e.trim()) || [],
                    autoRelationAction: autoRelationAction?.text?.split("|")?.map(e => e.trim()),
                    hiddenForCustomer: !!itemTags?.find(e => e.originalTitle === "hiddenForCustomer"),
                    hideTitleInEditor: !!itemTags?.find(e => e.originalTitle === "hideTitleInEditor"),
                };
            }
        });
        stepActionSignaturesCache = JSON.stringify(signatures);

        console.log(Object.keys(signatures));
        // console.log(JSON.stringify(signatures));
        
        console.log(`\x1b[32;1m提取步骤方法签名信息已完成\x1b[0m`);
    }
    
    return stepActionSignaturesCache;
}

var BuildStampCache = undefined;

module.exports = async (env, options) => {
    const dev = options.mode === "development";
    const config = {
        devtool: "source-map",
        entry: {
            polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
            vendor: ["react", "react-dom", "core-js"],
            index: ["react-hot-loader/patch", "./src/index.js", "./src/index.html"]
        },
        output: {
            clean: true,
            path: path.join(__dirname, '.dist'),
            filename: '[name].js'
        },
        resolve: {
            extensions: [".ts", ".tsx", ".html", ".js"],
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    use: [
                        "react-hot-loader/webpack",
                        {
                            loader: "babel-loader",
                            options: {
                                presets: ["@babel/preset-env"],
                            },
                        },
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    use: [{
                        loader: 'style-loader',
                        options: {
                            insert: function (element, opt) {
                                document.head.appendChild(element);
                            },
                        },
                    }, 'css-loader']
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"],
                        },
                    },
                },
                {
                    test: /\.html$/,
                    exclude: /node_modules/,
                    use: "html-loader",
                },
                {
                    test: /\.(png|jpg|jpeg|gif|ico)$/,
                    type: "asset/resource",
                    generator: {
                        filename: "assets/[name][ext][query]",
                    },
                },
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                PackageName: `"${package.name}"`,
                BuildStamp: webpack.DefinePlugin.runtimeValue(() => (BuildStampCache === undefined ? (BuildStampCache = Date.now()): BuildStampCache), true),
                StepActionSignatures: webpack.DefinePlugin.runtimeValue(() => extractStepActionSignatures(path.join(__dirname, 'src')), true),
                __DEV_MODE__: dev
            }),
            new HtmlWebpackPlugin({
                filename: "index.html",
                template: "./src/index.html",
                chunks: ["polyfill", "vendor", "index"],
                inlineSource: '.(js|css)$' // 内联所有 javascript、css。
            }),
            (inDevServer ? { apply () {} } : new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin)),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "assets/*",
                        to: "assets/[name][ext][query]",
                    }
                ],
            }),
            new webpack.ProvidePlugin({
                Promise: ["es6-promise", "Promise"],
            }),
            {
                apply: (compiler) => {
                    compiler.hooks.done.tapPromise('endingDispose', async () => {
                        console.log("Ending Disposing");
                        stepActionSignaturesCache = undefined;
                        BuildStampCache = undefined;
                        console.log(`\x1b[32;1mEnding Disposed\x1b[0m`);
                    });
                }
            }
        ],
        devServer: {
            allowedHosts: ['localhost', 'test.season-studio.top'],
            static: {
                directory: path.join(__dirname, ".dist"),
                publicPath: "",
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            server: {
                type: "https",
                //options: env.WEBPACK_BUILD || options.https !== undefined ? options.https : await getHttpsOptions(),
                options: {
                    key: fs.readFileSync(path.join(__dirname, ".keys/test.season-studio.top.key")),
                    cert: fs.readFileSync(path.join(__dirname, ".keys/test.season-studio.top.pem"))
                }
            },
            port: process.env.npm_package_config_dev_server_port || 3000,
        },
        performance: {
            hints: false, // 枚举
            maxAssetSize: 30000000, // 整数类型（以字节为单位）
            maxEntrypointSize: 50000000, // 整数类型（以字节为单位）
            assetFilter: function (assetFilename) {
                // 提供资源文件名的断言函数
                return assetFilename.endsWith(".css") || assetFilename.endsWith(".js");
            }
        }
    };

    return config;
};
