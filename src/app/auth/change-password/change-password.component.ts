import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';

interface Alert {
  color: 'primary' | 'success' | 'warning' | 'danger';
  message: string;
}

function MatchPassword(control: AbstractControl) {
  let parent = control.parent;
  if (parent) {
    let password = parent.get('password').value;
    let confirmPassword = control.value;

    if (password != confirmPassword) {
      return { confirmPassword: true };
    } else {
      return null;
    }
  } else {
    return null;
  }
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  formGroup: FormGroup;
  alert: Alert;

  constructor(public auth: AngularFireAuth) {
    this.formGroup = new FormGroup({
      old_password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      password_confirm: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        MatchPassword,
      ]),
    });
  }

  get f(): {
    [key: string]: AbstractControl;
  } {
    return this.formGroup.controls;
  }

  ngOnInit(): void {}

  onSubmit(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.formGroup.valid) {
      const value = this.formGroup.value;
      console.log(value);

      this.auth.onAuthStateChanged((user: firebase.User) => {
        if (user) {
          this.auth
            .signInWithEmailAndPassword(user.email, value.old_password)
            .then((userCredential: firebase.auth.UserCredential) => {
              user
                .updatePassword(value.password)
                .then(() => {
                  const TIME_OUT_FX = setTimeout(() => {
                    document
                      .querySelector('#toTop')
                      .scrollIntoView({ behavior: 'smooth' });

                    clearTimeout(TIME_OUT_FX);
                  }, 1000);

                  this.alert = {
                    color: 'success',
                    message: 'Se ha cambiado su contraseña correctamente',
                  };
                })
                .catch((error) => {
                  const TIME_OUT_FX = setTimeout(() => {
                    document
                      .querySelector('#toTop')
                      .scrollIntoView({ behavior: 'smooth' });

                    clearTimeout(TIME_OUT_FX);
                  }, 1000);

                  this.alert = {
                    color: 'danger',
                    message: error.message,
                  };

                  console.error(error);
                });
            })
            .catch((error) => {
              const TIME_OUT_FX = setTimeout(() => {
                document
                  .querySelector('#toTop')
                  .scrollIntoView({ behavior: 'smooth' });

                clearTimeout(TIME_OUT_FX);
              }, 1000);

              this.alert = {
                color: 'danger',
                message: error.message,
              };

              console.error(error);
            });
        }
      });
      // this.authAF
      //   .createUserWithEmailAndPassword(value.email, value.password)
      //   .then((userCredential: firebase.auth.UserCredential) => {
      //     userCredential.user
      //       .sendEmailVerification()
      //       .then(() => {
      //         this.router.navigate(['/auth/email-verify/' + value.email]);
      //       })
      //       .catch(console.error);
      //   })
      //   .catch((error) => {
      //     const TIME_OUT_FX = setTimeout(() => {
      //       document
      //         .querySelector('#toTop')
      //         .scrollIntoView({ behavior: 'smooth' });

      //       clearTimeout(TIME_OUT_FX);
      //     }, 1000);

      //     this.alert = {
      //       color: 'danger',
      //       message: error.message,
      //     };

      //     console.error(error);

      //     this.router.navigate(['/auth/email-verify/']);
      //   });
    }
  }
}
