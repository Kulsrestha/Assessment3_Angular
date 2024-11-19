import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private firestore: AngularFirestore) { }


  getUsers(): Observable<any[]> {
    return this.firestore.collection('users').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as { username: string };
        const id = a.payload.doc.id;
        console.log('Fetched user data:', data);
        return { id, username: data.username };
      }))
    );
  }
}
