/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) {}

  registerUser(username: string, email: string, password: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
      const user = userCredential.user;
      if (user) {
        const userData = {
          uid: user.uid,
          username: username,
          email: email,
        };

        return this.firestore
          .collection('users')
          .doc(user.uid)
          .set(userData)
          .then(() => {
            console.log('User data saved to Firestore');
            return user.uid;
          });
      } else {
        throw new Error('User creation failed');
      }
    });
  }

  getUsers(): Observable<any[]> {
    return this.firestore
      .collection('users')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as { username: string; email: string; uid: string };
            const id = a.payload.doc.id;
            console.log('Fetched user data:', data);
            return { id, ...data };
          }),
        ),
      );
  }
}
