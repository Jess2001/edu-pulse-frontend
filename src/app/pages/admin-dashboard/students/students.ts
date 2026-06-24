import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { StudentTableComponent } from '../../../shared/components/student-table/student-table';
import {
  StudentService,
  Student,
} from '../../../core/services/student';
import { GradeService, Grade } from '../../../core/services/grade';

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [CommonModule, StudentTableComponent],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class AdminStudents implements OnInit, OnDestroy {
  students: Student[] = [];
  studentGrades: Map<number, Grade[]> = new Map();
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
        this.students = students;
        const gradeSub = this.gradeService.getAllGrades().subscribe({
          next: (grades) => {
            // Map grades by student ID for easy lookup
            this.students.forEach((student) => {
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
