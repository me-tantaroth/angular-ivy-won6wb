import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { UserModel } from '../auth/shared/models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
interface Alert {
  color: 'primary' | 'success' | 'warning' | 'danger';
  message: string;
}

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss'],
})
export class PayComponent implements OnInit {
  private usersCollection: AngularFirestoreCollection<UserModel>;
  private leader: string;
  private affiliate: string;
  private affiliateName: string;
  currentUser: Observable<UserModel>;
  alert: Alert;
  payed: boolean;

  constructor(
    private afs: AngularFirestore,
    public auth: AngularFireAuth,
    private router: Router
  ) {
    this.leader = localStorage.getItem('leader');
    this.affiliate = localStorage.getItem('affiliate');
    this.affiliateName = localStorage.getItem('affiliateName');

    this.usersCollection = afs.collection<UserModel>('users');
  }

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.usersCollection
          .doc(user.uid)
          .valueChanges()
          .subscribe((userAffiliated: UserModel) => {
            console.log('>>> userAffiliated', userAffiliated.affiliate);
            this.afs
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

  updatePay(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    console.log('>> paying...');

    this.auth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.usersCollection
          .doc<UserModel>(user.uid)
          .update({
            payed: true,
            status: 'payed',
          })
          .then(() => {
            if (this.leader) {
              this.usersCollection
                .doc(this.leader)
                .collection('notifications')
                .add({
                  user: this.usersCollection.doc(this.affiliate).ref,
                  uid: this.affiliate,
                  createdAt: new Date(),
                  message: `${this.affiliateName} pagó`,
                })
                .then(() => {
                  this.payed = true;
                });
            } else {
              this.payed = true;
            }
          })
          .catch(console.error);
      }
    });
  }
}
