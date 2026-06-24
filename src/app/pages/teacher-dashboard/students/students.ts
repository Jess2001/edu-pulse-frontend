import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { StudentTableComponent } from '../../../shared/components/student-table/student-table';
import {
  StudentService,
  Student,
} from '../../../core/services/student';
import { GradeService, Grade } from '../../../core/services/grade';

/**
 * Teacher Students page — shows only students in the teacher's class
 * In a real app, classId would come from auth/session
 * For now we'll hardcode it, but it scales to: this.authService.getCurrentTeacherClassId()
 */
@Component({
  selector: 'app-teacher-students',
  standalone: true,
  imports: [CommonModule, StudentTableComponent],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class TeacherStudents implements OnInit, OnDestroy {
  allStudents: Student[] = [];
  classStudents: Student[] = [];
  studentGrades: Map<number, Grade[]> = new Map();
  loading = true;

  // Hardcoded for demo — in real app comes from auth service
  // this.authService.getCurrentTeacherClassId() or similar
  private teacherClassId = 'Form 1';

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
        this.allStudents = students;
        // Filter to only students in teacher's class
        this.classStudents = students.filter(
          (s) => s.form === this.teacherClassId,
        );

        const gradeSub = this.gradeService.getAllGrades().subscribe({
          next: (grades) => {
            // Map grades for all students (we only display teacher's though)
            this.allStudents.forEach((student) => {
              const studentGrades = grades.filter(
                (g) => g.studentId === student.id,
              );
              this.studentGrades.set(student.id, studentGrades);
            });
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
}
