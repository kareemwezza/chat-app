import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { ApiService } from "../../services/api/api.service";
import { ILogin } from "../../types/IForm";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hidePassword = true;

  formGroup: FormGroup = new FormGroup<ILogin>({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(6), Validators.required]),
  });

  constructor(private authService: AuthService, private router: Router, private api: ApiService) {
  }

  async submitForm() {
    console.log(this.formGroup);
    this.authService.login(
      this.formGroup.value.email,
      this.formGroup.value.password
    ).then(() => {
      this.api.openSnackBar('Welcome Back!.');
      this.router.navigate(['/home']);
    }).catch(err => {
      this.api.openSnackBar(err.message);
      console.log(err)
    });
  }

}
