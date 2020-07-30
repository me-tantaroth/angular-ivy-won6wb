import { Component, OnInit, Input } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { UserModel } from '../auth/shared/models/user.model';

@Component({
  selector: 'app-affiliate-view',
  templateUrl: './affiliate-view.component.html',
  styleUrls: ['./affiliate-view.component.scss'],
})
export class AffiliateViewComponent implements OnInit {
  @Input() user: DocumentReference;
  private userDoc: AngularFirestoreDocument<UserModel>;
  affiliate: Observable<UserModel>;

  constructor(private afs: AngularFirestore) {}

  ngOnInit(): void {
    this.userDoc = this.afs.doc<UserModel>(this.user);
    this.affiliate = this.userDoc.valueChanges();
  }
}
