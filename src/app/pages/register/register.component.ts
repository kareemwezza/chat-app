import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { ApiService } from "../../services/api/api.service";
import { IRegister } from "../../types/IForm";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  hidePassword = true;

  formGroup: FormGroup = this.initFormGroup()

  constructor(
    private router: Router,
    private api: ApiService,
    private authService: AuthService,
  ) {
  }

  initFormGroup() {
    return new FormGroup<IRegister>({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      phone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.minLength(6), Validators.required]),
    });
  }


  async submitForm() {
    const {name, email, password, phone} = this.formGroup.value;
    this.authService.register(email, password)
      .then(data => {
      this.api.createUser(name, email, phone, data.user.uid).then(() => {
        this.api.openSnackBar('Congrats! You have joined us.');
      }).catch(err => {
        console.log('error occurred.', err);
        this.api.openSnackBar('Sorry An error occurred while creating your account.');
      })
      this.router.navigate(['/home']);
    }).catch(err => {
      this.api.openSnackBar(err.message);
    });
  }
}
