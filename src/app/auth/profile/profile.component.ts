import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of, Subscription } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

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
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  @Input() page: 'sign-in' | 'sign-up' | 'forgot-password';
  @Output() pageChange: EventEmitter<
    'sign-in' | 'sign-up' | 'forgot-password'
  > = new EventEmitter<'sign-in' | 'sign-up' | 'forgot-password'>();
  private usersCollection: AngularFirestoreCollection<UserModel>;
  currentUserSubcription: Subscription;
  currentUser: Observable<UserModel>;
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
  imageSelected: string;
  formGroup: FormGroup;
  alert: Alert;
  usernameValidError: boolean;
  usernameValidLoaded: boolean;
  loader: boolean;

  constructor(
    private afs: AngularFirestore,
    public auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private _snackBar: MatSnackBar,
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
      typeDocument: new FormControl(this.typeDocumentSelected, [
        Validators.required,
      ]),
      numberDocument: new FormControl('', [Validators.required]),
      gender: new FormControl(this.genderSelected, [Validators.required]),
      department: new FormControl(this.departmentSelected, [
        Validators.required,
      ]),
      city: new FormControl(this.citySelected, [Validators.required]),
      photoURL: new FormControl('', [Validators.required]),
    });
  }

  get f(): {
    [key: string]: AbstractControl;
  } {
    return this.formGroup.controls;
  }

  ngOnDestroy() {
    if (this.currentUserSubcription) {
      this.currentUserSubcription.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.cities = this.getCities();
    this.auth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.currentUser = this.usersCollection
          .doc<UserModel>(user.uid)
          .valueChanges()
          .pipe(
            map((user: UserModel) => {
              this.formGroup.patchValue({
                photoURL: user.photoURL || '/assets/images/face.png',
              });

              return user;
            })
          );
        this.currentUserSubcription = this.currentUser.subscribe(
          (user: UserModel) => this.formGroup.patchValue(user)
        );
      }
    });
  }

  validUsername(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.f.username.valid) {
      this.usernameValidError = false;
      this.usernameValidLoaded = false;

      console.log(this.f.username.value);
      this.afs
        .collection<UserModel>('users', (ref) =>
          ref.where('username', '==', this.f.username.value)
        )
        .valueChanges()
        .subscribe((users: UserModel[]) => {
          console.log(users);
          this.usernameValidLoaded = true;

          if (users.length > 0) {
            this.usernameValidError = true;
          }
        });
    }
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

  onCopy(event: Event, data) {
    event.stopPropagation();
    event.preventDefault();

    navigator.clipboard
      .writeText(data)
      .then(() => {
        this._snackBar.open('Link copiado!', 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      })
      .catch(console.error);
  }

  onSubmit(event: Event, user: UserModel) {
    this.loader = true;
    event.stopPropagation();
    event.preventDefault();

    if (this.formGroup.valid) {
      console.log(this.formGroup.value);
      const value: UserModel = this.formGroup.value;

      console.log('>> this.imageSelected', this.imageSelected);

      console.log(this.imageSelected);
      if (
        this.imageSelected &&
        this.imageSelected !== '/assets/images/face.png'
      ) {
        const filePath = '/uploads/' + uuidv4() + '-' + new Date().getTime();
        const fileRef = this.storage.ref(filePath);
        const task = fileRef.putString(this.imageSelected, 'data_url');

        task
          .snapshotChanges()
          .pipe(
            finalize(() =>
              fileRef
                .getDownloadURL()
                .toPromise()
                .then((fileURL: string) => {
                  value.photoURL = fileURL;

                  this.save({ ...user, ...value });
                })
            )
          )
          .subscribe();
        task.catch(console.error);
      } else {
        this.save({ ...user, ...value });
      }
    } else {
      this.loader = false;
    }
  }

  save(value: UserModel) {
    this.usersCollection
      .doc<UserModel>(value.uid)
      .set(value)
      .then(() => {
        this.loader = false;
        console.log('OK!');

        this.alert = {
          color: 'success',
          message: 'Se actualizó tu perfil correctamente',
        };

        const TIME_OUT_FX = setTimeout(() => {
          document
            .querySelector('#toTop')
            .scrollIntoView({ behavior: 'smooth' });

          clearTimeout(TIME_OUT_FX);
        }, 1000);
      })
      .catch((error) => {
        this.loader = false;
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
      });
  }
}
