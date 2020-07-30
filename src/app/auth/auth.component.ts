import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  page: 'sign-in' | 'sign-up' | 'forgot-password' = 'sign-in';

  constructor(private auth: AngularFireAuth, private router: Router) {}

  ngOnInit(): void {
    this.auth.currentUser.then((user: firebase.User) => {
      console.log('??? user', user);
      if (user && user.emailVerified) {
        this.router.navigate(['/dashboard']);
      }
    }).catch(console.error);
  }
}
