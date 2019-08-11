const mongoose = require('mongoose');
const Model = require('../util/Model');

module.exports = class DB {
  constructor(url, options = {}) {
    this._models = [];
    this.connection = mongoose.connection;
    if (typeof url !== 'string') {
      const text = `First argument must be a string. Instead got ${typeof url}`;
      throw new TypeError(text);
    }
    if (typeof options !== 'object') {
      const text = `Second argument must be an object. Instead got ${typeof options}`;
      throw new TypeError(text);
    }
    const defaultOptions = {
      useNewUrlParser: true,
      autoIndex: false,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4,
    };
    options = { ...defaultOptions, ...options };
    mongoose.connect(url, options);
    mongoose.set('useFindAndModify', false);
    mongoose.Promise = global.Promise;
    mongoose.connection.on('connected', async () => {
      console.log('Mongoose connection successfully opened\n');
    });
    mongoose.connection.on('err', err => {
      console.log(`Mongoose connection err:\n\n${err}\n`);
    });
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose connection disconnected\n');
    });
  }

  addModel(name, options) {
    if (typeof name !== 'string') {
      const text = `First argument must be a string. Instead got ${typeof name}`;
      throw new TypeError(text);
    }
    name = `${name.split('')[0].toUpperCase()}${name.slice(1).toLowerCase()}`;
    if (this._models.includes(name)) {
      const text = `Model with name ${name} already exists`;
      throw new ReferenceError(text);
    }
    if (typeof options !== 'object') {
      const text = `Second argument must be an object. Instead got ${typeof options}`;
      throw new TypeError(text);
    }
    const defaultOptions = {};
    for (const key in options) {
      if ({}.hasOwnProperty.call(options, key)) {
        defaultOptions[key] = options[key].default;
        options[key] = options[key].type;
      }
    }
    this._models.push(name);
    this[name] = new Model(name.toLowerCase(), options, defaultOptions);
  }
};
