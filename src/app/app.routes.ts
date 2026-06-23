import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard').then(
        (m) => m.AdminDashboard,
      ),
  },
  {
    path: 'teacher',
    loadComponent: () =>
      import('./pages/teacher-dashboard/teacher-dashboard').then(
        (m) => m.TeacherDashboard,
      ),
  },
  {
    path: 'student',
    loadComponent: () =>
      import('./pages/student-dashboard/student-dashboard').then(
        (m) => m.StudentDashboard,
      ),
  },
];
