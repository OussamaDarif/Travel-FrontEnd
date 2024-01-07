import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LightGallery } from 'lightgallery/lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';
import lgFullscreen from 'lightgallery/plugins/fullscreen';
import lgRotate from 'lightgallery/plugins/rotate';
import lgVideo from 'lightgallery/plugins/video';
import lgShare from 'lightgallery/plugins/share';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { SearchbarService } from '../../services/search_bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Logement } from 'src/app/models/logement.model';
import { LogementsService } from 'src/app/services/logements.service';
import { Service } from 'src/app/models/service.model';
import { NotificationService } from 'src/app/services/notificaton.service';
import { TokenStorageService } from 'src/app/services/token_storage.service';
import { AvisService } from 'src/app/services/avis.service';
import { DateAdapter } from '@angular/material/core';
import { CurrencyService } from 'src/app/services/currency-convertor.service';
import { environment } from 'src/environments/environment';


declare var $: any;

@Component({
  selector: 'app-details-hebergement',
  templateUrl: './details-hebergement.component.html',
  styleUrls: ['./details-hebergement.component.scss']
})
export class DetailsHebergementComponent implements OnInit {

  // @ViewChild(BsDatepickerDirective, { static: false }) datepicker?: BsDatepickerDirective;

  // @HostListener('window:scroll', ['$event'])

  // onScrollEvent(data) {
  //   console.log('Hy, Achraf Mouljebouj');
  //   this.datepicker?.hide();
  // }
  environment_host = environment.host;
  user = this.tokenStorageService.getUser();

  private lightGallery!: LightGallery;
  private needRefresh = false;
  ngAfterViewChecked(): void {
    if (this.needRefresh) {
      this.lightGallery.refresh();
      this.needRefresh = false;
    }
  }

  searchForm: FormGroup;
  getlogement:Logement;

  voyageur_categories = [{
    Adultes: 0
    },
    {
      Enfants: 0
    },
    {
      Bebes: 0
    },
  ];

  voyageurs: number = 0
  Difference_In_Days: number = 1
  settings = {
    counter: true,
    plugins: [lgZoom,lgFullscreen,lgRotate,lgVideo,lgShare]

  };

  filtred_Panier = [];

  onInit = (detail): void => {
    this.lightGallery = detail.instance;
    // $('selector').addClass(class_name);
    $('.collapseOne').hide("fast");
    $('.showDetail').on('click', function () {
      $('.collapseOne').slideToggle("fast");
    });
  };

  options: any = {
    zoom: 10,
    fullscreen:true
  };

  search_globV;
  prix_total:number;
  global_rating = 0;

  constructor(
    private formBuilder: FormBuilder,
    private searchbarService: SearchbarService,
    private router: Router,
    private route: ActivatedRoute,
    private logementsService: LogementsService,
    private avisService: AvisService,
    private tokenStorageService: TokenStorageService,
    private notificationService: NotificationService,
    public currencyService: CurrencyService,
    private _adapter: DateAdapter<any>,
    ) {

      this.search_globV = this.searchbarService.searchbar_Data;
      this._adapter.setLocale('fr');

      const slug = this.route.snapshot.params['slug'];
      if(history.state.logement){
        this.getlogement = history.state.logement;
        this.global_rating = this.getlogement['avis']['score']?.toFixed(2);
        this.calculate_days_between_two_dates(this.search_globV.depart_date,this.search_globV.arrivee_date);
        var panier:any[] = this.search_globV.panier;
        if (panier.length > 0) {
            this.filtred_Panier = panier.filter(item => !this.getlogement["services_included"].some(service => service._id == item.id));
        }
      } else {
        if(!slug) {
          this.router.navigate(['/nosLogements'])
        } else {
          this.getLogement(slug)
        }
      }

    }

    ngOnInit(): void {
      this.initForm();
    }

    getLogement(slug: string): void {
      this.logementsService.findOne(slug)
        .subscribe({
          next: (data) => {
            if(!data[0]) {
              this.notificationService.showNotification('top','right', 'warning', 'Aucun logement trouvé!!');
              this.router.navigate(['/nosLogements'])
            } else {
              this.getlogement = data[0];
              this.global_rating = this.getlogement['avis']['score']?.toFixed(2);
              if(this.getlogement.number_fans && this.getlogement.number_fans.find(fav=> fav == this.user.id)) {
                this.getlogement.ispreferred = true;
               }
              this.calcul_Total();
              var panier:any[] = this.search_globV.panier;
              if (panier.length > 0) {
                  this.filtred_Panier = panier.filter(item => !this.getlogement["services_included"].some(service => service._id == item.id));
              }
            }
          },
          error: (e) => console.error(e)
        });
    }

    initForm() {
      this.searchForm = this.formBuilder.group({
        arrivee: ['', Validators.required],
        depart: ['', Validators.required]
      });
    }

  onClickplus(key, $event) {
    this.searchbarService.onClickplus(key, $event)
  }

  onClickminus(key, $event) {
    this.searchbarService.onClickminus(key, $event)
  }


  onClick_Reserver(){
    this.search_globV.logement_reserver = this.getlogement;
    this.search_globV.panier = this.filtred_Panier;
    this.search_globV.depart_date = this.searchForm.value.depart;
    this.search_globV.arrivee_date = this.searchForm.value.arrivee;
    this.router.navigate(['/confirmationLogement'])
  }


  calcul_Total(){
    this.prix_total =  ((this.getlogement.price * this.Difference_In_Days) + this.getlogement.service_fees + this.getlogement.cleaning_fees) - this.getlogement.reduction;
    this.getlogement['services_included'].forEach(service => {
      this.prix_total+= service.price;
    });
  }

  calculate_days_between_two_dates(depart_date,arrivee_date){
    if(depart_date != null && arrivee_date != null) {
      let Difference_In_Time = depart_date.getTime() - arrivee_date.getTime();
      let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      this.Difference_In_Days = Difference_In_Days > 0 ? Difference_In_Days : 1;
      this.calcul_Total();
    } else {
      this.calcul_Total();
    }
  }

  getArriveeDate(){
    if(this.search_globV.depart_date != null && this.search_globV.arrivee_date != null){
      this.calculate_days_between_two_dates(this.search_globV.depart_date,this.search_globV.arrivee_date);
    }
  }

  getDepartDate(){
    if(this.search_globV.arrivee_date != null && this.search_globV.depart_date != null){
      this.calculate_days_between_two_dates(this.search_globV.depart_date,this.search_globV.arrivee_date);
    }
  }



  onBack() {
    this.router.navigate(['/nosLogements']);
  }

  logement_Url:string = "";
  onClickShare(logement:Logement) {
    this.logement_Url = 'https://travelbyrec.com/detailsHebergement/' + logement.slug;
  }

  onClickfavorite(logement) {
    if(!this.user.id){
      this.notificationService.showNotification('top','right', 'info', 'Vous devez d\'abord vous connecter !!');
    }
    if(logement.number_fans && !logement.number_fans.find(fav=> fav == this.user.id)) {
      logement.number_fans.push(this.user.id);
      logement.ispreferred = true;
    } else {
      logement.number_fans = logement.number_fans ? logement.number_fans.filter(fav=> fav != this.user.id) : []
      logement.ispreferred = null;
    }
    this.logementsService.updateOne(logement._id,logement).subscribe({
      next: data => {},
      error: error => {
          this.notificationService.showNotification('top','right', 'danger', 'Il y a une erreur quelque part, veuillez réessayer');
      }
    });
  }


  convertCurrency(mad_original_price){
   return this.currencyService.convertCurrency(mad_original_price);
  }

}
