import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token_storage.service';
import { Location } from '@angular/common';
import { NotificationService } from 'src/app/services/notificaton.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./../authentification.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  changePasswordForm: FormGroup;


  //Authentification
  isLoggedIn = false;
  isLoginFailed = false;
  show_mdp_oublie;
  errorMessage = '';
  role: string[] = [];

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private notificationService: NotificationService,
              private router: Router,
              private ngZone: NgZone,
              private _location: Location) {

               }

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password:  ['', Validators.required],
    });
    this.changePasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    });
  }

  emailVerification(email){
    if(this.loginForm.get('email').errors == null){
      this.authService.emailCheck(email.target.value).subscribe({
        next: data => {
          if(data['user_check'] == 'isSimpleUser'){
            this.show_mdp_oublie = true;
          } else {
            this.show_mdp_oublie = false;
          }
        },
        error: err => {}
      });
    }
  }

  onSubmit(): void {
    const { email, password } =  this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.role = this.tokenStorage.getUser().role;
        if(history.state.isRegistred == true){
          this.router.navigate(['/']);
        } else {
          this.onBack();
        }
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  // reloadPage(): void {
  //   window.location.reload();
  // }

  // onSignin_gmail(){
  //   this.ngZone.run(() =>  this.router.navigate(['/authentification/google-auth'], { state: { urlAfterRedirects : true} }))
  // }

  onBack() {
    this._location.back();
  }

  googleLogIn(){
    this.router.navigate(['/google-auth']).then(() => {
      window.location.reload();
    });
  }


  onClickEnvoyer(){
    this.authService.changePwdEmail(this.changePasswordForm.value).subscribe({
      next: data => {
        this.notificationService.showNotification('top','right', 'success', 'Envoyée avec succès');
      },
      error: error => {
          this.notificationService.showNotification('top','right', 'danger', 'Il y a une erreur quelque part, veuillez réessayer');
      }
    });
  }

  showForgotPassword(){
    this.changePasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    });
  }

}
