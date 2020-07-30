import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { UserModel } from '@app/auth/shared/models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  private usersCollection: AngularFirestoreCollection<UserModel>;
  currentUser: Observable<UserModel>;
  private notificationsCollection: AngularFirestoreCollection<{
    user: any;
    uid: string;
    message: string;
    createdAt: Date;
  }>;
  notifications: Observable<
    {
      user: any;
      uid: string;
      message: string;
      createdAt: Date;
    }[]
  >;
  showFiller = false;

  constructor(
    afs: AngularFirestore,
    public auth: AngularFireAuth,
    public router: Router,
    private snackBar: MatSnackBar
  ) {
    this.usersCollection = afs.collection<UserModel>('users');
  }

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.currentUser = this.usersCollection
          .doc<UserModel>(user.uid)
          .valueChanges();

        this.notificationsCollection = this.usersCollection
          .doc<UserModel>(user.uid)
          .collection('notifications', (ref) =>
            ref.orderBy('createdAt', 'desc')
          );

        this.notifications = this.notificationsCollection
          .snapshotChanges()
          .pipe(
            map(
              (
                docs: DocumentChangeAction<firebase.firestore.DocumentData>[]
              ) => {
                console.log('>> notification', docs);

                return docs.map(
                  (
                    doc: DocumentChangeAction<firebase.firestore.DocumentData>,
                    index: number
                  ) => {
                    const item: {
                      user: any;
                      uid: string;
                      message: string;
                      createdAt: Date;
                    } = doc.payload.doc.data() as {
                      user: any;
                      uid: string;
                      message: string;
                      createdAt: Date;
                    };

                    if (index === 0) {
                      this.snackBar.open(item.message, 'Cerrar', {
                        duration: 5000,
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                      });
                    }

                    return {
                      ...item,
                      uid: doc.payload.doc.id,
                    };
                  }
                );
              }
            )
          );
      }
    });
  }

  removeNotification(notification: {
    user: any;
    uid: string;
    message: string;
    createdAt: Date;
  }) {
    console.log('>> notification.uid', notification.uid);
    this.notificationsCollection.doc(notification.uid).delete();
  }

  signOut() {
    this.auth
      .signOut()
      .then(() => {
        this.router.navigate(['/auth']);
      })
      .catch(console.error);
  }
}
