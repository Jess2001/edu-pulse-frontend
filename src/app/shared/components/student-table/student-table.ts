import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Student } from '../../../core/services/student';
import { Grade } from '../../../core/services/grade';

/**
 * Reusable student table component used by both admin and teacher dashboards
 * Admin sees all students with edit/delete buttons
 * Teacher sees only their class students (filtered by classId)
 */
@Component({
  selector: 'app-student-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-table.html',
  styleUrl: './student-table.css',
})
export class StudentTableComponent {
  // Data passed in from parent component
  @Input() students: Student[] = [];
  @Input() studentGrades: Map<number, Grade[]> = new Map();
  @Input() canEdit = false; // Admin can edit, teachers cannot
  @Input() title = 'Students';
  @Input() description = 'View and manage student records';

  searchQuery = '';
  sortBy: 'name' | 'form' | 'average' = 'form';

  /**
   * Filter students based on search query
   */
  get filteredStudents(): Student[] {
    if (!this.searchQuery.trim()) return this.sortedStudents;
    return this.sortedStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        s.form.toLowerCase().includes(this.searchQuery.toLowerCase()),
    );
  }

  /**
   * Sort students based on selected sort option
   */
  get sortedStudents(): Student[] {
    const sorted = [...this.students];

    if (this.sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortBy === 'form') {
      sorted.sort((a, b) => a.form.localeCompare(b.form));
    } else if (this.sortBy === 'average') {
      sorted.sort((a, b) => {
        const avgA = this.getStudentAverage(a.id);
        const avgB = this.getStudentAverage(b.id);
        return avgB - avgA; // Descending
      });
    }

    return sorted;
  }

  /**
   * Get student's average score from their grades
   */
  getStudentAverage(studentId: number): number {
    const grades = this.studentGrades.get(studentId) || [];
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, g) => acc + g.score, 0);
    return Math.round(sum / grades.length);
  }

  /**
   * Get performance status based on average
   */
  getStatus(avg: number): string {
    if (avg >= 80) return 'Excellent';
    if (avg >= 70) return 'Good';
    if (avg >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  }

  /**
   * Get CSS class for status badge
   */
  getStatusClass(avg: number): string {
    if (avg >= 80) return 'excellent';
    if (avg >= 70) return 'good';
    if (avg >= 60) return 'satisfactory';
    return 'poor';
  }

  /**
   * Open edit dialog (parent component handles actual edit logic)
   */
  editStudent(student: Student): void {
    // Would emit event to parent or open modal
    console.log('Edit student:', student);
  }

  /**
   * Delete student (parent component handles actual delete logic)
   */
  deleteStudent(student: Student): void {
    if (confirm(`Delete ${student.name}?`)) {
      console.log('Delete student:', student);
    }
  }

  /**
   * View detailed grades (parent component handles modal/navigation)
   */
  viewDetails(student: Student): void {
    console.log('View details:', student);
  }
}
