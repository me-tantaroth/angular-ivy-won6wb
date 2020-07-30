import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { UserModel } from '../auth/shared/models/user.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private userDoc: AngularFirestoreDocument<UserModel>;
  currentUser: Observable<UserModel>;
  private affiliatesCollection: AngularFirestoreCollection<UserModel>;
  affiliates: Observable<UserModel[]>;
  lessDay: number;

  constructor(public auth: AngularFireAuth, private afs: AngularFirestore) {}

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.userDoc = this.afs.doc<UserModel>('users/' + user.uid);

        this.currentUser = this.userDoc.valueChanges().pipe(
          map((user: UserModel) => {
            console.log('>>> user.status', user.status, user.expirationDate);
            if (user.status !== 'disabled' && user.expirationDate) {
              const expirationDate: any = user.expirationDate;
              const expirationDateTime: Date = expirationDate.toDate();
              const lessTime =
                expirationDateTime.getTime() - new Date().getTime();

              this.lessDay = Math.round(lessTime / (1000 * 60 * 60 * 24));
            }

            return user;
          })
        );

        this.affiliatesCollection = this.userDoc.collection('affiliates');
        this.affiliates = this.affiliatesCollection.valueChanges();
      }
    });
  }

  logout() {
    this.auth.signOut();
  }
}
