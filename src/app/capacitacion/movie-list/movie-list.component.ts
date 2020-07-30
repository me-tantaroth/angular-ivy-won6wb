import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Item {
  name: string;
  title: {
    es: string;
  };
  description: {
    es: string;
  };
  cover: string;
  url: string[];
  uuid: string;
}

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
})
export class MovieListComponent implements OnInit {
  private listCollection: AngularFirestoreCollection<Item>;
  list: Observable<Item[]>;
  listTemp: Observable<Item[]>;

  constructor(private afs: AngularFirestore) {
    this.listCollection = afs.collection<Item>('capacitaciones', (ref) =>
      ref.where('status', '==', 'PUBLISHED')
    );
    this.list = this.listTemp = this.listCollection.valueChanges();
  }

  ngOnInit(): void {}

  onSearch(event: Event, search: string) {
    event.stopPropagation();
    event.preventDefault();

    this.list = this.listTemp.pipe(
      map((items: Item[]) => {
        return items.filter((item: Item) => {
          return (
            JSON.stringify(item)
              .toLowerCase()
              .search(search.toLocaleLowerCase()) >= 0
          );
        });
      })
    );
  }
}
