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
  order: number;
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
      text: new FormControl('', Validators.required),
      order: new FormControl(0, Validators.required),
      uuid: new FormControl(this.uuid),
      status: new FormControl('DRAFT'),
      createdAt: new FormControl(new Date()),
    });

    this.listCollection = afs.collection<Item>('document-types', ref => ref.orderBy('order'));
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
      order: item.order,
      uuid: item?.uuid,
      status: item?.status,
      createdAt: item?.createdAt,
    });

    console.log(item?.uuid);
    this.uuid = item?.uuid;

    this.drawer.open();
  }

  onDelete(event: Event, item: Item) {
    if (
      confirm(
        `¿Seguro que desea eliminar el documento de identidad '${item.text.es}'?`
      )
    ) {
      this.listCollection.doc(item.uuid).delete();
    }
  }

  onSubmit(form: FormGroup) {
    console.log('->-> form', form);

    if (this.formGroup.valid) {
      const value: Item = form.value;

      const itemToSave: any = {
        text: {
          es: value.text,
        },
        order: value.order,
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
