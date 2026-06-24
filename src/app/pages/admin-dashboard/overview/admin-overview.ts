import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';
import {
  StudentService,
  Student,
} from '../../../core/services/student';
import { GradeService, Grade } from '../../../core/services/grade';

Chart.register(...registerables);

interface FormSummary {
  form: string;
  totalStudents: number;
  meanMark: number;
  meanGrade: string;
  meanPoints: number;
}

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent],
  templateUrl: './admin-overview.html',
  styleUrl: './admin-overview.css',
})
export class AdminOverview
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('barChart') barChartRef!: ElementRef;
  @ViewChild('donutChart') donutChartRef!: ElementRef;

  students: Student[] = [];
  grades: Grade[] = [];
  formSummaries: FormSummary[] = [];
  loading = true;

  private subscriptions = new Subscription();
  private barChart?: Chart;
  private donutChart?: Chart;

  constructor(
    private studentService: StudentService,
    private gradeService: GradeService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.barChart?.destroy();
    this.donutChart?.destroy();
  }

  loadData(): void {
    const studentSub = this.studentService.getAllStudents().subscribe({
      next: (students) => {
        this.students = students;
        const gradeSub = this.gradeService.getAllGrades().subscribe({
          next: (grades) => {
            this.grades = grades;
            this.computeFormSummaries();
            this.loading = false;
            setTimeout(() => this.renderCharts(), 100);
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

  renderCharts(): void {
    this.renderBarChart();
    this.renderDonutChart();
  }

  renderBarChart(): void {
    const canvas = this.barChartRef?.nativeElement;
    if (!canvas) return;

    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.formSummaries.map((f) => f.form),
        datasets: [
          {
            label: 'Mean Mark (%)',
            data: this.formSummaries.map((f) => f.meanMark),
            backgroundColor: 'rgba(77, 184, 184, 0.8)',
            borderColor: '#4db8b8',
            borderWidth: 2,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` Mean Mark: ${ctx.parsed.y}%`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { callback: (value) => `${value}%` },
          },
          x: { grid: { display: false } },
        },
      },
    });
  }

  renderDonutChart(): void {
    const canvas = this.donutChartRef?.nativeElement;
    if (!canvas) return;

    this.donutChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: this.formSummaries.map((f) => f.form),
        datasets: [
          {
            data: this.formSummaries.map((f) => f.totalStudents),
            backgroundColor: ['#1a3c4d', '#4db8b8', '#2d6a7f', '#a8e6e6'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 16, font: { size: 12 } },
          },
        },
      },
    });
  }

  computeFormSummaries(): void {
    const forms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
    this.formSummaries = forms.map((form) => {
      const formStudents = this.students.filter((s) => s.form === form);
      const formStudentIds = formStudents.map((s) => s.id);
      const formGrades = this.grades.filter((g) =>
        formStudentIds.includes(g.studentId),
      );
      const meanMark =
        formGrades.length > 0
          ? Math.round(
              formGrades.reduce((sum, g) => sum + g.score, 0) /
                formGrades.length,
            )
          : 0;
      return {
        form,
        totalStudents: formStudents.length,
        meanMark,
        meanGrade: this.scoreToGrade(meanMark),
        meanPoints: this.scoreToPoints(meanMark),
      };
    });
  }

  scoreToGrade(score: number): string {
    if (score >= 80) return 'A';
    if (score >= 75) return 'A-';
    if (score >= 70) return 'B+';
    if (score >= 65) return 'B';
    if (score >= 60) return 'B-';
    if (score >= 55) return 'C+';
    if (score >= 50) return 'C';
    if (score >= 45) return 'C-';
    if (score >= 40) return 'D+';
    if (score >= 35) return 'D';
    if (score >= 30) return 'D-';
    return 'E';
  }

  scoreToPoints(score: number): number {
    if (score >= 80) return 12;
    if (score >= 75) return 11;
    if (score >= 70) return 10;
    if (score >= 65) return 9;
    if (score >= 60) return 8;
    if (score >= 55) return 7;
    if (score >= 50) return 6;
    if (score >= 45) return 5;
    if (score >= 40) return 4;
    if (score >= 35) return 3;
    if (score >= 30) return 2;
    return 1;
  }

  get totalStudents(): number {
    return this.students.length;
  }
  get totalClasses(): number {
    return [...new Set(this.students.map((s) => s.form))].length;
  }
  get totalTeachers(): number {
    return 12;
  }
}
