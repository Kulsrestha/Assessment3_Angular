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
    private fireauth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
  ) {}

  // Admin credentials (hardcoded)
  private readonly adminEmail = 'admin@example.com';
  private readonly adminPassword = 'admin123';

  // Login method
  login(email: string, password: string) {
    if (email === this.adminEmail && password === this.adminPassword) {
      // Admin login
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('isAuthenticated', 'true');
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.fireauth
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          if (res.user?.emailVerified) {
            localStorage.setItem('isAdmin', 'false');
            localStorage.setItem('isAuthenticated', 'true');
            this.router.navigate(['/user-dashboard']);
          } else {
            alert('Please verify your email before logging in.');
          }
        })
        .catch((err) => {
          alert(err.message);
          this.router.navigate(['/login']);
        });
    }
  }

  register(email: string, password: string, username: string) {
    this.fireauth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        if (res.user) {
          const userId = res.user.uid;
          this.firestore
            .collection('users')
            .doc(userId)
            .set({ username })
            .then(() => {
              this.sendVerificationEmail(res.user);
            });
        }
      })
      .catch((err) => {
        alert(err.message);
        console.error(err);
      });
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
        localStorage.removeItem('token');
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
