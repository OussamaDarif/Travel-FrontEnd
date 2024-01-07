import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray
} from '@angular/forms';
import {
  MatMenuTrigger
} from '@angular/material/menu';
import { SearchbarService } from './../../services/search_bar.service';
import { GoogleApiService,UserInfo } from 'src/app/services/google-api.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token_storage.service';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter } from '@angular/material/core';

declare var $: any;

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit, AfterViewInit {

  searchForm: FormGroup;
  lat:number;
  lng:number;

  search_globV;

  destinations_Populaires = [
    {
      lat: "35.168796",
      lng: "-5.268364099999999",
      rayon: "25",
      searchAddress: "Chefchaouen"
    },
    {
      lat: "33.5731104",
      lng: "-7.589843399999999",
      rayon: "25",
      searchAddress: "Casablanca"
    },
    {
      lat: "33.9715904",
      lng: "-6.8498129",
      rayon: "25",
      searchAddress: "Rabat"
    },
    {
      lat: "30.4277547",
      lng: "-9.5981072",
      rayon: "25",
      searchAddress: "Agadir"
    },
    {
      lat: "31.6294723",
      lng: "-7.981084500000001",
      rayon: "25",
      searchAddress: "Marrakech"
    },
    {
      lat: "35.7594651",
      lng: "-5.833954299999999",
      rayon: "25",
      searchAddress: "Tanger",
    },
  ]

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @ViewChild('search') searchElementRef: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private  searchbarService: SearchbarService,
    private mapsAPILoader: MapsAPILoader,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private _adapter: DateAdapter<any>,
    ) {

      this._adapter.setLocale('fr');

    }

  ngOnInit(): void {
    this.search_globV = this.searchbarService.searchbar_Data;
    this.initForm();
    $('.collapseOne').hide();
    $('.showDetail').on('click', function () {
      $('.collapseOne').slideToggle("fast");
    });
  }

  ngAfterViewInit() {
    this.searchbarService.findAdress(this.searchElementRef.nativeElement)
  }


  initForm() {
    this.searchForm = this.formBuilder.group({
      adresse: ['', Validators.required],
      arrivee: '',
      depart: '',
    });
  }

  onClickplus(key, $event) {
    this.searchbarService.onClickplus(key, $event)
  }

  onClickminus(key, $event) {
    this.searchbarService.onClickminus(key, $event)
  }

  // keytab(input_title){
  //   this.searchbarService.keytab(input_title)
  // }

  onClick_Search(){
    this.search_globV.depart_date = this.searchForm.value.depart;
    this.search_globV.arrivee_date = this.searchForm.value.arrivee;
    this.search_globV.selected_type = "";
    this.router.navigate(['/nosLogements'], {relativeTo: this.route, queryParamsHandling: 'merge',
                                            queryParams:{
                                                        lat:this.search_globV.lat,
                                                        lng:this.search_globV.lng,
                                                        searchAddress:this.search_globV.search_input,
                                                        rayon:this.search_globV.selected_rayon}} );
  }

  search_using_city(index){
    this.router.navigate(['/nosLogements'], {relativeTo: this.route, queryParamsHandling: 'merge',
                                             queryParams:{
                                             lat:this.destinations_Populaires[index].lat,
                                             lng:this.destinations_Populaires[index].lng,
                                             searchAddress:this.destinations_Populaires[index].searchAddress,
                                             rayon:this.destinations_Populaires[index].rayon}});
                }




}
