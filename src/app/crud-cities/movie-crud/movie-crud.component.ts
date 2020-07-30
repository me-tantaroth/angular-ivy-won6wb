import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  Validators,
} from '@angular/forms';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Actions } from 'speck-crud';
import { MatDrawer } from '@angular/material/sidenav';
import { map } from 'rxjs/operators';

export interface Item {
  text: {
    es: string;
  };
  uuid?: string;
  createdAt: Date;
  status: 'DRAFT' | 'PUBLISHED';
}

@Component({
  selector: 'app-movie-crud',
  templateUrl: './movie-crud.component.html',
  styleUrls: ['./movie-crud.component.scss'],
})
export class MovieCrudComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;
  private countriesCollection: AngularFirestoreCollection<Item>;
  countries: Observable<Item[]>;
  private listCollection: AngularFirestoreCollection<Item>;
  list: Observable<Item[]>;
  formGroup: FormGroup;
  actions: Actions = {
    next: {
      mode: 'button',
      end: false,
    },
  };
  loaderForm: boolean;
  uuid: string;

  constructor(public afs: AngularFirestore) {
    this.uuid = afs.createId();
    this.formGroup = new FormGroup({
      country: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
      uuid: new FormControl(this.uuid, Validators.required),
      status: new FormControl('DRAFT'),
      createdAt: new FormControl(new Date()),
    });

    this.countriesCollection = afs.collection<Item>('countries', (ref) =>
      ref.orderBy('text')
    );
    this.countries = this.countriesCollection.valueChanges();
    this.listCollection = afs.collection<Item>('cities', (ref) =>
      ref.orderBy('text')
    );
    this.list = this.listCollection.snapshotChanges().pipe(
      map((docs: DocumentChangeAction<Item>[]) => {
        console.log('>>> docs', docs);
        return docs.map((doc: DocumentChangeAction<Item>) => {
          console.log('?????', {
            ...doc.payload.doc.data(),
            uuid: doc.payload.doc.id,
          });
          return {
            ...doc.payload.doc.data(),
            uuid: doc.payload.doc.id,
          };
        });
      })
    );
  }

  ngOnInit(): void {}

  get f(): {
    [key: string]: AbstractControl;
  } {
    return this.formGroup.controls;
  }

  loading(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    console.log('>>>> !this.formGroup.pristine', !this.formGroup.pristine);
    if (!this.formGroup.pristine) {
      this.loaderForm = true;
    }
  }

  reset() {
    this.formGroup.patchValue({
      text: '',
      order: 0,
      uuid: this.uuid,
      status: 'DRAFT',
      createdAt: new Date(),
    });
  }

  onAdd(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    this.uuid = this.afs.createId();

    this.reset();
  }

  onCancel(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    this.loaderForm = false;
  }

  onPublish(event: Event, item: Item) {
    event.stopPropagation();
    event.preventDefault();

    this.listCollection.doc(item.uuid).update({
      status: 'PUBLISHED',
    });
  }

  onEdit(event: Event, item: Item) {
    event.stopPropagation();
    event.preventDefault();

    this.formGroup.patchValue({
      text: item.text.es,
      uuid: item.uuid,
      status: item.status,
      createdAt: item.createdAt,
    });

    console.log(item.uuid);
    this.uuid = item.uuid;

    this.drawer.open();
  }

  onDelete(event: Event, item: Item) {
    if (confirm(`¿Seguro que desea eliminar el país '${item.text.es}'?`)) {
      this.listCollection.doc(item.uuid).delete();
    }
  }

  onSubmit(form: FormGroup) {
    console.log('->-> form', form);

    if (this.formGroup.valid) {
      const value: Item = form.value;

      this.uuid = value.uuid.toUpperCase();

      const itemToSave: any = {
        text: {
          es: value.text,
        },
        uuid: this.uuid,
        createdAt: value.createdAt || new Date(),
        status: value.status,
      };

      console.log('>> this.uuid', this.uuid, itemToSave);
      this.listCollection
        .doc(this.uuid)
        .set(itemToSave)
        .then(() => {
          this.loaderForm = false;
          this.drawer.close();
        });
    }
  }

  onNext($event) {
    console.log($event);
  }
}
