import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Event, Router } from '@angular/router';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { interval, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notificaton.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./../authentification.component.scss']
})
export class RegisterComponent implements OnInit {
  loginForm: FormGroup;

  //Phone Number
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.Morocco,CountryISO.Canada,CountryISO.UnitedStates, CountryISO.UnitedKingdom];


  //Authentification
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  email_valid:boolean;
  validation_code:boolean;


  counter;
  counter_seconds = 60;
  counter_minutes = 3;

  changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
	}

  constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private notificationService: NotificationService,
      private router: Router,
      private ngZone: NgZone) {}

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      fullname:  ['', Validators.required],
      password:  ['', Validators.required],
      phone:  ['', [ Validators.required,Validators.minLength(10), Validators.maxLength(10)]]
    });
  }

  onSubmit(): void {
    if(this.email_valid == true){
      let { email, fullname, password, phone } = this.loginForm.value;
      phone = this.loginForm.value.phone["internationalNumber"];
      this.authService.register(email, fullname, password, phone).subscribe({
        next: data => {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.notificationService.showNotification('top','right', 'success', 'Votre compte a été créé avec succès,  Veuillez vous connecter !!');
          this.connectez();
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
        }
      });
    } else {
      this.email_valid = false;
      if (this.counter == null) {
        this.codeGenerated = this.generateNumber(8);
        this.notificationService.showNotification('top','right', 'success',
        'Un code de validation a été envoyé,  Vous recevrez un e-mail avec un code à 8 caractères pour valider votre e-mail');
        this.verifTimer();
        this.authService.sendEmail({email:this.loginForm.value.email,v_code:this.codeGenerated}).subscribe({
          next: data => {}, error: error => {}
        });
      }
    }
  }

  verifTimer(){
     // Update the count down every 1 second
     var index = 0;
     this.counter = "3m0s";
     var x = setInterval(()=>{
      index++;
      this.counter_seconds = this.counter_seconds  != 0 ? this.counter_seconds - 1 : 59;
      this.counter_minutes = this.counter_seconds == 59 ? this.counter_minutes - 1 : this.counter_minutes;
      this.counter = this.counter_minutes+"m" + this.counter_seconds +"s"
        if(index == 180){
          this.counter = null;
          this.counter_seconds = 60;
          this.counter_minutes = 3;
          this.codeGenerated = null
          clearInterval(x)
        }
    }, 1000);
  }

  code_validation;
  getValidationNumber(code_validation){
    this.code_validation = code_validation.target.value;
    if(this.codeGenerated == this.code_validation){
      this.email_valid = true
      this.notificationService.showNotification('top','right', 'success',
      'Votre e-mail a été vérifié avec succès, vous pouvez vous inscrire maintenant');
    } else if(this.code_validation.length == 8) {
      this.validation_code = false;
      // this.notificationService.showNotification('top','right', 'danger',
      // 'Code de validation invalide ou expiré');
    }
  }


  connectez(){
    this.ngZone.run(() => this.router.navigate(['/authentification/login'], { state: { isRegistred : true} }))
  }

  googleLogIn(){
    this.router.navigate(['/google-auth']).then(() => {
      window.location.reload();
    });
  }

  codeGenerated;
  generateNumber(length){
    const USABLE_CHARACTERS = "ABCDEFGHIJKLMNOPKRSTVWXYZ0123456789".split("");
    return new Array(length).fill(null).map(() => {
      return USABLE_CHARACTERS[Math.floor(Math.random() * USABLE_CHARACTERS.length)];
    }).join("");
  }

}
