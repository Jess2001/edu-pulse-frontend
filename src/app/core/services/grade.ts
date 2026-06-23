import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Shape of a Grade object matching our Spring Boot API
export interface Grade {
  id: number;
  studentId: number;
  subjectId: number;
  subjectName: string;
  score: number;
  grade: string;
}

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get all grades
  getAllGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/grades`);
  }

  // Get grades for a specific student by their ID
  getGradesByStudent(studentId: number): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/grades/student/${studentId}`);
  }
}
