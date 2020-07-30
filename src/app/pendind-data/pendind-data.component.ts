import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
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
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSelectChange } from '@angular/material/select';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserModel } from '@app/auth/shared/models/user.model';
import { User } from 'firebase';

type WORK_TYPE = 'Estudiante' | 'Independiente' | 'Empleado';
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

@Component({
  selector: 'app-pendind-data',
  templateUrl: './pendind-data.component.html',
  styleUrls: ['./pendind-data.component.scss'],
})
export class PendindDataComponent implements OnInit {
  @Input() page: 'sign-in' | 'sign-up' | 'forgot-password';
  @Output() pageChange: EventEmitter<
    'sign-in' | 'sign-up' | 'forgot-password'
  > = new EventEmitter<'sign-in' | 'sign-up' | 'forgot-password'>();
  private usersCollection: AngularFirestoreCollection<UserModel>;
  private leader: string;
  private affiliate: string;
  private affiliateName: string;
  otherActivity: string;
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
  employments: string[] = ['Estudiante', 'Independiente', 'Empleado', 'Otro'];
  employment: string;
  formGroup: FormGroup;
  alert: Alert;
  levelSchool: string[] = [
    'Primaria',
    'Secundaria',
    'Técnico',
    'Tecnólogo',
    'Universitario',
  ];

  constructor(
    private afs: AngularFirestore,
    public auth: AngularFireAuth,
    private router: Router
  ) {
    this.leader = localStorage.getItem('leader');
    this.affiliate = localStorage.getItem('affiliate');
    this.affiliateName = localStorage.getItem('affiliateName');

    this.usersCollection = afs.collection<UserModel>('users');

    this.formGroup = new FormGroup({
      employment: new FormControl('Estudiante', [Validators.required]),
      level: new FormControl('', [Validators.required]),
    });
  }

  get f(): {
    [key: string]: AbstractControl;
  } {
    return this.formGroup.controls;
  }

  get getLabelEntity(): string {
    return this.f.employment.value === 'Trabajo' ? 'Empresa' : 'Instituto';
  }
  get getLabelJob(): string {
    return this.f.employment.value === 'Trabajo' ? 'Cargo' : 'Profesión';
  }

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.affiliate = user.uid;

        this.usersCollection
          .doc(user.uid)
          .valueChanges()
          .subscribe((userAffiliated: UserModel) => {
            console.log('>>> userAffiliated', userAffiliated.affiliate);
            if (userAffiliated.affiliate) {
              this.afs
                .doc(userAffiliated.affiliate)
                .valueChanges()
                .subscribe((referer: UserModel) => {
                  this.leader = referer.uid;
                  this.affiliateName =
                    userAffiliated.firstName + ' ' + userAffiliated.middleName;
                });
            }
          });
      }
    });
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

  onSubmit(event: Event, activity: string) {
    event.stopPropagation();
    event.preventDefault();

    if (this.formGroup.valid) {
      const value = this.formGroup.value;
      let workValue: string;

      console.log('>> activity', activity);
      if (value.employment === 'Otro') {
        workValue = activity;
      } else {
        workValue = value.employment;
      }

      const employment: {
        work: WORK_TYPE;
      } = {
        work: workValue as WORK_TYPE,
      };

      console.log('>>> value', value);

      this.auth.onAuthStateChanged((user: firebase.User) => {
        if (user) {
          console.log('>> user.uid', user.uid, {
            employment,
            pendingData: false,
            status: 'pendingData',
          });
          this.usersCollection
            .doc(this.affiliate)
            .update({ employment, pendingData: false, status: 'pendingData' })
            .then(() => {
              console.log('>>> this.leader', this.leader);
              if (this.leader) {
                this.usersCollection
                  .doc(this.leader)
                  .collection('notifications')
                  .add({
                    user: this.usersCollection.doc(this.affiliate).ref,
                    uid: this.affiliate,
                    createdAt: new Date(),
                    message: `${this.affiliateName} agregó los datos pendientes`,
                  })
                  .then(() => {
                    const TIME_OUT_FX = setTimeout(() => {
                      document
                        .querySelector('#toTop')
                        .scrollIntoView({ behavior: 'smooth' });

                      clearTimeout(TIME_OUT_FX);
                    }, 1000);

                    this.alert = {
                      color: 'success',
                      message: 'Se actualizaron sus datos correctamente',
                    };

                    this.router.navigate(['/dashboard']);
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
                  });
              } else {
                const TIME_OUT_FX = setTimeout(() => {
                  document
                    .querySelector('#toTop')
                    .scrollIntoView({ behavior: 'smooth' });

                  clearTimeout(TIME_OUT_FX);
                }, 1000);

                this.alert = {
                  color: 'success',
                  message: 'Se actualizaron sus datos correctamente',
                };

                this.router.navigate(['/dashboard']);
              }
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
            });
        }
      });
    }
  }
}
