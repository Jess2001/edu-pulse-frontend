import { Component } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  icon: string;
  path: string;
  roles: string[]; // Which roles can see this. Empty = all can see
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  currentRoute = '';
  userRole = 'admin'; // Would come from auth service in real app

  /**
   * Navigation items with role-based visibility
   */
  navItems: NavItem[] = [
    { label: 'Overview', icon: 'dashboard', path: '/admin', roles: ['admin'] },
    { label: 'Analytics', icon: 'analytics', path: '/admin', roles: ['admin'] },
    { label: 'My Class', icon: 'school', path: '/teacher', roles: ['teacher'] },
    {
      label: 'Students',
      icon: 'people',
      path: '/teacher/students',
      roles: ['teacher'],
    },
    {
      label: 'My Performance',
      icon: 'trending_up',
      path: '/student',
      roles: ['student'],
    },
    {
      label: 'My Grades',
      icon: 'grades',
      path: '/student/grades',
      roles: ['student'],
    },
    { label: 'Home', icon: 'home', path: '/', roles: [] }, // Empty roles = visible to all
  ];

  constructor(private router: Router) {
    // Track current route for active state
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  /**
   * Filter nav items based on current user role
   */
  get visibleNavItems(): NavItem[] {
    return this.navItems.filter(
      (item) => item.roles.length === 0 || item.roles.includes(this.userRole),
    );
  }

  /**
   * Check if a nav item matches current route
   */
  isActive(path: string): boolean {
    return this.currentRoute.startsWith(path);
  }

  logout(): void {
    // Would call auth service here
    this.router.navigate(['/']);
  }
}
