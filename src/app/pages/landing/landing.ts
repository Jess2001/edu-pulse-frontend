import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  // Features section data
  features = [
    {
      icon: 'analytics',
      badge: 'analytics',
      title: 'Advanced Analytics',
      description:
        'Dive deep into subject-wise performance trends. Our algorithm identifies gaps in student learning before they become hurdles.',
      highlights: [
        'Grade distribution heatmaps',
        'Departmental benchmark reports',
      ],
      visual: 'laptop',
    },
    {
      icon: 'notifications',
      badge: 'insights',
      title: 'Automated Insights',
      description:
        'Receive weekly summaries and alerts regarding student performance drops or extraordinary improvements.',
      scheduled: 'Friday, 14:00 PM',
      visual: 'none',
    },
    {
      icon: 'trending_up',
      badge: 'trending_up',
      title: 'Progress Tracking',
      description:
        'Track individual student growth across multiple terms and years to visualise long-term academic trajectories.',
      visual: 'chart',
    },
    {
      icon: 'assignment',
      badge: 'assignment',
      title: 'Streamlined Exam Management',
      description:
        'From paper-based data entry to digital exam result distribution, manage the entire lifecycle of an academic term in one place.',
      visual: 'icon',
    },
  ];

  // Testimonials section data
  testimonials = [
    {
      name: 'Dr. Sarah Mwangi',
      role: 'Principal, St. Peters Academy',
      quote:
        'The granularity of data we now have is unprecedented. We can identify students who need support weeks before final exams.',
      initials: 'SM',
    },
    {
      name: 'John Doe',
      role: 'Head of Science Dept.',
      quote:
        "Managing results used to take us days. With EduPulse, it's done in hours, and the reports are beautiful and easy for parents to understand.",
      initials: 'JD',
    },
    {
      name: 'Grace Akoth',
      role: 'Director of Studies',
      quote:
        'The automated insights help our staff focus on teaching rather than spending hours on spreadsheets. Truly a game-changer.',
      initials: 'GA',
    },
  ];
}
