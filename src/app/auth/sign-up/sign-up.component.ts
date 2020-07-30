import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { MatSelectChange } from '@angular/material/select';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserModel } from '../shared/models/user.model';
interface Select {
  value: string;
  viewValue: string;
}
interface City extends Select {
  department: string;
}
interface Alert {
  color: 'primary' | 'success' | 'warning' | 'danger';
  message: string;
}

function UserNameValid(control: AbstractControl) {
  function isValid(username: string) {
    const validcharacters =
      '1234567890-_.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let index = 0; index < username.length; index++) {
      if (index < username.length - 1) {
        if (validcharacters.indexOf(username.substr(index, 1)) == -1) {
          return false;
        }
      } else {
        return true;
      }
    }
  }

  let username = control.value;

  if (!isValid(username)) {
    return { validUsername: true };
  } else {
    return null;
  }
}
function MatchPassword(control: AbstractControl) {
  let parent = control.parent;
  if (parent) {
    let password = parent.get('password').value;
    let confirmPassword = control.value;

    if (password != confirmPassword) {
      return { confirmPassword: true };
    } else {
      return null;
    }
  } else {
    return null;
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  @Input() page: 'sign-in' | 'sign-up' | 'forgot-password';
  @Output() pageChange: EventEmitter<
    'sign-in' | 'sign-up' | 'forgot-password'
  > = new EventEmitter<'sign-in' | 'sign-up' | 'forgot-password'>();
  private usersCollection: AngularFirestoreCollection<UserModel>;
  genderSelected = 'female';
  typeDocumentSelected: 'cc' = 'cc';
  typesDocument: Observable<Select[]> = of([
    { value: 'cc', viewValue: 'Cédula de ciudadania' },
  ]);
  genders: Observable<Select[]> = of([
    { value: 'female', viewValue: 'Femenino' },
    { value: 'male', viewValue: 'Masculino' },
    { value: 'other', viewValue: 'Otro' },
  ]);
  departmentSelected = 'tolima';
  departments: Observable<Select[]> = of([
    { value: 'tolima', viewValue: 'Tolima' },
    { value: 'cundinamarca', viewValue: 'Cundinamarca' },
  ]);
  citySelected: string;
  cities: Observable<City[]> = of([
    { value: 'ibague', viewValue: 'Ibagué', department: 'tolima' },
    { value: 'bogota', viewValue: 'Bogotá D.C.', department: 'cundinamarca' },
  ]);
  formGroup: FormGroup;
  alert: Alert;
  usernameData: Observable<UserModel>;
  usernameParam: string;
  usernameValidError: boolean;
  usernameValidLoaded: boolean;
  errors: {
    docNumber: {
      loading: boolean;
      status: boolean;
    };
  };

  constructor(
    private afs: AngularFirestore,
    public authAF: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.usersCollection = afs.collection<UserModel>('users');

    this.formGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      secondName: new FormControl(''),
      middleName: new FormControl('', [Validators.required]),
      lastName: new FormControl(''),
      mobile: new FormControl('', [Validators.required]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        UserNameValid,
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(5),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      password_confirm: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        MatchPassword,
      ]),
      typeDocument: new FormControl(this.typeDocumentSelected, [
        Validators.required,
      ]),
      numberDocument: new FormControl('', [Validators.required]),
      gender: new FormControl(this.genderSelected, [Validators.required]),
      department: new FormControl(this.departmentSelected, [
        Validators.required,
      ]),
      city: new FormControl(this.citySelected, [Validators.required]),
    });
  }

  get f(): {
    [key: string]: AbstractControl;
  } {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.cities = this.getCities();

    this.usernameParam = this.route.snapshot.paramMap.get('username');

    if (this.usernameParam) {
      this.page = 'sign-up';

      this.usernameData = this.afs
        .collection<UserModel>('users', (ref) =>
          ref.where('username', '==', this.usernameParam)
        )
        .valueChanges()
        .pipe(map((users: UserModel[]) => users[0]));
    }
  }

  validUsername(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.f.username.valid) {
      this.usernameValidError = false;
      this.usernameValidLoaded = false;

      this.afs
        .collection<UserModel>('users', (ref) =>
          ref.where('username', '==', this.f.username.value)
        )
        .valueChanges()
        .subscribe((users: UserModel[]) => {
          this.usernameValidLoaded = true;

          if (users.length > 0) {
            this.usernameValidError = true;
          }
        });
    }
  }

  restoreDataUsername(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    this.usernameValidError = null;
    this.usernameValidLoaded = null;
  }

  onChangeDepartment(event: MatSelectChange) {
    this.cities = this.getCities();
  }

  getCities(): Observable<City[]> {
    return this.cities.pipe(
      map((cities: City[]) =>
        cities.filter(
          (city: City) =>
            city.department === this.formGroup.get('department').value
        )
      )
    );
  }

  onSubmit(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.formGroup.valid) {
      const value: UserModel = this.formGroup.value;

      value.createdAt = new Date();

      const billingDate: Date = new Date();
      billingDate.setDate(billingDate.getDate() + 20);
      value.billingDate = billingDate;

      const billingAlertDate: Date = new Date();
      billingAlertDate.setDate(billingAlertDate.getDate() + 25);
      value.billingAlertDate = billingAlertDate;

      const expirationDate: Date = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      value.expirationDate = expirationDate;

      value.status = 'created';
      value.emailVerified = false;
      value.role = 'user';
      value.photoURL = '/assets/images/face.png';
      value.platformJoined = true;
      value.pendingData = true;

      this.afs
        .collection<UserModel>('users', (ref) =>
          ref.where('numberDocument', '==', value.numberDocument)
        )
        .valueChanges()
        .subscribe((users: UserModel[]) => {
          if (users.length > 0) {
            const TIME_OUT_FX = setTimeout(() => {
              document
                .querySelector('#toTop')
                .scrollIntoView({ behavior: 'smooth' });

              clearTimeout(TIME_OUT_FX);
            }, 1000);

            this.alert = {
              color: 'danger',
              message: 'El número de documento ya existe',
            };
          } else {
            this.afs
              .collection<UserModel>('users', (ref) =>
                ref.where('username', '==', this.f.username.value)
              )
              .valueChanges()
              .subscribe((users: UserModel[]) => {
                this.usernameValidLoaded = true;
      
                if (users.length > 0) {
                  this.usernameValidError = true;
                } else {
                  this.authAF
                    .createUserWithEmailAndPassword(value.email, value.password)
                    .then((userCredential: firebase.auth.UserCredential) => {
                      value.uid = userCredential.user.uid;
      
                      delete value.password_confirm;
      
                      userCredential.user
                        .sendEmailVerification()
                        .then(() => {
                          this.usersCollection
                            .doc(userCredential.user.uid)
                            .set(value);
                          this.router.navigate(['/auth/email-verify/' + value.email]);
                        })
                        .catch(console.error);
                    })
                    .catch((error) => {
                      const TIME_OUT_FX = setTimeout(() => {
                        document
                          .querySelector('#toTop')
                          .scrollIntoView({ behavior: 'smooth' });
      
                        clearTimeout(TIME_OUT_FX);
                      }, 1000);
      
                      this.alert = {
                        color: 'danger',
                        message: error.message,
                      };
      
                      console.error(error);
      
                      this.router.navigate(['/auth/email-verify/']);
                    });
                }
              });
          }
        });
    }
  }
}
