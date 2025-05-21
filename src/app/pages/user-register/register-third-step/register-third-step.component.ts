
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InterestTagComponent } from "../../../components/interest-tag/interest-tag.component";
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiService } from '../../../services/api-service.service';
import { FormService } from '../../../services/form-service/form.service';
import { HttpClient } from '@angular/common/http';
import { HTTPUserService } from '../../../services/api-services/HTTPUserService';
import { ServiceFactory } from '../../../services/api-services/ServiceFactory.service';
import { UserService } from '../../../../architecture/services/UserService';
import { LanguageService } from '../../../language.service';

@Component({
  selector: 'app-register-third-step',
  imports: [InterestTagComponent, FormsModule],
  templateUrl: './register-third-step.component.html',
  styleUrl: './register-third-step.component.css'
})
export class RegisterThirdStepComponent {

  protected newTag: string = "";
  protected interests: string[] = [];
  protected storedInterests: string[] = [];
  protected interestsCoincidences: string[] = [];
  protected userData!: FormService;
  constructor(private router: Router, 
    private apiService: ApiService, 
    private formData: FormService, 
    private http: HttpClient, 
    private serviceFactory: ServiceFactory,
    private languageService: LanguageService) {}

    ngOnInit() {
    this.userData = this.formData.get('userRegister');
    this.apiService.getInterests().subscribe(res => {
        // @ts-ignore
        this.storedInterests = [...res].map(e => e["name"]);
    });
  }


  goToSecondStep() {
    this.router.navigate(['/user-register/secondStep']);
  }

  goToLogin() {
    const apiUrl = 'http://localhost:3000/user-register';
    const payload = this.userData.get('payload');
    // Realizamos registro
    this.http.post(apiUrl, payload).subscribe(
      (response) => {
        console.log('User registered successfully:', response);
        Swal.fire({
          title: 'Success!',
          text: 'User registered successfully.',
          icon: 'success',
          confirmButtonText: 'Continue',
          backdrop: false, // Evita que SweetAlert2 cambie el <body>
          customClass: {
            popup: 'custom-swal-popup' // Añade una clase personalizada
          },
          didOpen: () => {
            document.body.insertAdjacentHTML(
              'beforeend',
              '<div id="blur-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.3);backdrop-filter:blur(10px);z-index:2;"></div>'
            );
          },
          didClose: () => {
            const blurOverlay = document.getElementById('blur-overlay');
            if (blurOverlay) blurOverlay.remove();
          }
        });
      },
      (error) => {
        console.error('Error during registration:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error during registration. Please try again.',
          icon: 'error',
          confirmButtonText: 'Retry',
          backdrop: false, // Evita que SweetAlert2 cambie el <body>
          customClass: {
            popup: 'custom-swal-popup' // Añade una clase personalizada
          },
          didOpen: () => {
            document.body.insertAdjacentHTML(
              'beforeend',
              '<div id="blur-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.3);backdrop-filter:blur(10px);z-index:2;"></div>'
            );
          },
          didClose: () => {
            const blurOverlay = document.getElementById('blur-overlay');
            if (blurOverlay) blurOverlay.remove();
          }
        });
      }
    );

    this.router.navigate(['/login']);
  }



  
  addInterestTag(event: Event, value: string) {
        event.preventDefault();
        if (!this.storedInterests.includes(value)) {
          if (this.languageService.current == 'en') {
            Swal.fire("Error!", "Interest not found!", "error");
          } else {
            Swal.fire("¡Error!", "Interés no encontrado.", "error");
          }
          return;
        }
        let normalizedValue = `#${value}`.toLowerCase();
        if (!(this.interests.includes(normalizedValue))) this.interests = [...this.interests, normalizedValue];
        this.newTag = "";
    }

    removeInterest(interestName: string) {
        this.interests = this.interests.filter(i => i !== interestName);
    }

    getCoincidences(event: Event, value: string) {
        this.interestsCoincidences = this.storedInterests.filter(i => value !== '' && i.startsWith(value)).filter(i => !this.interests.includes(`#${i}`.toLowerCase()));
    }
    addInterestTagFromCoincidence($event: MouseEvent, interest: string) {
      this.interestsCoincidences = this.interestsCoincidences.filter(i => i !== interest);
      this.addInterestTag($event, interest);
  }
}
