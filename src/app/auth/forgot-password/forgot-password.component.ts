import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  @Input() page: 'sign-in' | 'sign-up' | 'forgot-password';
  @Output() pageChange: EventEmitter<
    'sign-in' | 'sign-up' | 'forgot-password'
  > = new EventEmitter<'sign-in' | 'sign-up' | 'forgot-password'>();
  formGroup: FormGroup;
  alert: Alert;

  constructor(public authAF: AngularFireAuth) {
    this.formGroup = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(5),
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
      const value: {
        email: string;
      } = this.formGroup.value;

      this.authAF
        .sendPasswordResetEmail(value.email)
        .then(
          () =>
            (this.alert = {
              color: 'success',
              message: `Se ha enviado un correo a <b>${value.email}</b> para que restaures tu contraseña.`,
            })
        )
        .catch((error) => {
          document.querySelector('#toTop').scrollIntoView({behavior:"smooth"});

          this.alert = {
            color: 'danger',
            message: error.message,
          };

          console.log(error);
        });
    }
  }
}
