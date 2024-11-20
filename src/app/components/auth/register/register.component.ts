import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  email = '';
  password = '';
  username = '';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  register() {
    if (this.email === '') {
      alert('Please enter email');
      return;
    }
    if (this.password === '') {
      alert('Please enter password');
      return;
    }
    if (this.username === '') {
      alert('Please enter a username');
      return;
    }

    this.auth.register(this.email, this.password, this.username);
    this.email = '';
    this.password = '';
    this.username = '';
  }
}
