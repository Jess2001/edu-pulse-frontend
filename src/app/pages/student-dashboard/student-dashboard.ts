import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudentService, Student } from '../../core/services/student';
import { GradeService, Grade } from '../../core/services/grade';

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
  loading = true;

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
        // Mock: get first student. In real app: from auth service
        this.currentStudent = students[0];

        if (this.currentStudent) {
          const gradeSub = this.gradeService
            .getGradesByStudent(this.currentStudent.id)
            .subscribe({
              next: (grades) => {
                this.grades = grades;
                this.computeAverage();
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
}
