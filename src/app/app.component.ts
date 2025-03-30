import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common'; 
import { ApiService } from './services/api-service.service';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { HeaderVisibilityService } from './services/header-visibility.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    HeaderComponent,
    CommonModule,
    RouterOutlet,
  ],
})
export class AppComponent implements OnInit {
  title = 'LinkCom-FrontEnd';
  data: any;
  fontSize: any;
  email: string = '';
  showHeader = true;

  constructor(private apiService: ApiService, private http: HttpClient, private headerService: HeaderVisibilityService) {}

  ngOnInit() {
    this.headerService.showHeader$.subscribe(show => {
      setTimeout(() => {
        this.showHeader = show;
      });
    });
  }

  onSubmit() {
    const apiUrl = 'http://localhost:3000/add-email';
    const payload = { email: this.email };

    this.http.post(apiUrl, payload).subscribe(
      (response) => {
        console.log('Email submitted successfully:', response);
        alert('Email submitted successfully!');
      },
      (error) => {
        console.error('Error submitting email:', error);
        alert('Failed to submit email.');
      }
    );
  }

}
