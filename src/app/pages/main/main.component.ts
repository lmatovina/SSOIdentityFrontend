import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NgIf, RouterModule],
  templateUrl: './main.component.html',
  styles: ``
})
export class MainComponent implements AfterViewInit {
  @ViewChild('sidebar') sidebarElement!: ElementRef;
  private offcanvasInstance: any;

  constructor(private authService: AuthService, private router: Router) {}

  goToAdmin() {
  this.router.navigate(['/admin']);
}

  ngAfterViewInit(): void {
    this.offcanvasInstance = new bootstrap.Offcanvas(this.sidebarElement.nativeElement);
  }

  toggleSidebar(): void {
    this.offcanvasInstance.toggle();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
