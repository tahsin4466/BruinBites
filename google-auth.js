//initialize authentication

gapi.load('auth2', function() 
{
    gapi.auth2.init(
    {
      client_id: '1032108831904-nu6qkm5g3m3ghc9p3g2340bc9thcaaed.apps.googleusercontent.com'
    });
  });
  
//sign on and off functions

function onSignIn(googleUser) 
{
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Name: ' + profile.getName());
}

function signOut() 
{
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}
  
