import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface User {
  city: string;
  department: string;
  email: string;
  firstName: string;
  gender: string;
  lastName?: string;
  middleName: string;
  numberDocument: number;
  password: string;
  password_confirm: string;
  secondName?: string;
  typeDocument: string;
  createdAt?: Date;
  billingDate?: Date;
  billingAlertDate?: Date;
  expirationDate?: Date;
  status: 'created' | 'emailNoVerified' | 'noPayed' | 'enabled' | 'disabled';
  emailVerified: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ValidUserGuard implements CanActivate {
  private usersCollection: AngularFirestoreCollection<User>;
  user: Observable<User>;

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log('>> next, state', next, state);
    return this.auth.user.pipe(
      map((user: firebase.User) => {
        let response = true;

        console.log('>>> user', user);
        if (user) {
          response = false;

          if (user.emailVerified) {
            this.router.navigate(['/dashboard']);
          }
        }

        return response;
      })
    );
  }
}
