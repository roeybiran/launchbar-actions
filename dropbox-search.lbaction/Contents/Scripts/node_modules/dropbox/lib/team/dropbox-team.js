'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropboxTeam = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dropbox = require('../dropbox');

var _dropboxBase = require('../dropbox-base');

var _routesTeam = require('../routes-team');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class DropboxTeam
 * @extends DropboxBase
 * @classdesc The Dropbox SDK class that provides access to team endpoints.
 * @arg {Object} options
 * @arg {String} [options.accessToken] - An access token for making authenticated
 * requests.
 * @arg {String} [options.clientId] - The client id for your app. Used to create
 * authentication URL.
 */
var DropboxTeam = exports.DropboxTeam = function (_DropboxBase) {
  _inherits(DropboxTeam, _DropboxBase);

  function DropboxTeam(options) {
    _classCallCheck(this, DropboxTeam);

    var _this = _possibleConstructorReturn(this, (DropboxTeam.__proto__ || Object.getPrototypeOf(DropboxTeam)).call(this, options));

    Object.assign(_this, _routesTeam.routes);
    return _this;
  }

  /**
   * Returns an instance of Dropbox that can make calls to user api endpoints on
   * behalf of the passed user id, using the team access token.
   * @arg {String} userId - The user id to use the Dropbox class as
   * @returns {Dropbox} An instance of Dropbox used to make calls to user api
   * endpoints
   */


  _createClass(DropboxTeam, [{
    key: 'actAsUser',
    value: function actAsUser(userId) {
      return new _dropbox.Dropbox({
        accessToken: this.accessToken,
        clientId: this.clientId,
        selectUser: userId
      });
    }
  }]);

  return DropboxTeam;
}(_dropboxBase.DropboxBase);