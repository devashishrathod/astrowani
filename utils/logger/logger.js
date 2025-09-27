// const log4js = require("log4js");
// const value = require("./log4js_configuration.json");

// log4js.configure(value);

// exports.logger = log4js;

const log4js = require("log4js");
const path = require("path");
const fs = require("fs");

// Ensure logs directory exists
const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Load config
const value = require("./log4js_configuration.json");

// Resolve relative filenames inside config
for (const appender in value.appenders) {
  if (value.appenders[appender].filename) {
    value.appenders[appender].filename = path.join(
      logsDir,
      path.basename(value.appenders[appender].filename)
    );
  }
}

log4js.configure(value);

exports.logger = log4js;
