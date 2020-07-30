import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserModel } from '../shared/models/user.model';

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.scss'],
})
export class EmailVerifyComponent implements OnInit {
  private usersCollection: AngularFirestoreCollection<UserModel>;
  private leader: string;
  private affiliate: string;
  private affiliateName: string;
  email: string;

  constructor(
    afs: AngularFirestore,
    public auth: AngularFireAuth,
    public router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this.leader = localStorage.getItem('leader');
    this.affiliate = localStorage.getItem('affiliate');
    this.affiliateName = localStorage.getItem('affiliateName');

    this.usersCollection = afs.collection<UserModel>('users');

    this.auth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.usersCollection
          .doc(user.uid)
          .valueChanges()
          .subscribe((userAffiliated: UserModel) => {
            console.log('>>> userAffiliated', userAffiliated.affiliate);
            afs
              .doc(userAffiliated.affiliate)
              .valueChanges()
              .subscribe((referer: UserModel) => {
                this.leader = referer.uid;
                this.affiliate = user.uid;
                this.affiliateName =
                  userAffiliated.firstName + ' ' + userAffiliated.middleName;
              });
          });
      }
    });
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.paramMap.get('email');

    this.auth.onAuthStateChanged((user: firebase.User) => {
      if (user && user.emailVerified) {
        this.usersCollection
          .doc<UserModel>(user.uid)
          .update({
            emailVerified: true,
            status: 'emailVerified',
          })
          .then(() => {
            this.usersCollection
              .doc(this.leader)
              .collection('notifications')
              .add({
                user: this.usersCollection.doc(this.affiliate).ref,
                uid: this.affiliate,
                createdAt: new Date(),
                message: `${this.affiliateName} verificó su cuenta`,
              })
              .then(() => {
                this.router.navigate(['/dashboard']);
              })
              .catch(console.error);
          })
          .catch(console.error);
      } else {
        this._snackBar.open(
          'Su usuario aún no ha sido verificado, ingresa al link que enviamos a tu correo',
          'Cerrar',
          {
            duration: 10000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          }
        );
      }
    });
  }

  sendEmailVerification(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    this.auth.currentUser
      .then((user: firebase.User) => {
        console.log('->->-> user', user);
        user
          .sendEmailVerification()
          .then(() => {
            this._snackBar.open(
              'Se ha enviado un nuevo mensaje a tu correo',
              'Cerrar',
              {
                duration: 2000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
              }
            );
          })
          .catch(console.error);
      })
      .catch(console.error);
  }

  signOut() {
    this.auth
      .signOut()
      .then(() => {
        this.router.navigate(['/auth']);
      })
      .catch(console.error);
  }

  windowReload(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    window.location.href = '/auth/email-verify';
  }
}
