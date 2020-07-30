import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

interface Alert {
  color: 'primary' | 'success' | 'warning' | 'danger';
  message: string;
}

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  @Input() page: 'sign-in' | 'sign-up' | 'forgot-password';
  @Output() pageChange: EventEmitter<
    'sign-in' | 'sign-up' | 'forgot-password'
  > = new EventEmitter<'sign-in' | 'sign-up' | 'forgot-password'>();
  formGroup: FormGroup;
  alert: Alert;

  constructor(public authAF: AngularFireAuth, private router: Router) {
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  onSubmit(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.formGroup.valid) {
      const value: {
        email: string;
        password: string;
      } = this.formGroup.value;

      this.authAF
        .signInWithEmailAndPassword(value.email, value.password)
        .then(() => this.router.navigate(['/dashboard']))
        .catch((error) => {
          if (document.querySelector('#toTop')) {
            document
              .querySelector('#toTop')
              .scrollIntoView({ behavior: 'smooth' });
          }

          this.alert = {
            color: 'danger',
            message: error.message,
          };

          console.log(error);
        });
    }
  }
}
