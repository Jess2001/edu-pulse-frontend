import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudentService, Student } from '../../core/services/student';
import { GradeService, Grade } from '../../core/services/grade';

interface Skill {
  name: string;
  value: number;
  level: 'high' | 'mid' | 'low';
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard implements OnInit, OnDestroy {
  currentStudent: Student | null = null;
  grades: Grade[] = [];
  averageScore = 0;
  averageDelta = 0; // difference from last term; extend once you have historical data
  loading = true;

  bestSubject: Grade | null = null;
  studyTipSubject: Grade | null = null;

  skills: Skill[] = [];

  private subscriptions = new Subscription();

  constructor(
    private studentService: StudentService,
    private gradeService: GradeService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadData(): void {
    const studentSub = this.studentService.getAllStudents().subscribe({
      next: (students) => {
        this.currentStudent = students[0];

        if (this.currentStudent) {
          const gradeSub = this.gradeService
            .getGradesByStudent(this.currentStudent.id)
            .subscribe({
              next: (grades) => {
                this.grades = grades;
                this.computeAverage();
                this.computeDerivedData();
                this.loading = false;
              },
              error: (err) => {
                console.error('Error fetching grades', err);
                this.loading = false;
              },
            });
          this.subscriptions.add(gradeSub);
        }
      },
      error: (err) => {
        console.error('Error fetching students', err);
        this.loading = false;
      },
    });
    this.subscriptions.add(studentSub);
  }

  computeAverage(): void {
    if (this.grades.length === 0) {
      this.averageScore = 0;
      return;
    }
    const sum = this.grades.reduce((acc, g) => acc + g.score, 0);
    this.averageScore = Math.round(sum / this.grades.length);
  }

  computeDerivedData(): void {
    if (this.grades.length === 0) return;

    // Best subject
    this.bestSubject = this.grades.reduce((best, g) =>
      g.score > best.score ? g : best,
    );

    // Study tip: lowest-scoring subject
    this.studyTipSubject = this.grades.reduce((worst, g) =>
      g.score < worst.score ? g : worst,
    );

    // Skills breakdown — derived from grade clusters
    // Map your subjects to skill buckets; extend as needed
    this.skills = this.computeSkills();
  }

  computeSkills(): Skill[] {
    // Derive competency clusters from the subject scores.
    // Adjust the subject→skill mapping to match your real subjects.
    const subjectSkillMap: Record<string, string> = {
      Mathematics: 'Analytical Thinking',
      Physics: 'Technical Knowledge',
      Chemistry: 'Technical Knowledge',
      Biology: 'Scientific Reasoning',
      English: 'Communication',
      Kiswahili: 'Communication',
      History: 'Critical Thinking',
      Geography: 'Critical Thinking',
      CRE: 'Critical Thinking',
      'Computer Studies': 'Technical Knowledge',
      Business: 'Analytical Thinking',
    };

    const buckets: Record<string, number[]> = {};

    for (const grade of this.grades) {
      const skill = subjectSkillMap[grade.subjectName] ?? 'General';
      if (!buckets[skill]) buckets[skill] = [];
      buckets[skill].push(grade.score);
    }

    // If no mapping matched, show one overall skill
    if (Object.keys(buckets).length === 0) {
      return [
        {
          name: 'Overall Performance',
          value: this.averageScore,
          level: this.skillLevel(this.averageScore),
        },
      ];
    }

    return Object.entries(buckets).map(([name, scores]) => {
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      return { name, value: avg, level: this.skillLevel(avg) };
    });
  }

  skillLevel(score: number): 'high' | 'mid' | 'low' {
    if (score >= 75) return 'high';
    if (score >= 55) return 'mid';
    return 'low';
  }

  // ── Status helpers ──────────────────────────────────────────

  getStatus(avg: number): string {
    if (avg >= 80) return 'Excellent';
    if (avg >= 70) return 'Good';
    if (avg >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  }

  getStatusClass(avg: number): string {
    if (avg >= 80) return 'excellent';
    if (avg >= 70) return 'good';
    if (avg >= 60) return 'satisfactory';
    return 'poor';
  }

  getPerfStatus(score: number): string {
    if (score >= 80) return 'Exceptional';
    if (score >= 65) return 'Consistent';
    return 'Attention Needed';
  }

  getPerfStatusClass(score: number): string {
    if (score >= 80) return 'perf-exceptional';
    if (score >= 65) return 'perf-consistent';
    return 'perf-attention';
  }

  getPerfStatusIcon(score: number): string {
    if (score >= 80) return 'star';
    if (score >= 65) return 'check_circle';
    return 'warning';
  }

  getSubjectIcon(subjectName: string): string {
    const icons: Record<string, string> = {
      Mathematics: 'calculate',
      Physics: 'science',
      Chemistry: 'biotech',
      Biology: 'eco',
      English: 'menu_book',
      Kiswahili: 'translate',
      History: 'history_edu',
      Geography: 'public',
      CRE: 'auto_stories',
      'Computer Studies': 'computer',
      Business: 'business_center',
    };
    return icons[subjectName] ?? 'school';
  }
}
