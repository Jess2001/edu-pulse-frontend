import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Shape of a Student object matching our Spring Boot API
export interface Student {
  id: number;
  name: string;
  form: string;
  stream: string;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  // Base URL of our Spring Boot backend
  private apiUrl = environment.apiUrl;

  // HttpClient is injected automatically by Angular's dependency injection
  constructor(private http: HttpClient) {}

  // Returns all students as an Observable
  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/students`);
  }
}
