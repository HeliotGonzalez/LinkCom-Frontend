import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommunityCardComponent } from './community-card/community-card.component';
import { ApiService } from '../services/api-service.service';
import { Community } from '../interfaces/community';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

interface GetUserCommunitiesResponse {
  data: { id: string }[];
}

@Component({
  selector: 'app-comunities',
  standalone: true,
  imports: [FormsModule, CommonModule, CommunityCardComponent],
  templateUrl: './comunities.component.html',
  styleUrl: './comunities.component.css'
})
export class ComunitiesComponent {
  protected communities: Community[] = [];
  protected joinedCommunities: Community[] = [];
  protected notJoinedCommunities: Community[] = [];
  protected userCommunitiesIDs: string[] = [];
  protected userID: string = '';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.userID = this.authService.getUserUUID();
    console.log('[DEBUG] Usuario conectado UUID:', this.userID);

    if (!this.userID) {
      console.error('❌ No se ha podido obtener el UUID del usuario. Aborta carga de comunidades.');
      return;
    }

    await this.fetchCommunities();
  }

  async fetchCommunities(): Promise<void> {
    return new Promise((resolve) => {
      let completedRequests = 0;
      let allCommunities: Community[] = [];

      this.apiService.getCommunities().subscribe({
        next: (res) => {
          allCommunities = res;
          completedRequests++;
          if (completedRequests === 2) {
            this.reorderCommunities(allCommunities);
            resolve();
          }
        },
        error: (err) => console.error('Error al obtener comunidades:', err),
      });

      this.apiService.getUserCommunities(this.userID).subscribe({
        next: (res: GetUserCommunitiesResponse) => {
          this.userCommunitiesIDs = Array.isArray(res.data)
            ? res.data.map((c) => c.id)
            : [];

          completedRequests++;
          if (completedRequests === 2) {
            this.reorderCommunities(allCommunities);
            resolve();
          }
        },
        error: (err) => {
          console.error('Error al obtener comunidades del usuario:', err);
          this.userCommunitiesIDs = [];
          completedRequests++;
          if (completedRequests === 2) {
            this.reorderCommunities(allCommunities);
            resolve();
          }
        },
      });
    });
  }

  private reorderCommunities(allCommunities: Community[]) {
    this.joinedCommunities = allCommunities.filter(c => this.userCommunitiesIDs.includes(c.id));
    this.notJoinedCommunities = allCommunities.filter(c => !this.userCommunitiesIDs.includes(c.id));
    this.communities = [...this.joinedCommunities, ...this.notJoinedCommunities];
  }

  showCommunityForm() {
    this.router.navigate(['firstStepCommunityCreation']).then();
  }

  joinCommunity(community: Community) {
    if (!this.userID) {
      console.error('❌ userID es undefined al intentar unirse');
      return;
    }

    if (this.userCommunitiesIDs.includes(community.id)) {
      Swal.fire({
        title: "Ya estás dentro",
        text: `Ya eres miembro de ${community.name}.`,
        icon: "info"
      });
      return;
    }

    console.log('[DEBUG] Join:', { userID: this.userID, communityID: community.id });

    this.apiService.joinCommunity(this.userID, community.id).subscribe({
      next: res => {
        this.userCommunitiesIDs.push(community.id);
        this.reorderCommunities(this.communities);

        Swal.fire({
          title: "¡Unido!",
          text: `Bienvenido a ${community.name}!`,
          icon: "success"
        });
      },
      error: res => {
        Swal.fire({
          title: "Error",
          text: `No se pudo unir a ${community.name}.`,
          icon: "error"
        });
      }
    });
  }

  leaveCommunity(community: Community) {
    if (!this.userID) {
      console.error('❌ userID es undefined al intentar salir');
      return;
    }

    if (!this.userCommunitiesIDs.includes(community.id)) {
      Swal.fire({
        title: "No estás dentro",
        text: `No eres miembro de ${community.name}.`,
        icon: "info"
      });
      return;
    }

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: "¿Estás seguro?",
      text: "¡Puedes volver cuando quieras!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "No, cancelar",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.leaveCommunity(this.userID, community.id).subscribe({
          next: res => {
            this.userCommunitiesIDs = this.userCommunitiesIDs.filter(id => id !== community.id);
            this.reorderCommunities(this.communities);

            Swal.fire("¡Saliste!", `Ya no formas parte de ${community.name}.`, "success");
          },
          error: res => {
            Swal.fire("Error", `No se pudo salir de ${community.name}.`, "error");
          }
        });
      }
    });
  }
}
