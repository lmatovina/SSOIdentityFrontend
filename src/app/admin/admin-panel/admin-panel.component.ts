import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { UserWithRoles } from '../../shared/models/user-with-roles';
import { NgIf } from '@angular/common';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './admin-panel.component.html',
  styles: ``
})
export class AdminPanelComponent implements OnInit {
  users: UserWithRoles[] = [];
  availableRoles: string[] = ['User', 'Admin'];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsersWithRoles().subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error(err)
    });
  }

  onRoleChange(event: Event, userId: string) {
  const newRole = (event.target as HTMLSelectElement).value;
  this.userService.updateUserRole(userId, newRole).subscribe({
    next: () => {
      console.log('User role updated');
      // nađi korisnika u nizu i ažuriraj njegove role
      const user = this.users.find(u => u.id === userId);
      if (user) {
        user.roles = [newRole]; // ili druga logika ako ima više uloga
      }
    },
    error: (err) => console.error('Failed to update role:', err)
  });
}
}
