import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StudentService, Student } from '../../core/services/student';
import { GradeService, Grade } from '../../core/services/grade';

/**
 * Student with their grades attached for easier template access
 */
interface StudentWithGrades extends Student {
  grades: Grade[];
  averageScore: number;
}

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.css',
})
export class TeacherDashboard implements OnInit, OnDestroy {
  students: StudentWithGrades[] = [];
  selectedStudent: StudentWithGrades | null = null;
  loading = true;
  searchQuery = '';

  private subscriptions = new Subscription();

  constructor(
    private studentService: StudentService,
    private gradeService: GradeService,
  ) {}

  ngOnInit(): void {
    this.loadStudentData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Load all students and their grades, then compute averages
   */
  loadStudentData(): void {
    const studentSub = this.studentService.getAllStudents().subscribe({
      next: (students) => {
        const gradeSub = this.gradeService.getAllGrades().subscribe({
          next: (allGrades) => {
            // Map students to include their grades and computed average
            this.students = students.map((student) => ({
              ...student,
              grades: allGrades.filter((g) => g.studentId === student.id),
              averageScore: this.computeAverage(
                allGrades.filter((g) => g.studentId === student.id),
              ),
            }));
            this.loading = false;
          },
          error: (err) => {
            console.error('Error fetching grades', err);
            this.loading = false;
          },
        });
        this.subscriptions.add(gradeSub);
      },
      error: (err) => {
        console.error('Error fetching students', err);
        this.loading = false;
      },
    });
    this.subscriptions.add(studentSub);
  }

  /**
   * Calculate average score from an array of grades
   */
  computeAverage(grades: Grade[]): number {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, g) => acc + g.score, 0);
    return Math.round(sum / grades.length);
  }

  /**
   * Filter students by search query
   */
  get filteredStudents(): StudentWithGrades[] {
    if (!this.searchQuery.trim()) return this.students;
    return this.students.filter(
      (s) =>
        s.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        s.form.toLowerCase().includes(this.searchQuery.toLowerCase()),
    );
  }

  /**
   * Select a student to view their detailed grades
   */
  selectStudent(student: StudentWithGrades): void {
    this.selectedStudent = student;
  }

  /**
   * Close the detail panel
   */
  closeDetail(): void {
    this.selectedStudent = null;
  }

  /**
   * Get performance status badge text based on average
   */
  getPerformanceStatus(avg: number): string {
    if (avg >= 80) return 'Excellent';
    if (avg >= 70) return 'Good';
    if (avg >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  }

  /**
   * Get CSS class for performance badge colour
   */
  getPerformanceClass(avg: number): string {
    if (avg >= 80) return 'excellent';
    if (avg >= 70) return 'good';
    if (avg >= 60) return 'satisfactory';
    return 'poor';
  }
}
