import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StudentService, Student } from '../../../core/services/student';
import { GradeService, Grade } from '../../../core/services/grade';


interface ClassSummary {
  form: string;
  totalStudents: number;
  meanMark: number;
  meanGrade: string;
}

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './teacher-overview.html',
  styleUrl: './teacher-overview.css',
})
export class TeacherOverview implements OnInit, OnDestroy {
  allStudents: Student[] = [];
  classStudents: Student[] = [];
  grades: Grade[] = [];
  classSummary: ClassSummary | null = null;
  topPerformers: (Student & { avg: number })[] = [];
  loading = true;

  // Hardcoded for demo — in real app from auth service
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
        this.classStudents = students.filter(
          (s) => s.form === this.teacherClassId,
        );

        const gradeSub = this.gradeService.getAllGrades().subscribe({
          next: (grades) => {
            this.grades = grades;
            this.computeClassSummary();
            this.computeTopPerformers();
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

  computeClassSummary(): void {
    const classStudentIds = this.classStudents.map((s) => s.id);
    const classGrades = this.grades.filter((g) =>
      classStudentIds.includes(g.studentId),
    );

    const meanMark =
      classGrades.length > 0
        ? Math.round(
            classGrades.reduce((sum, g) => sum + g.score, 0) /
              classGrades.length,
          )
        : 0;

    this.classSummary = {
      form: this.teacherClassId,
      totalStudents: this.classStudents.length,
      meanMark,
      meanGrade: this.scoreToGrade(meanMark),
    };
  }

  computeTopPerformers(): void {
    // Calculate average for each student in class
    this.topPerformers = this.classStudents
      .map((student) => {
        const studentGrades = this.grades.filter(
          (g) => g.studentId === student.id,
        );
        const avg =
          studentGrades.length > 0
            ? Math.round(
                studentGrades.reduce((sum, g) => sum + g.score, 0) /
                  studentGrades.length,
              )
            : 0;
        return { ...student, avg };
      })
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5);
  }

  scoreToGrade(score: number): string {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C+';
    return 'C';
  }
}