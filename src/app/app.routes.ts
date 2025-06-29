import { Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { UserComponent } from './user/user.component';
import { MainComponent } from './pages/main/main.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: UserComponent },
  {path: 'main', component: MainComponent, canActivate: [AuthGuard]},
  {path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard], data: { role: 'Admin' } },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // default ruta
  { path: '**', redirectTo: 'login' } // fallback
];
