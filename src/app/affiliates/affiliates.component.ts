import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  DocumentChangeType,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of, forkJoin } from 'rxjs';
import {
  map,
  switchMap,
  flatMap,
  mergeMap,
  mergeMapTo,
  mergeAll,
} from 'rxjs/operators';

import { UserModel } from '../auth/shared/models/user.model';

interface Affiliate {
  user: DocumentReference;
  uid: string;
}

@Component({
  selector: 'app-affiliates',
  templateUrl: './affiliates.component.html',
  styleUrls: ['./affiliates.component.scss'],
})
export class AffiliatesComponent implements OnInit {
  private affiliatesCollection: AngularFirestoreCollection<Affiliate>;
  affiliates: Observable<Affiliate[]>;

  constructor(private afs: AngularFirestore, public auth: AngularFireAuth) {}

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.affiliates = this.afs
          .collection<Affiliate>('users/' + user.uid + '/affiliates')
          .valueChanges();
        // this.afs
        //   .collection<Affiliate>('users/' + user.uid + '/affiliates')
        //   .valueChanges()
        //   .subscribe((affiliates: Affiliate[]) => {
        //     affiliates.forEach((affiliate: Affiliate, index: number) => {
        //       affiliate.user
        //         .get()
        //         .then(
        //           (
        //             doc: firebase.firestore.DocumentSnapshot<
        //               firebase.firestore.DocumentData
        //             >
        //           ) => {
        //             this.affiliates.next([
        //               ...this.affiliates.value,
        //               { ...doc.data(), uid: doc.id } as UserModel,
        //             ]);
        //           }
        //         )
        //         .catch(console.error);
        //     });
        //   });
        // const affiliatesCollection: AngularFirestoreCollection<Affiliate> = this.afs.collection<
        //   Affiliate
        // >('users/' + user.uid + '/affiliates');

        // this.affiliates = affiliatesCollection
        //   .snapshotChanges()
        //   .pipe(
        //     map((actions: DocumentChangeAction<Affiliate>[]) => {
        //       console.log('>>> actions', actions);
        //       return actions.map((action: DocumentChangeAction<Affiliate>) => {
        //         console.log('>>> action', action.payload.doc.id);
        //         return affiliatesCollection
        //           .doc<UserModel>(action.payload.doc.id)
        //           .valueChanges();
        //       });
        //     })
        //   );
      }
    });
  }
}
