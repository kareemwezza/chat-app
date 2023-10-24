import { FormControl } from "@angular/forms";

export interface IRegister extends ILogin{
  name: FormControl<string | null>;
  phone: FormControl<string | null>
}

export interface ILogin {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}