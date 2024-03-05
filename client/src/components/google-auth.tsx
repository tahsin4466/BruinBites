import React, { useEffect } from 'react';

declare global {
  interface Window {
    gapi: any;
  }
}

const GoogleSignIn: React.FC = () => {
  useEffect(() => {
    const initClient = () => {
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: '1032108831904-nu6qkm5g3m3ghc9p3g2340bc9thcaaed.apps.googleusercontent.com',
        });
      });
    };
    initClient();
  }, []);

  const onSignIn = (googleUser: any) => {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    // Perform your actions with this profile information
  };

  const signOut = () => {
    var auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  };

  useEffect(() => {
    window.onSignIn = onSignIn; // Assign onSignIn function to window to make it accessible for Google's callback
  }, []);

  return (
    <div>
      <div className="g-signin2" data-onsuccess="onSignIn"></div>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default GoogleSignIn;
