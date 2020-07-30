import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { UserModel } from '../../../auth/shared/models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-affiliate-detail',
  templateUrl: './affiliate-detail.component.html',
  styleUrls: ['./affiliate-detail.component.scss'],
})
export class AffiliateDetailComponent implements OnInit {
  private userDoc: AngularFirestoreDocument<UserModel>;
  affiliate: Observable<UserModel>;
  uid: string;

  constructor(private route: ActivatedRoute, private afs: AngularFirestore) {
    this.uid = this.route.snapshot.params.uid;
  }

  ngOnInit(): void {
    this.userDoc = this.afs.doc<UserModel>('/users/' + this.uid);
    this.affiliate = this.userDoc.valueChanges();
  }
}
