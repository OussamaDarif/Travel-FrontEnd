import { Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Logement } from 'src/app/models/logement.model';
import { NotificationService } from 'src/app/services/notificaton.service';
import { ReservationsService } from 'src/app/services/reservation.service';
import { SearchbarService } from 'src/app/services/search_bar.service';
import { TokenStorageService } from 'src/app/services/token_storage.service';
import { DatePipe } from '@angular/common';
import { CurrencyService } from 'src/app/services/currency-convertor.service';
import * as CryptoJS from 'crypto-js';
import * as buffer from 'buffer';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  environment_host = environment.host;
  @ViewChild('fs2jkKOEh29828_9bdkc') parent: ElementRef;

  logement_reserver: Logement;

  arrivee_date;
  depart_date;

  prix_total:number;
  selected_Paiement:string = "";
  Difference_In_Days: number = 1
  global_rating = 0;
  user;
  constructor(
    private formBuilder: FormBuilder,
    public searchbarService: SearchbarService,
    public tokenStorageService: TokenStorageService,
    public reservationsService: ReservationsService,
    private notificationService: NotificationService,
    public currencyService: CurrencyService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private router:Router,
    private ngZone: NgZone,
    private renderer: Renderer2) {
      this.logement_reserver = this.searchbarService.searchbar_Data.logement_reserver;
      this.global_rating = this.logement_reserver['avis']['score']?.toFixed(2);
      this.user = this.tokenStorageService.getUser();
     }

  ngOnInit(): void {
    this.depart_date = this.searchbarService.searchbar_Data.depart_date
    this.arrivee_date = this.searchbarService.searchbar_Data.arrivee_date
    this.selected_Paiement = this.searchbarService.searchbar_Data.paiement_methode;
    this.calculate_days_between_two_dates(this.searchbarService.searchbar_Data.depart_date,this.searchbarService.searchbar_Data.arrivee_date);
      $(".paiement-btns").on('click', function () {
          $(".paiement-btns").removeClass("active");
          $(this).addClass("active");
      })
      // $(".service-btns").on('click', function () {
      //     $(this).toggleClass("active");
      // })
  }

  calculate_days_between_two_dates(depart_date,arrivee_date){
    if(depart_date != null && arrivee_date != null) {
      let newdepart_date = new Date(depart_date);
      let newarrivee_date = new Date(arrivee_date);
      let Difference_In_Time = newdepart_date.getTime() - newarrivee_date.getTime();
      let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      this.Difference_In_Days = Difference_In_Days > 0 ? Difference_In_Days : 1;
      this.calcul_Total();
    } else {
      this.calcul_Total();
    }
  }


  onClickPayer(){
    let isLoggedIn = !!this.tokenStorageService.getToken();
    if (isLoggedIn) {
      this.spinner.show();
      let reservation:any = {
         id_client: this.user.id,
         id_logement: this.logement_reserver._id,
         date_arrivee: this.arrivee_date,
         date_depart: this.depart_date,
         voyageurs: this.searchbarService.searchbar_Data.voyageur_categories,
         type_paiement: this.selected_Paiement,
         services: this.searchbarService.searchbar_Data.panier,
         prix_total: this.prix_total,
         reservation_number: this.generateNumber(15),
         nuits: this.Difference_In_Days,
         services_included: this.logement_reserver['services_included'],
         clientEmail: this.user.email,
         clientName: this.user.fullname,
         clientPhone: this.user.phone ? this.user.phone : ""
      }

      let email = {
        email:this.user.email,
        name: this.user.fullname,
        logement: this.logement_reserver.title,
        logement_slug: this.logement_reserver.slug,
        oid: reservation.reservation_number,
        arriveeDate: this.datePipe.transform(new Date(this.arrivee_date), 'dd-MM-yyyy')
      }
      // this.searchbarService.searchbar_Data.paiement_methode = this.selected_Paiement;
      this.reservationsService.create(reservation).subscribe({
        next: data => {
          const htmlCode = data['body'];
          const el = this.renderer.createElement('div');
          el.innerHTML = htmlCode;
          this.renderer.appendChild(this.parent.nativeElement, el);

          this.reservationsService.sendEmail(email).subscribe({
            next: data => {}, error: error => {}
          });
          this.notificationService.showNotification('top','right', 'success', 'Hébergement réservé avec succès');
          this.submitformpaiement();
          // reservation.id_logement = this.logement_reserver;
          // reservation.voyageurs = this.searchbarService.searchbar_Data.voyageurs;
          // this.ngZone.run(() =>  this.router.navigate(['/reservation_confirme'], { state: { reservation : reservation} }))
          // this.searchbarService.searchbar_Data.panier = [];
          // this.searchbarService.searchbar_Data.lat = null;
          // this.searchbarService.searchbar_Data.lng = null;
          // this.searchbarService.searchbar_Data.search_input = '';
          // this.searchbarService.searchbar_Data.depart_date = null;
          // this.searchbarService.searchbar_Data.arrivee_date = null;
        },
        error: error => {
          this.notificationService.showNotification('top','right', 'danger', 'Il y a une erreur quelque part, veuillez réessayer');
          this.spinner.hide();
        }
      });
    } else {
      this.notificationService.showNotification('top','right', 'warning', 'Veuillez vous connecter à votre compte pour terminer la réservation!!');
      this.ngZone.run(() =>  this.router.navigate(['/authentification/']))
    }
  }

  submitformpaiement() {
    let hashval = '';
    const formInputs = $('#formpaiement input, #formpaiement select').map(
      (index, element) => element.name
    ).get().sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    formInputs.forEach((element) => {
      if (element !== 'hash' && element !== 'encoding') {
        const escapedParamValue = $(`input[name=${element}], select[name=${element}]`).val().replace('|', '\\|').replace('\\', '\\\\');
        hashval = hashval + escapedParamValue + '|';
      }
    });
    const storeKey = $("input[name='storeKey']").val();
    hashval = hashval + storeKey;
    const calculatedHashValue = CryptoJS.SHA512(hashval).toString();
    const hash = buffer.Buffer.from(calculatedHashValue, 'hex').toString('base64');
    // Add hash to form as a hidden input
    $('<input type="hidden" name="hash">').val(hash).appendTo('#formpaiement');
    $('#formpaiement').submit();
  }

  view_logement(logement){
    this.ngZone.run(() =>  this.router.navigate(['/detailsHebergement', logement.slug], { state: { logement : logement} }))
  }

  calcul_Total(){
    this.prix_total =  ((this.logement_reserver.price * this.Difference_In_Days) + this.logement_reserver.service_fees + this.logement_reserver.cleaning_fees) - this.logement_reserver.reduction;
    this.logement_reserver['services_included'].forEach(service => {
      this.prix_total+= service.price
    });
    this.searchbarService.searchbar_Data.panier.forEach(service => {
      this.prix_total+= service.sous_total
    });
  }


  Indicator = 0
  prevBtn(){
    if(this.Indicator > 0){
      this.Indicator--
    }
  }

  nextBtn(){
    if(this.Indicator < this.logement_reserver.photos.length - 1  ){
      this.Indicator++
    }
  }


  convertCurrency(mad_original_price){
    return this.currencyService.convertCurrency(mad_original_price);
   }

   generateNumber(length){
    const USABLE_CHARACTERS = "0123456789".split("");
    return new Array(length).fill(null).map(() => {
      return USABLE_CHARACTERS[Math.floor(Math.random() * USABLE_CHARACTERS.length)];
    }).join("");
  }


}
