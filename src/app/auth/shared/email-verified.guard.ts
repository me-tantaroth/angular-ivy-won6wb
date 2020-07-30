import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { UserModel } from '@app/auth/shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class EmailVerifiedGuard implements CanActivate {
  private usersCollection: AngularFirestoreCollection<UserModel>;
  uuid: string;

  constructor(
    afs: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router
  ) {
    this.uuid = afs.createId();
    this.usersCollection = afs.collection<UserModel>('users');
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.auth.user.pipe(
      switchMap((user: firebase.User) => {
        console.log('>>> user', user);

        if (user) {
          if (next.routeConfig.path === 'action') {
            return of(true);
          } else if (!user.emailVerified) {
            if (next.routeConfig.path !== 'email-verify/:email') {
              this.router.navigate(['/auth/email-verify/' + user.email]);
            }
          }
        } else {
          const routeConfig: any = next.routeConfig;
          console.log('>>> state.url', state.url);
          if (state.url !== '/auth') {
            this.router.navigate(['/auth']);
          }
        }

        return user ? this.getUserData(user.uid, next, state) : of(true);
      })
    );
  }

  getUserData(
    uid: string,
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.usersCollection
      .doc<UserModel>(uid)
      .valueChanges()
      .pipe(
        map((user: UserModel) => {
          let response = true;

          console.log('->>> user.status', user.status);
          if (
            (user.billingDate as any) &&
            (user.billingDate as any).toDate &&
            (user.billingAlertDate as any) &&
            (user.billingAlertDate as any).toDate &&
            (user.expirationDate as any) &&
            (user.expirationDate as any).toDate &&
            user.status !== 'disabled'
          ) {
            const billingDate = (user.billingDate as any)
              .toDate()
              .setHours(0, 0, 0, 0);
            const billingAlertDate = (user.billingAlertDate as any)
              .toDate()
              .setHours(0, 0, 0, 0);
            const expirationDate = (user.expirationDate as any)
              .toDate()
              .setHours(0, 0, 0, 0);
            const currentDate = new Date();
            // currentDate.setDate(currentDate.getDate() + 24);
            const currentDateTime = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate()
            ).getTime();

            if (currentDateTime > expirationDate) {
              console.log('Expiro');
              console.log('!!!! uid', uid);
              this.usersCollection
                .doc(uid)
                .collection('notifications')
                .doc(this.uuid)
                .set({
                  createdAt: new Date(),
                  message: `Esta cuenta esta dehabilitada por el pago de tu factura`,
                  uid: this.uuid,
                });
              this.usersCollection
                .doc(uid)
                .update({
                  status: 'disabled',
                })
                .then(() => {
                  console.log('>>>> saliendo');
                  this.auth.signOut().then(() => {
                    console.log('>>>> salio');
                  });
                });
              user.status = 'disabled';
            } else if (currentDateTime >= billingAlertDate) {
              console.log('Alert');
              this.usersCollection
                .doc(uid)
                .collection('notifications')
                .doc(this.uuid)
                .set({
                  createdAt: new Date(),
                  message: `El ${(user.expirationDate as any)
                    .toDate()
                    .getDate()}/${(user.expirationDate as any)
                    .toDate()
                    .getMonth()}/${(user.expirationDate as any)
                    .toDate()
                    .getFullYear()}, vence tu factura por favor cancela lo más pronto`,
                  uid: this.uuid,
                });
            } else if (currentDateTime >= billingDate) {
              console.log('Factura');
              this.usersCollection
                .doc(uid)
                .collection('notifications')
                .doc(this.uuid)
                .set({
                  createdAt: new Date(),
                  message: 'Ya puedes pagar tu factura por un costo de 10 USD',
                  uid: this.uuid,
                });
            }
          }

          console.log('???? user', user);
          if (user) {
            if (user.status === 'disabled') {
              this.router.navigate(['/pay']);
            } else if (!user.emailVerified) {
              console.log('>>> next.routeConfig.path', next.routeConfig.path);
              if (next.routeConfig.path !== 'email-verify/:email') {
                this.router.navigate(['/auth/email-verify/' + user.email]);
              }
            } else if (user.pendingData) {
              this.router.navigate(['/pending-data']);
            } else if (!user.payed) {
              this.router.navigate(['/pay']);
            }
          } else {
            if (state.url !== '/auth') {
              this.router.navigate(['/auth']);
            }
          }

          return response;
        })
      );
  }
}
