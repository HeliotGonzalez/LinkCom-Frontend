import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api-service.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LinkCom-FrontEnd';
}
