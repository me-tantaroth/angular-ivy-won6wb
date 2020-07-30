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
  name: string;
  title?: {
    es: string;
  };
  description: {
    es: string;
  };
  cover: string;
  url: {
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
  private listCollection: AngularFirestoreCollection<Item>;
  htmlText = '<p>Testing</p>';
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
  hasFocus = false;

  atValues = [
    { id: 1, value: 'Fredrik Sundqvist', link: 'https://google.com' },
    { id: 2, value: 'Patrik Sjölin' },
  ];
  hashValues = [
    { id: 3, value: 'Fredrik Sundqvist 2' },
    { id: 4, value: 'Patrik Sjölin 2' },
  ];
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['code-block'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ font: [] }],
        [{ align: [] }],

        ['clean'], // remove formatting button

        ['link', 'image', 'video', 'emoji'],
      ],
      handlers: { emoji: function () {} },
    },
    autoLink: true,

    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ['@', '#'],
      source: (searchTerm, renderList, mentionChar) => {
        let values;

        if (mentionChar === '@') {
          values = this.atValues;
        } else {
          values = this.hashValues;
        }

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          for (var i = 0; i < values.length; i++)
            if (
              ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
            )
              matches.push(values[i]);
          renderList(matches, searchTerm);
        }
      },
    },
    'emoji-toolbar': true,
    'emoji-textarea': false,
    'emoji-shortname': true,
    keyboard: {
      bindings: {
        // shiftEnter: {
        //   key: 13,
        //   shiftKey: true,
        //   handler: (range, context) => {
        //     // Handle shift+enter
        //     console.log("shift+enter")
        //   }
        // },
        enter: {
          key: 13,
          handler: (range, context) => {
            console.log('enter');
            return true;
          },
        },
      },
    },
  };

  constructor(public afs: AngularFirestore) {
    this.uuid = afs.createId();
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      title: new FormControl(''),
      description: new FormControl(''),
      url: new FormControl(''),
      cover: new FormControl('/assets/images/break-image.png'),
      uuid: new FormControl(this.uuid),
      status: new FormControl('DRAFT'),
      createdAt: new FormControl(new Date()),
    });

    this.listCollection = afs.collection<Item>('capacitaciones');
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

  changeName(event: Event, title: string) {
    event.stopPropagation();
    event.preventDefault();

    if (this.f.name.value.length <= 0) {
      this.formGroup.patchValue({
        name: title,
      });
    }
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
      name: '',
      title: '',
      description: '',
      url: '',
      cover: '/assets/images/break-image.png',
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
      name: item.name,
      title: item.title.es,
      description: item.description.es,
      url: item.url.es[0],
      cover: item.cover,
      uuid: item.uuid,
      status: item.status,
      createdAt: item.createdAt,
    });

    console.log(item.uuid);
    this.uuid = item.uuid;

    this.drawer.open();
  }

  onDelete(event: Event, item: Item) {
    if (confirm(`¿Seguro que desea eliminar la pelicula '${item.title.es}'?`)) {
      this.listCollection.doc(item.uuid).delete();
    }
  }

  onSubmit(form: FormGroup) {
    console.log('->-> form', form);

    if (this.formGroup.valid) {
      const value: Item = form.value;

      const itemToSave: any = {
        name: value.name,
        title: {
          es: value.title,
        },
        description: {
          es: value.description,
        },
        url: {
          es: [value.url],
        },
        cover: value.cover,
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
        });
    }
  }

  onNext($event) {
    console.log($event);
  }
}
