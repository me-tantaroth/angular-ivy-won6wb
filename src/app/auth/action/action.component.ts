import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
})
export class ActionComponent implements OnInit {
  mode: string;
  actionCode: string;
  continueUrl: string;
  lang: string;
  ui: 'verifyEmail' | 'recoverEmail' | 'recoverEmail' | 'resetPassword';
  config = {
    apiKey: 'AIzaSyDG-0vhHYA1nIQbYOM7NHsNUtkClL8pZVQ',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public afauth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    // Get the action to complete.
    this.mode = this.route.snapshot.queryParams.mode;
    // Get the one-time code from the query parameter.
    this.actionCode = this.route.snapshot.queryParams.oobCode;
    // (Optional) Get the continue URL from the query parameter if available.
    this.continueUrl = this.route.snapshot.queryParams.continueUrl;
    // (Optional) Get the language code if available.
    this.lang = this.route.snapshot.queryParams.lang || 'es-419';

    switch (this.mode) {
      case 'resetPassword':
        // Display reset password handler and UI.
        this.ui = 'resetPassword';
        break;
      case 'recoverEmail':
        // Display email recovery handler and UI.
        this.ui = 'recoverEmail';
        this.handleRecoverEmail(this.afauth, this.actionCode, this.lang);
        break;
      case 'verifyEmail':
        // Display email verification handler and UI.
        this.ui = 'verifyEmail';
        this.handleVerifyEmail(
          this.afauth,
          this.actionCode,
          this.continueUrl,
          this.lang
        );
        break;
      default:
      // Error: invalid mode.
    }
  }

  handleResetPassword(
    afauth,
    actionCode: string,
    continueUrl: string,
    lang: string,
    newPassword: string
  ) {
    // Localize the UI to the selected language as determined by the lang
    // parameter.
    let accountEmail;
    // Verify the password reset code is valid.
    afauth
      .verifyPasswordResetCode(actionCode)
      .then((email) => {
        accountEmail = email;

        // TODO: Show the reset screen with the user's email and ask the user for
        // the new password.

        // Save the new password.
        afauth
          .confirmPasswordReset(actionCode, newPassword)
          .then((resp) => {
            // Password reset has been confirmed and new password updated.
            // TODO: Display a link back to the app, or sign-in the user directly
            // if the page belongs to the same domain as the app:
            // auth.signInWithEmailAndPassword(accountEmail, newPassword);
            // TODO: If a continue URL is available, display a button which on
            // click redirects the user back to the app via continueUrl with
            // additional state determined from that URL's parameters.
            console.log('>>> continueUrl', continueUrl);
            if (continueUrl) {
              location.href = continueUrl;
            } else {
              this.router.navigate(['/auth']);
            }
          })
          .catch((error) => {
            // Error occurred during confirmation. The code might have expired or the
            // password is too weak.
            alert('Tienes que usar otro link para recuperar tu contraseña');
            this.router.navigate(['/auth']);
          });
      })
      .catch((error) => {
        // Invalid or expired action code. Ask user to try to reset the password
        // again.
        alert('Tienes que usar otro link para recuperar tu contraseña');
        this.router.navigate(['/auth']);
      });
  }

  handleRecoverEmail(afauth, actionCode, lang) {
    // Localize the UI to the selected language as determined by the lang
    // parameter.
    let restoredEmail = null;
    // Confirm the action code is valid.
    afauth
      .checkActionCode(actionCode)
      .then((info) => {
        // Get the restored email address.
        restoredEmail = info.data.email;

        // Revert to the old email.
        return afauth.applyActionCode(actionCode);
      })
      .then(() => {
        // Account email reverted to restoredEmail

        // TODO: Display a confirmation message to the user.

        // You might also want to give the user the option to reset their password
        // in case the account was compromised:
        afauth
          .sendPasswordResetEmail(restoredEmail)
          .then(() => {
            this.router.navigate(['/auth/email-verify', restoredEmail]);
          })
          .catch((error) => {
            // Error encountered while sending password reset code.
          });
      })
      .catch((error) => {
        // Invalid code.
      });
  }

  handleVerifyEmail(afauth, actionCode, continueUrl, lang) {
    // Localize the UI to the selected language as determined by the lang
    // parameter.
    // Try to apply the email verification code.
    afauth
      .applyActionCode(actionCode)
      .then((resp) => {
        console.log('>>> resp', resp);
        // Email address has been verified.
        // TODO: Display a confirmation message to the user.
        // You could also provide the user with a link back to the app.
        // TODO: If a continue URL is available, display a button which on
        // click redirects the user back to the app via continueUrl with
        // additional state determined from that URL's parameters.
      })
      .catch((error) => {
        console.error('>>> error', error);
        // Code is invalid or expired. Ask the user to verify their email address
        // again.
      });
  }

  onResetPassword(event: Event, newPassword: string) {
    event.stopPropagation();
    event.preventDefault();

    if (newPassword.length > 0) {
      this.handleResetPassword(
        this.afauth,
        this.actionCode,
        this.continueUrl,
        this.lang,
        newPassword
      );
    }
  }
}
