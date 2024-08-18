import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  apiUrl = environment.backendApiUrl;

  constructor(private http: HttpClient) {}

  onSubmit(loginForm: NgForm) {
    if (loginForm.invalid) {
      // Form is invalid, do not submit
      return;
    }

    // Form is valid, proceed with form submission
    const formData = loginForm.value;

    // Call your login API endpoint
    this.http.post<any>('${this.apiUrl}/api/login', formData).subscribe(
      (response: any) => {
        alert(response.message); // Display success message
        loginForm.resetForm(); // Reset the form after successful login
      },
      error => {
        console.error('An error occurred:', error); // Log error to console
        alert(error.error.error)
        // Handle error display or other actions as needed
      }
    );
  }

}
