import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [NgIf, FormsModule, RouterLink, ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective]
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.errorMessage = '';
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      this.errorMessage = 'All fields are required.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Password must contain at least 6 characters.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.authService.register({ firstName: this.firstName, lastName: this.lastName, email: this.email, password: this.password }).subscribe({
      next: () => this.loginNewUser(),
      error: error => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Unable to create your account.';
      }
    });
  }

  private loginNewUser(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: response => {
        this.authService.saveSession(response);
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Account created, but automatic login failed. Please sign in.';
      }
    });
  }
}
