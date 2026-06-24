import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
  },
  {
    path: 'admin',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/admin-dashboard/overview/admin-overview').then(
            (m) => m.AdminOverview,
          ),
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./pages/admin-dashboard/students/students').then(
            (m) => m.AdminStudents,
          ),
      },
    ],
  },
  {
    path: 'teacher',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/teacher-dashboard/teacher-overview/teacher-overview').then(
            (m) => m.TeacherOverview,
          ),
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./pages/teacher-dashboard/students/students').then(
            (m) => m.TeacherStudents,
          ),
      },
    ],
  },
  {
    path: 'student',
    loadComponent: () =>
      import('./pages/student-dashboard/student-dashboard').then(
        (m) => m.StudentDashboard,
      ),
  },
];
