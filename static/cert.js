

(function() {
  // Only make this available to W3C browsers
  if (document.addEventListener) {
    document.addEventListener("logout", function() {
      document.location = '/sign_out'; 
    }, false);
  }

  var username = navigator.id.username;
  if (username) {
    // First, register the verified email which gets a public key.
    navigator.id.registerVerifiedEmail(username, function(pubkey) {

      // secondly, get a certificate for the public key
      getCertificate(pubkey, function(certificate, updateURL, errorURL) {

        // thirdly, register the certificate
        navigator.id.registerVerifiedEmailCertificate(certificate, updateURL, 
          errorURL, function() {

        });
      });
    });
  }

  function getCertificate(pubkey, callback) {
    // Do something sly with the server to get a certificate
    if (callback) {
      callback();
    }
  }

}());

