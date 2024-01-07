import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactsService } from 'src/app/services/contact.service';
import { NotificationService } from 'src/app/services/notificaton.service';
import { SearchbarService } from 'src/app/services/search_bar.service';
import { TokenStorageService } from 'src/app/services/token_storage.service';
import { GoogleApiService, UserInfo } from '../../services/google-api.service';

declare var $: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  contactForm: FormGroup;
  navbar_filter;

  userInfo?: UserInfo
  isLoggedIn;

  currentDate = new Date();

  constructor(private formBuilder: FormBuilder,
              private contactsService:ContactsService,
              private notificationService: NotificationService,
              private  searchbarService: SearchbarService,
              private tokenStorageService: TokenStorageService,
              private googleApi: GoogleApiService) {
                this.navbar_filter = searchbarService.searchbar_Data;
               }

  ngOnInit(): void {
    this.initForm();
    this.googleApi.userProfileSubject.subscribe( info => {
      this.userInfo = info;
    })
    this.isLoggedIn = !!this.tokenStorageService.getToken();
  }


  initForm() {
    this.contactForm = this.formBuilder.group({
      nom:  ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', Validators.required],
      sujet: ['', Validators.required],
      message: ['', Validators.required]
    });
  }


  onClickEnvoyer(){
    this.contactsService.create(this.contactForm.value).subscribe({
      next: data => {
        this.notificationService.showNotification('top','right', 'success', 'Envoyée avec succès');
        $('#contactModalGlobal').modal('toggle');
      },
      error: error => {
          this.notificationService.showNotification('top','right', 'danger', 'Il y a une erreur quelque part, veuillez réessayer');
      }
    });
  }


}
