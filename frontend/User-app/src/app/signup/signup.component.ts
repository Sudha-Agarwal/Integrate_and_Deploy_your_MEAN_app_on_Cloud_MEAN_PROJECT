import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  errors: any = {};
  focusedFields: { [key: string]: boolean } = {};
  apiUrl = environment.backendApiUrl;

  constructor(private http: HttpClient) {}

  onSubmit(form: NgForm) {
    this.http.post('${this.apiUrl}/api/signup', form.value).subscribe(
      (response:any) => {
        alert(response.message);
        form.reset(); // Reset the form after successful submission
        this.errors = {}; // Clear any previous errors

      },
      error => {
        if (error.error && error.error.errors) {
          this.errors = error.error.errors;          
        } else {
          console.error('An unexpected error occurred:', error);
        }
      }
    );
  }

  onFieldFocus() {
    this.errors = {};
  }

  onFieldBlur(field: any) {
    this.focusedFields[field.name] = false;
  }

}
