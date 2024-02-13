import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = {
    email: '',
    password: '',
    username: '',
  };

  constructor(private authService: AuthService, private router: Router) { } 

  onSignup() {
    this.authService.createUser(this.user).subscribe({
      next: (response) => {
        this.authService.login(this.user.username, this.user.password).subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('Erreur lors de la connexion automatique', err);
          }
        });
      },
      error: (error) => {
        console.error("Il y a eu une erreur lors de l'inscription!", error);
      }
    });
  }
}
