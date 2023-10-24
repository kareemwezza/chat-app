import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { HomeComponent } from "./pages/home/home.component";

import { redirectUnauthorizedTo, AuthGuard, redirectLoggedInTo } from "@angular/fire/auth-guard";

const redirectUnAuthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectAuthorizedTo = () => redirectLoggedInTo(['/home']);

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        title: 'Login',
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectAuthorizedTo }
    },
    {
        title: 'Register',
        path: 'register',
        component: RegisterComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectAuthorizedTo }
    },
    {
        title: 'Home',
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnAuthorizedToLogin }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
