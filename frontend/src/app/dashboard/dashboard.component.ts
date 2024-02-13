import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    console.log("USER :: ",userData);
    if (userData) {
      this.user = JSON.parse(userData);
      console.log("USER DATA : ",this.user)
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
