import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
  selector: 'app-movie-view',
  templateUrl: './movie-view.component.html',
  styleUrls: ['./movie-view.component.scss'],
})
export class MovieViewComponent implements OnInit {
  private itemDoc: AngularFirestoreDocument<Item>;
  item: Observable<Item>;

  constructor(
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.paramMap.get('uuid'));
    this.itemDoc = this.afs.doc<Item>(
      'capacitacion/' + this.route.snapshot.paramMap.get('uuid')
    );
    this.item = this.itemDoc.valueChanges();
  }
}
