import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    console.log("YOUPI")
    console.log('Tentative de connexion avec le nom d\'utilisateur:', this.username);
    console.log('Tentative de connexion avec le mot de passe:', this.password);

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        console.log('Connexion réussie');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Erreur de connexion', error);
        this.errorMessage = 'Échec de la connexion. Veuillez réessayer.';
      },
    });
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
