import { MapsAPILoader } from '@agm/core';
import {
  Injectable, NgZone
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Logement } from '../models/logement.model';
// import {TestModel} from '../models/testmodel.model';
import { searchbar } from './../shared_pages/variables_global';

@Injectable()
export class SearchbarService {
  searchbar_Data: any = searchbar;
  private dbPath = '/t';
  // testmodel: TestModel[] = [];
  urlAfterRedirects;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private router: Router) {}

  onClickplus(key, $event) {
    this.searchbar_Data.voyageur_categories[key]++
    this.searchbar_Data.voyageurs += 1
    $event.stopPropagation();
  }

  onClickminus(key, $event) {
    if (this.searchbar_Data.voyageur_categories[key] > 0) {
      this.searchbar_Data.voyageur_categories[key]--
      this.searchbar_Data.voyageurs -= 1
    } else if(!this.searchbar_Data.voyageur_categories["Adultes"]
           && !this.searchbar_Data.voyageur_categories["Enfants"]
           && !this.searchbar_Data.voyageur_categories["Bebes"]) {
      this.searchbar_Data.voyageurs = null
    }
    $event.stopPropagation();
  }


  keytab(input_title) {
    switch (input_title) {
      case "ADRESSE":
        document.getElementById("ARRIVEE").click();
        document.getElementById("ARRIVEE").focus();
        document.getElementById("ARRIVEE1").classList.add("hover_item");
        break;
      case "ARRIVEE":
        document.getElementById("DEPART").click();
        document.getElementById("DEPART").focus();
        document.getElementById("ARRIVEE1").classList.remove("hover_item");
        document.getElementById("DEPART1").classList.add("hover_item");
        break;
      case "DEPART":
        $('.collapseOne').slideToggle("fast");
        document.getElementById("VOYAGEURS").focus();
        document.getElementById("DEPART1").classList.remove("hover_item");
        document.getElementById("VOYAGEURS1").classList.add("hover_item");
        break;
      default:
        break;
    }

  }

  findAdress(searchElementRef) {
    this.mapsAPILoader.load().then(() => {
         let autocomplete = new google.maps.places.Autocomplete(searchElementRef);
         autocomplete.addListener("place_changed", () => {
           this.ngZone.run(() => {
             // some details
             let place: google.maps.places.PlaceResult = autocomplete.getPlace();
               if(place.geometry) {
                 var lat =  place.geometry.location.lat();
                 var lng =  place.geometry.location.lng();

                 this.searchbar_Data.filtred_logements.forEach((logement:Logement,index:any) => {
                  logement.disable = false;
                  var search_value = new google.maps.LatLng(this.searchbar_Data.lat, this.searchbar_Data.lng);
                  var logement_location = new google.maps.LatLng(logement.location[0].lat, logement.location[0].lng);
                  var distance = google.maps.geometry.spherical.computeDistanceBetween(search_value, logement_location);
                  var distance_par_km = distance/1000;
                    if(25 < distance_par_km){
                      logement.disable = true;
                    }
                  });
                  this.searchbar_Data.selected_rayon = 25;
                }
                this.searchbar_Data.lat =  lat ? lat : null;
                this.searchbar_Data.lng =  lng ? lng : null;

                if (this.router.url.substring(0, 13) == "/nosLogements" )  this.urlAfterRedirects = "/nosLogements";
                else this.urlAfterRedirects = "";
                if(this.urlAfterRedirects != "" && this.searchbar_Data.lat && this.searchbar_Data.lng){
                  this.router.navigate(['/nosLogements'], {relativeTo: this.route, queryParamsHandling: 'merge',
                                                           queryParams:{lat:this.searchbar_Data.lat,
                                                                        lng:this.searchbar_Data.lng,
                                                                        searchAddress:searchElementRef.value,
                                                                        rayon:this.searchbar_Data.selected_rayon,
                                                                        avis:this.searchbar_Data.selected_avis
                                                                      }} );
                }
                this.searchbar_Data.search_input =  searchElementRef.value;
            });
         });
       });
  }



}
