import { Component,NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token_storage.service';
import { Location } from '@angular/common';
import { NotificationService } from 'src/app/services/notificaton.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./../authentification.component.scss']
})
export class ResetpasswordComponent implements OnInit {
  changePasswordForm: FormGroup;


  //Authentification
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  routeSub;
  user_id:string;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private notificationService: NotificationService,
              private route: ActivatedRoute,
              private router: Router,
              private _location: Location,
              private ngZone: NgZone) {

               }

  ngOnInit(): void {
    this.initForm()
    this.routeSub = this.route.params.subscribe((data:Params) =>  {
     this.user_id = data["id"];
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  initForm() {
    this.changePasswordForm = this.formBuilder.group({
      password:  ['', Validators.required],
      confirm_password:  ['', Validators.required],
    });
    this.changePasswordForm.addValidators(
      this.createCompareValidator(
        this.changePasswordForm.get('password'),
        this.changePasswordForm.get('confirm_password')
      )
    );
  }

 createCompareValidator(controlOne: AbstractControl, controlTwo: AbstractControl) {
    return () => {
    if (controlOne.value !== controlTwo.value)
    return { match_error: 'Les mots de passe ne correspondent pas' };
    return null;
  };

}

  onSubmit(): void {
    this.authService.resetPassword({userId:this.user_id,newPassword:this.changePasswordForm.value.confirm_password}).subscribe({
      next: data => {
        this.notificationService.showNotification('top','right', 'success', 'Mot de passe réinitialisé avec succès');
        this.connectez();
      },
      error: err => {
        this.notificationService.showNotification('top','right', 'danger', 'Il y a une erreur quelque part, veuillez réessayer');
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  connectez(){
    this.ngZone.run(() => this.router.navigate(['/authentification/login'], { state: { isRegistred : true} }))
  }

}
