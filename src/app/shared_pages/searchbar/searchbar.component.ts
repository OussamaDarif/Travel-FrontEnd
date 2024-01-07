import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Logement } from 'src/app/models/logement.model';
import { SearchbarService } from './../../services/search_bar.service';

declare var $: any;

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit, AfterViewInit {
  searchForm: FormGroup;
  @ViewChild('search') searchElementRef: ElementRef;

constructor(
  private formBuilder: FormBuilder,
  public searchbarService: SearchbarService,
  private route: ActivatedRoute,
  private router: Router) {
    this.route.queryParams.subscribe((data:Params) =>  {
      if(data['lat'] && data['lat']!=null) {
        this.searchbarService.searchbar_Data.lat = data['lat'];
      }
      if(data['lng'] && data['lng']!=null) {
        this.searchbarService.searchbar_Data.lng = data['lng'];
      }
      if(data['searchAddress'] && data['searchAddress']!=null)  {
        this.searchbarService.searchbar_Data.search_input = data['searchAddress'];
      }
    });
  }


ngOnInit(): void {
  this.initForm();
  $('.search_Collapse').hide();
  $('.search_voyageurs').on('click', function () {
    $('.search_Collapse').slideToggle("fast");
  });
  $('.item_title').hover(function () {
    $(".active-dropdown-menu").addClass('bg-color-side');
  });
}

ngAfterViewInit() {
  this.searchbarService.findAdress(this.searchElementRef.nativeElement)
}

onSearch(search_input){
  if(!search_input.target.value || search_input.target.value == ''){
    this.searchbarService.searchbar_Data.lat = null;
    this.searchbarService.searchbar_Data.lng = null;
    this.searchbarService.searchbar_Data.selected_rayon = '';
    this.searchbarService.searchbar_Data.search_input = '';
    this.searchbarService.searchbar_Data.selected_avis = '';
    this.searchbarService.searchbar_Data.filtred_logements.forEach((logement:Logement) => {
      logement.disable = null;
    });
    this.router.navigate(['/nosLogements'], {relativeTo: this.route, queryParamsHandling: 'merge',
                                              queryParams:{searchAddress:null,
                                                           lat: null,
                                                           lng: null,
                                                           rayon:null}} );
  }
}


initForm() {
  this.searchForm = this.formBuilder.group({
    adresse: '',
    arrivee: '',
    depart: ''
    // voyageurs: [{
    //   value: '',
    //   disabled: true
    // }],
  });
}

onClickplus(key, $event) {
  this.searchbarService.onClickplus(key, $event)
}

onClickminus(key, $event) {
  this.searchbarService.onClickminus(key, $event)
}

keytab(input_title){
  this.searchbarService.keytab(input_title)
}


}
