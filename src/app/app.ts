import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  isDashboard = false;
  constructor(private router: Router) {
    // Check current route on every navigation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Hide navbar on all dashboard routes
        this.isDashboard =
          event.url.includes('/admin') ||
          event.url.includes('/teacher') ||
          event.url.includes('/student');
      }
    });
  }
}
