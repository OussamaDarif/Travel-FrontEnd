import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Equipement } from 'src/app/models/equipement.model';
import { Logement } from 'src/app/models/logement.model';
import { Service } from 'src/app/models/service.model';
import { LogementsService } from 'src/app/services/logements.service';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { SearchbarService } from 'src/app/services/search_bar.service';
import { EquipementsService } from 'src/app/services/equipements.service';
import { NotificationService } from 'src/app/services/notificaton.service';
import { TokenStorageService } from 'src/app/services/token_storage.service';
import { GoogleApiService } from 'src/app/services/google-api.service';
import { CurrencyService } from 'src/app/services/currency-convertor.service';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-nos-logements',
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        height: '200px',
        opacity: 1,
        backgroundColor: 'yellow'
      })),
      state('closed', style({
        height: '100px',
        opacity: 0.8,
        backgroundColor: 'blue'
      })),
      transition('open => closed', [
        animate('1s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
  templateUrl: './nos-logements.component.html',
  styleUrls: ['./nos-logements.component.scss']
})
export class NosLogementsComponent implements OnInit {
  environment_host = environment.host;

  options: any = {
    lat: 33.897874690835174,
    lng: -6.8639907732354,
    zoom: 10,
    fullscreen:true
  };

  logements: any = []

  searchbar_Data;

  equipements: any = []

  details_logement = {
    Lits: 0,
    Chambres: 0,
    Salles_bain: 0
  }

  types_logement: any[] = []

  selected_avis = '';
  p2
  data_equipements:any[] = [];
  max_price = 0;
  maxPrice_Logement = 0;
  minPrice_Logement = 0;
  user = this.tokenStorageService.getUser();
  hideShimmer:boolean = false;
  constructor(private ngZone: NgZone,
              private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private logementsService: LogementsService,
              private mapsAPILoader: MapsAPILoader,
              private  searchbarService: SearchbarService,
              private equipementsService: EquipementsService,
              private notificationService: NotificationService,
              private tokenStorageService: TokenStorageService,
              public currencyService: CurrencyService
              ) {
                this.searchbar_Data = this.searchbarService.searchbar_Data;
               }

  ngOnInit(): void {
    this.getEquipements();
    this.getLogements();
  }

  getEquipements() {
    this.equipementsService.findAllcategories().subscribe({
      next: data => {
        this.equipements = data
        this.equipements.forEach(equipement => {
          this.image_Equipements_Exists(equipement)
        });
        this.addEquipementsfilter(this.data_equipements);
      },
      error: error => {console.log("error",error);
      }
    });
  }

  getLogements(){
    this.logementsService.findAll_logements().subscribe({
      next: data => {
        this.logements = data
        this.minPrice_Logement =  Math.min(...this.logements.map(item => item.price));
        this.maxPrice_Logement = Math.max(...this.logements.map(item => item.price));
        this.max_price = this.maxPrice_Logement;
        this.logements.forEach((logement:Logement) => {
          this.imageExists(logement)
          this.setTypeslogement(logement.type);
            if(logement.number_fans && logement.number_fans.find(fav=> fav == this.user.id)) {
               logement.ispreferred = true;
              }
          });
        this.searchbar_Data.filtred_logements = this.logements;
        setTimeout(() => {
        this.hideShimmer = true;
        }, 1000);

        this.route.queryParams.subscribe((data:Params) =>  {
          if(data['type_p'] && data['type_p']!=null) {
            this.getTypelogement(data['type_p']); this.searchbar_Data.selected_type = data['type_p'];
          }
          if(data['avis'] && data['avis'] != null) {
            this.getAvis_value(data['avis']); this.searchbar_Data.selected_avis = data['avis'];
          }
          if(data['rayon'] && data['rayon']!=null) {
            if(this.searchbar_Data.lat){
              this.searchbar_Data.selected_rayon = data['rayon'];
              this.getDistance_value(this.searchbar_Data.selected_rayon);
            }
          }
          if(data['equipements'] && data['equipements']!=null && data['equipements'].length > 0) {
            this.data_equipements = data['equipements'];
            this.getEquipements();
          } else {
            this.searchbarService.searchbar_Data.filtred_logements.forEach((logement:Logement) => {
              logement.disableEq = null;
            });
          }
          if(data['max_price'] && data['max_price']!=null) {
            this.getMaxprice(data['max_price']);
          }
          if(data['beds']) {
            this.details_logement = {
              Lits: data['beds'],
              Chambres: data['bedrooms'],
              Salles_bain: data['bathrooms']
            }
            this.getDetails_logement(this.details_logement);
          }
        });
      },
      error: error => {}
    });
  }

  imageExists(logement){
    if(!logement.photos) logement.photos = undefined
    logement.equipements.forEach((equipement:Equipement) => {
      const image = this.environment_host  + equipement.icon
      let img = new Image();
      img.src = image;
      img.onerror = (() => {
        equipement.icon = undefined
        console.clear();
      });
    });
    logement.services_included.forEach((service:Service) => {
      const image = this.environment_host  + service.image
      let img = new Image();
      img.src = image;
      img.onerror = (() => {
        service.image = undefined
        console.clear();
      });
    });
  }

  getDistance_value(value_km) {
    let km = value_km.target ? value_km.target.value : value_km;
    this.searchbar_Data.selected_rayon = km;
      if(this.searchbar_Data.lat){
        this.mapsAPILoader.load().then(() => {
          this.searchbar_Data.filtred_logements.forEach((logement:Logement,index:any) => {
            var search_value = new google.maps.LatLng(this.searchbar_Data.lat, this.searchbar_Data.lng);
            var logement_location = new google.maps.LatLng(logement.location[0].lat, logement.location[0].lng);
            var distance = google.maps.geometry.spherical.computeDistanceBetween(search_value, logement_location);
            var distance_par_km = distance/1000;
            if(km == "exact"){
              if(distance_par_km != 0){
                logement.disable = true;
              }
            } else if(parseInt(km) < distance_par_km){
                logement.disable = true;
            } else {
                logement.disable = null;
            }
          });
          this.router.navigate(['/nosLogements'], {relativeTo: this.route, queryParamsHandling: 'merge',queryParams:{rayon:this.searchbar_Data.selected_rayon}} );
          // this.getTypelogement( this.searchbar_Data.selected_type);
        });
      } else {
        this.notificationService.showNotification('top','right', 'danger', 'Veuillez entrer l\'adresse dans la barre ci-dessus ou aller à la page d\'accueil');
        this.searchbar_Data.selected_rayon = '';
        this.router.navigate(['/nosLogements'], {relativeTo: this.route, queryParamsHandling: 'merge',queryParams:{rayon:this.searchbar_Data.selected_rayon}} );
        // this.getTypelogement( this.searchbar_Data.selected_type);
      }

  }

  setTypeslogement(type_logement){
    let verify_types = this.types_logement.filter(type => type === type_logement);
    if(verify_types.length === 0) {
      this.types_logement.push(type_logement);
    }
  }

  getTypelogement(type_logement){
    this.searchbar_Data.selected_type = type_logement.target ? type_logement.target.value : type_logement;
    // if(this.searchbar_Data.selected_type != ""){
    //   this.searchbar_Data.filtred_logements = this.logements.filter((logement:Logement)=> logement.type.toLowerCase() ===  this.searchbar_Data.selected_type);
    // }
    // if((type_logement.target ? type_logement.target.value : null) == ''){
    //   this.searchbar_Data.filtred_logements = this.logements;
    // }
    this.searchbar_Data.filtred_logements.forEach((logement:Logement,index:any) => {
       if((logement.type !=  this.searchbar_Data.selected_type) && this.searchbar_Data.selected_type != ""){
          logement.disableType = true;
      } else {
          logement.disableType = null;
      }
    });
    this.router.navigate(['/nosLogements'], {relativeTo: this.route, queryParamsHandling: 'merge',queryParams:{type_p: this.searchbar_Data.selected_type}} );
  }

  getAvis_value(avis){
    var avis_value = avis.target ? avis.target.value : avis;
    this.searchbar_Data.selected_avis = avis_value != "" ? parseInt(avis_value) : "";
    this.searchbar_Data.filtred_logements.forEach((logement:Logement,index:any) => {
      if((logement["avis"]["score"] >= this.searchbar_Data.selected_avis && logement["avis"]["score"] < (this.searchbar_Data.selected_avis + 1)) && logement["avis"]["score"] != null){
        logement.disableAvis = null;
      } else if(!this.searchbar_Data.selected_avis){
        logement.disableAvis = null;
      } else {
        logement.disableAvis = true;
      }
    });
    this.router.navigate(['/nosLogements'], {relativeTo: this.route, queryParamsHandling: 'merge',queryParams:{avis: this.searchbar_Data.selected_avis}} );
  }

  totalItems = 0;
  total_lgAfterFilter(filtred_logements){
     let calcul_Logements:any[] = filtred_logements.filter((logement:Logement)=>
                                                            logement.disable != true && logement.disableEq != true &&
                                                            logement.disableType != true && logement.disableMax_price != true && logement.disableAvis != true);
    this.totalItems  = calcul_Logements.length;
     return calcul_Logements.length;
  }


  image_Equipements_Exists(equipement){
    const image = this.environment_host  + equipement.icon
    let img = new Image();
    img.src = image;
    img.onerror = (() => {
      equipement.icon = undefined
      console.clear();
    });
  }


  Indicator = 0
  lg_index = 0
  prevBtn(index_logement){
    if(this.lg_index != index_logement) this.Indicator = 0
    this.lg_index = index_logement;
    if(this.Indicator > 0){
      this.Indicator--
    }
  }

  nextBtn(index_logement,logement:Logement){
    if(this.lg_index != index_logement) this.Indicator = 0
    this.lg_index = index_logement;
    if(this.Indicator < logement.photos.length - 1  ){
      this.Indicator++
    }
  }


  getLocalisation(logement){
    this.options.lat = logement.location[0].lat
    this.options.lng = logement.location[0].lng
  }

  view_logement(logement){
    this.ngZone.run(() =>  this.router.navigate(['/detailsHebergement', logement.slug], { state: { logement : logement} }))
  }

  onClickplus(key,$event) {
    this.details_logement[key]++
    $event.stopPropagation();
  }

  onClickminus(key,$event) {
    if (this.details_logement[key] > 0) {
      this.details_logement[key]--
    }
    $event.stopPropagation();
  }


  equipements_filters: any[] = [];
  onClickbtn_equipement(equipement) {
      equipement.clicked =  equipement.clicked == true ? false : true;
        if(!this.equipements_filters.find(id=> id == equipement._id)){
          this.equipements_filters.push(equipement._id)
          } else {
            this.equipements_filters = this.equipements_filters.filter(id=> id != equipement._id)
          }
      this.router.navigate(['/nosLogements'], {relativeTo: this.route, queryParamsHandling: 'merge',queryParams:{equipements:this.equipements_filters}} );
  }

  onClickChecked_equipement(equipement) {
      equipement.clicked =  equipement.clicked == true ? false : true;
        if(!this.equipements_filters.find(id=> id == equipement._id)){
          this.equipements_filters.push(equipement._id)
          } else {
            this.equipements_filters = this.equipements_filters.filter(id=> id != equipement._id)
          }
  }

  old_equipements_filters: any[] = [];
  onClickFilter(){
    this.old_equipements_filters = [];
    for (let index = 0; index < this.equipements_filters.length; index++) {
      this.old_equipements_filters.push(this.equipements_filters[index])
    }
  }

  addEquipementsfilter(equipements_filters) {
    var save_eventurl:any[] = [];
    this.searchbar_Data.filtred_logements.forEach((logement:Logement)=>  {
        save_eventurl = [];
        try {
          equipements_filters.forEach(equipement=>  {
              let get_equipements:any[] = logement.equipements.filter((equip:Equipement)=> equip._id == equipement)
              if(get_equipements.length === 0){
                save_eventurl.push({istrue:true})
              }
                if(!this.equipements_filters.find(id=> id == equipement)){
                 this.equipements_filters.push(this.equipements.filter((eq:Equipement)=> eq._id == equipement)[0]._id)
                }
              this.equipements.filter((eq:Equipement)=> eq._id == equipement)[0].clicked = true;
          })
        } catch {
          let get_equipements:any[] = logement.equipements.filter((equip:Equipement)=> equip._id == equipements_filters)
          if(get_equipements.length === 0){
            save_eventurl.push({istrue:true})
          }
          if(!this.equipements_filters.find(id=> id == equipements_filters)){
            this.equipements_filters.push(this.equipements.filter((eq:Equipement)=> eq._id == equipements_filters)[0]._id)
           }
          this.equipements.filter((eq:Equipement)=> eq._id == equipements_filters)[0].clicked = true;
        }
        if(save_eventurl.find(ev=> ev.istrue == true)){
          logement.disableEq = true
        } else {
          logement.disableEq = null
        }
    })
    this.searchbarService.searchbar_Data.equipements = this.equipements_filters;
  }

  annulerfilterPar_Equipement(){
    this.router.navigate(['/nosLogements'], {relativeTo: this.route, queryParamsHandling: 'merge',queryParams:{equipements:this.old_equipements_filters}} );
  }

  getMaxprice(max_price){
    this.max_price = Number(max_price);
    if(this.max_price == 0){
      this.searchbar_Data.filtred_logements = this.logements;
    } else if (this.max_price > 0){
      this.searchbar_Data.filtred_logements.forEach((logement:Logement)=> {
        if(Number(logement.price) > this.max_price){
         logement.disableMax_price = true;
        } else {
          logement.disableMax_price = null;
        }
      });
    }
    this.searchbar_Data.max_price = this.max_price;
    this.router.navigate(['/nosLogements'], {relativeTo: this.route, queryParamsHandling: 'merge',queryParams:{max_price: this.max_price}} );
  }

  onClick_ok(){
    this.searchbar_Data.lits =  this.details_logement.Lits;
    this.searchbar_Data.chambres = this.details_logement.Chambres;
    this.searchbar_Data.selles_bain = this.details_logement.Salles_bain;
    this.router.navigate(['/nosLogements'], {relativeTo: this.route, queryParamsHandling: 'merge',queryParams:{equipements:this.equipements_filters,
                                                                                                               beds: this.details_logement.Lits,
                                                                                                               bedrooms: this.details_logement.Chambres,
                                                                                                               bathrooms: this.details_logement.Salles_bain}} );
  }

  getDetails_logement(details){
    if(details.Lits == 0 && details.Chambres == 0 && details.Salles_bain == 0){
      this.searchbar_Data.filtred_logements = this.logements;
    } else {
      this.searchbar_Data.filtred_logements = this.searchbar_Data.filtred_logements.filter((logement:Logement)=> logement.beds == details.Lits ||
                                                                                          logement.bedrooms == details.Chambres ||
                                                                                          logement.bathrooms == details.Salles_bain);
    }
  }


  logement_Url:string = "";
  onClickShare(logement:Logement) {
    this.logement_Url = 'https://travelbyrec.com/detailsHebergement/' + logement.slug;
  }


  onClickfavorite(logement:Logement) {
    if(!this.user.id){
      this.notificationService.showNotification('top','right', 'info', 'Vous devez d\'abord vous connecter !!');
    } else {
      if(logement.number_fans && !logement.number_fans.find(fav=> fav == this.user.id)) {
        logement.number_fans.push(this.user.id);
        logement.ispreferred = true;
      } else {
        logement.number_fans = logement.number_fans ? logement.number_fans.filter(fav=> fav != this.user.id) : []
        logement.ispreferred = null;
      }
      this.logementsService.updateOne(logement._id,logement).subscribe({
        next: data => {
          if(logement.ispreferred == true){
            this.notificationService.showNotification('top','right', 'success', 'Ajouter avec succès');
          } else {
            this.notificationService.showNotification('top','right', 'danger', 'Supprimer avec succès');
          }
        },
        error: error => {
            this.notificationService.showNotification('top','right', 'danger', 'Il y a une erreur quelque part, veuillez réessayer');
        }
      });
    }
  }

  onMouseOver(infoWindow, gm) {
    if (gm.lastOpen != null) {
        gm.lastOpen.close();
    }
    gm.lastOpen = infoWindow;
    infoWindow.open();
  }

  convertCurrency(mad_original_price){
    return this.currencyService.convertCurrency(mad_original_price);
   }


}
