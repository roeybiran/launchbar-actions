'use strict';

var dropbox = require('./dropbox');
var dropboxTeam = require('./team/dropbox-team.js');

module.exports = {
  Dropbox: dropbox.Dropbox,
  DropboxTeam: dropboxTeam.DropboxTeam
};