var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'bulletin-board'
    },
    port: 3000,
    db: 'mysql://root:123123@localhost/bulletin_board'
  },

  test: {
    root: rootPath,
    app: {
      name: 'bulletin-board'
    },
    port: 3000,
    db: 'mysql://root:123123@localhost/bulletin_board'
  },

  production: {
    root: rootPath,
    app: {
      name: 'bulletin-board'
    },
    port: 3000,
    db: 'mysql://root:123123@localhost/bulletin_board'
  }
};

module.exports = config[env];
