import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api-service.service';
import { CommunityFormCardComponent } from './community-form-card/community-form-card.component'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommunityFormCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LinkCom-FrontEnd';
}
