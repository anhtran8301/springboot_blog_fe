import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { LoginModel } from 'src/app/models/Login';
import { AuthService } from 'src/app/service/auth.service';
import { TokenService } from 'src/app/service/token.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  passwordRegex = "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\d\\s:])([^\\s]){8,16}$";
  hide = true;
  loginForm: any = {};
  loginModel!: LoginModel

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private toast: ToastrService,
    private router: Router

  ) { }

  ngOnInit() {
  }

  login() {
    this.loginModel = new LoginModel(
      this.loginForm.usernameOrEmail,
      this.loginForm.password
    )
    this.authService.login(this.loginModel).subscribe(data => {
      console.log(data);
      //@ts-ignore
      this.tokenService.setName(data.user.name);
      //@ts-ignore
      this.tokenService.setAvatar(data.user.avatar);
      //@ts-ignore
      this.tokenService.setToken(data.accessToken);
      //@ts-ignore
      this.tokenService.setRole(data.user.roles)

      this.router.navigate(['']).then(() => {
        window.location.reload();
      })
    }, errorResponse => {
      this.toast.error(errorResponse.error.message, "Login fail !!!")
    })
  }



}