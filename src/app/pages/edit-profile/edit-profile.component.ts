import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router }       from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService }   from '../../services/api-service.service';
import { AuthService }  from '../../services/auth.service';
import { User }         from '../../../architecture/model/User';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProfileComponent implements OnInit {
  user!: User;
  saving = false;
  profileForm: any;


  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
  ) {
    this.profileForm = this.fb.group({
      username:     ['', [Validators.required, Validators.maxLength(24)]],
      description:  [''],
      email:        ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const id = this.auth.getUserUUID();
    this.api.getUserProfile(id).subscribe(res => {
      this.user = res.data;
      this.profileForm.patchValue({
        username:    this.user.username,
        description: this.user.description,
        email:       this.user.email
      });
    });
  }

  /** Submit form */
  onSubmit(): void {
    if (this.profileForm.invalid) { return; }

    this.saving = true;
    this.api
      .updateUser(this.user.id!, this.profileForm.value)
      .subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/homepage']);
        },
        error: err => {
          console.error(err);
          this.saving = false;
        }
      });
  }
}
