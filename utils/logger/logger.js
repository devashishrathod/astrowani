const log4js = require("log4js");
const value = require("./log4js_configuration.json");

log4js.configure(value);

exports.logger = log4js;
