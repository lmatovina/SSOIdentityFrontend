import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserWithRoles } from '../models/user-with-roles';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5069/api/user'; // prilagodi ako endpoint ima drugačiji path

  constructor(private http: HttpClient) {}

  getAllUsersWithRoles(): Observable<UserWithRoles[]> {
  return this.http.get<UserWithRoles[]>('http://localhost:5069/api/user/users');
}

  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-role`, { userId, role });
  }
}
