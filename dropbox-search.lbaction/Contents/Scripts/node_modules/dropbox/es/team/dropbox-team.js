import { Dropbox } from '../dropbox';
import { DropboxBase } from '../dropbox-base';
import { routes } from '../routes-team';

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
export var DropboxTeam = function (_DropboxBase) {
  babelHelpers.inherits(DropboxTeam, _DropboxBase);

  function DropboxTeam(options) {
    babelHelpers.classCallCheck(this, DropboxTeam);

    var _this = babelHelpers.possibleConstructorReturn(this, (DropboxTeam.__proto__ || Object.getPrototypeOf(DropboxTeam)).call(this, options));

    Object.assign(_this, routes);
    return _this;
  }

  /**
   * Returns an instance of Dropbox that can make calls to user api endpoints on
   * behalf of the passed user id, using the team access token.
   * @arg {String} userId - The user id to use the Dropbox class as
   * @returns {Dropbox} An instance of Dropbox used to make calls to user api
   * endpoints
   */


  babelHelpers.createClass(DropboxTeam, [{
    key: 'actAsUser',
    value: function actAsUser(userId) {
      return new Dropbox({
        accessToken: this.accessToken,
        clientId: this.clientId,
        selectUser: userId
      });
    }
  }]);
  return DropboxTeam;
}(DropboxBase);