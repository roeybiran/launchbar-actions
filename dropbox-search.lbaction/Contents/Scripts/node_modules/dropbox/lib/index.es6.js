'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dropbox = require('./dropbox');

var _dropboxTeam = require('./team/dropbox-team');

exports.default = {
  Dropbox: _dropbox.Dropbox,
  DropboxTeam: _dropboxTeam.DropboxTeam
};