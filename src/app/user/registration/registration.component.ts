import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FirstKeyPipe, RouterModule],
  templateUrl: './registration.component.html',
  styles: ``
})
export class RegistrationComponent {
  constructor(
    public formBuilder: FormBuilder,
    private service: AuthService,
    private toastr: ToastrService,
  private router: Router) { }
  isSubmitted: boolean = false;

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get('password')
    const confirmPassword = control.get('confirmPassword')

    if (password && confirmPassword && password.value != confirmPassword.value)
      confirmPassword?.setErrors({ passwordMismatch: true })
    else
      confirmPassword?.setErrors(null)

    return null;
  }
  ngOnInit() {
  this.toastr.error('Test error poruka', 'Test');
}

  form = this.formBuilder.group({
    ime: ['', Validators.required],
    prezime: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)]],
    confirmPassword: [''],
  }, { validators: this.passwordMatchValidator })



  onSubmit() {
  this.isSubmitted = true;

  if (this.form.valid) {
    this.service.createUser(this.form.value).subscribe({
      next: (res: any) => {
        console.log('Response from register:', res);

        if (res?.message === 'User registered successfully.') {
          this.toastr.success('New user created!', 'Registration Successful');
          this.form.reset();
          this.isSubmitted = false;
          this.router.navigate(['/login']);
        }
      },
      error: err => {
 // console.log('Puni error objekt:', err);
 // console.log('Sadržaj err.error:', err.error);

  if (Array.isArray(err.error?.errors)) {
  err.error.errors.forEach((errorMsg: any) => {
    if (typeof errorMsg === 'string') {
      this.toastr.error(errorMsg, 'Registration Failed');
    } else {
      // fallback za slučaj da nije string, prikaži ga kao JSON
      this.toastr.error(JSON.stringify(errorMsg), 'Registration Failed');
    }
  });
} else if (typeof err.error?.message === 'string') {
  this.toastr.error(err.error.message, 'Registration Failed');
} else {
  this.toastr.error('Unexpected error occurred.', 'Registration Failed');
}
}

    });
  }
}



  hasDisplayableError(controlName: string): Boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched)|| Boolean(control?.dirty))
  }

  showPassword = false;
showConfirmPassword = false;

togglePasswordVisibility(field: 'password' | 'confirmPassword') {
  if (field === 'password') {
    this.showPassword = !this.showPassword;
  } else {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}



}
