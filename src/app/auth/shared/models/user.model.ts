import { DocumentReference } from '@angular/fire/firestore';

export interface UserModel {
  photoURL: string;
  city: string;
  department: string;
  email: string;
  firstName: string;
  gender: string;
  lastName?: string;
  middleName: string;
  numberDocument: number;
  password: string;
  password_confirm: string;
  secondName?: string;
  typeDocument: string;
  createdAt?: Date;
  billingDate?: Date;
  billingAlertDate?: Date;
  expirationDate?: Date;
  mobile: number;
  role: 'admin' | 'user';
  status:
    | 'created'
    | 'emailVerified'
    | 'pendingData'
    | 'payed'
    | 'enabled'
    | 'disabled';
  emailVerified: boolean;
  affiliate?: DocumentReference;
  pendingData: boolean;
  employment?: {
    work: 'Trabajo' | 'Estudio';
    entity: string;
    job: string;
  };
  platformJoined: boolean;
  payed?: boolean;
  username: string;
  uid: string;
}
