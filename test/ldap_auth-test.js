/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla BrowserID.
 *
 * The Initial Developer of the Original Code is Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var vows = require("vows"),
    MozillaLDAP = require("../lib/ldap_auth"),
    assert = require("assert"),
    events = require("events");
    credentials = require("../credentials");

var username = credentials.username;
var usernameFull = credentials.usernameFull;
var password = credentials.password;

vows.describe("auth")
.addBatch({
  "authenticate with just username valid": {
    topic: function() {
      MozillaLDAP.bind(username, password, this.callback);
    },    

    "valid login": function(err, creds) {
      assert.ifError(err, "an error occurred authenticating a valid login");
    },

    "credentials are given to us": function(err, creds) {
      assert.ok(creds.username, 'A username is given to us');
      assert.ok(creds.username.indexOf('@') > -1, 'a full email address?');
      assert.ok(creds.password, 'A password is given to us');
    }
  }
})
.addBatch({
  "authenticate with username@mozilla.com valid": {
    topic: function() {
      MozillaLDAP.bind(usernameFull, password, this.callback);
    },    

    "valid login": function(err, creds) {
      assert.ifError(err, "an error occurred authenticating a valid login");
    },

    "credentials are given to us": function(err, creds) {
      assert.ok(creds.username, 'A username is given to us');
      assert.ok(creds.username.indexOf('@') > -1, 'a full email address?');
      assert.ok(creds.password, 'A password is given to us');
    }
  }
})
.addBatch({
  "authenticate invalid": {
    topic: function() {
      var promise = new events.EventEmitter();

      MozillaLDAP.bind("illegit", "badpass", function(err) {
        promise.emit("success", err);
      });

      return promise;
    },    
    "check return has error message": function(err) {
      assert.ok(err, "we indeed have an error");
    }
  },
})
.export(module);

