/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private fireauth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
  ) {}

  // Login method
  login(email: string, password: string) {
    this.fireauth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        if (res.user) {
          const userId = res.user.uid;

          this.firestore
            .collection('users')
            .doc(userId)
            .get()
            .toPromise()
            .then((doc) => {
              if (doc && doc.exists) {
                const userData = doc.data() as { isAdmin?: boolean };
                if (userData?.isAdmin) {
                  localStorage.setItem('isAdmin', 'true');
                  localStorage.setItem('isAuthenticated', 'true');
                  this.router.navigate(['/admin-dashboard']);
                } else {
                  if (res.user?.emailVerified) {
                    localStorage.setItem('isAdmin', 'false');
                    localStorage.setItem('isAuthenticated', 'true');
                    this.router.navigate(['/user-dashboard']);
                  } else {
                    alert('Please verify your email before logging in.');
                  }
                }
              } else {
                alert('No user found with the provided credentials.');
              }
            });
        }
      })
      .catch((err) => {
        alert(err.message);
        this.router.navigate(['/login']);
      });
  }

  async register(email: string, password: string, username: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          username: username,
        };
        await this.firestore.collection('users').doc(user.uid).set(userData);
        await user.sendEmailVerification();

        this.router.navigate(['/verify-email']);
        alert('Registration successful! Please check your email to verify your account.');

        return user;
      }

      throw new Error('User creation failed');
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed: ');
      throw error;
    }
  }

  sendVerificationEmail(user: any) {
    user
      .sendEmailVerification()
      .then(() => {
        alert('A verification email has been sent to your registered email address.');
        this.router.navigate(['/verify-email']);
      })
      .catch((err: any) => {
        console.error('Error sending verification email:', err);
        alert('Unable to send verification email.');
      });
  }

  getCurrentUser(): Observable<any> {
    return this.fireauth.authState;
  }

  isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  logout() {
    this.fireauth.signOut().then(
      () => {
        localStorage.removeItem('isAdmin');
        this.router.navigate(['/login']);
      },
      (err) => {
        alert(err.message);
      },
    );
  }

  googleSignIn() {
    return this.fireauth
      .signInWithPopup(new GoogleAuthProvider())
      .then((res) => {
        this.router.navigate(['/user-dashboard']);
        localStorage.setItem('token', JSON.stringify(res.user?.uid));
      })
      .catch((err) => {
        alert(err.message);
      });
  }
}
