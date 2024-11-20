// typings.d.ts
declare global {
  interface Window {
    recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  }
}

export {}; // This is required to make the file a module
