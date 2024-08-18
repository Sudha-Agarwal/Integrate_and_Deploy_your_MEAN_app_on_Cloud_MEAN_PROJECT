import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  users: any[] = []; // Array to hold the list of users
  apiUrl = environment.backendApiUrl;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    // Fetch list of users from an API endpoint
    //const backendIp = process.env['BACKEND_IP_ADD'] || 'localhost';
    
    this.http.get<any[]>(`${this.apiUrl}/api/users`).subscribe(
      (response: any[]) => {
        this.users = response; // Assign response to users array
      },
      error => {
        console.error('An error occurred while fetching users:', error);
        // Handle error display or other actions as needed
      }
    );
  }

  deleteUser(userId: string) {
    // Call your delete user API endpoint with the userId
    this.http.delete(`${this.apiUrl}/api/users/${userId}`).subscribe(
      () => {
        alert('User deleted successfully');
        // After deleting, fetch the updated user list to reflect changes
        this.fetchUsers();
      },
      error => {
        console.error('An error occurred while deleting user:', error);
        // Handle error display or other actions as needed
      }
    );
  }

  clicked(){
    alert('button clicked')
  }
}
