import { Component, OnInit } from '@angular/core';
import { Service } from 'src/app/models/service.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { CurrencyService } from 'src/app/services/currency-convertor.service';
import { SearchbarService } from 'src/app/services/search_bar.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nos-services',
  templateUrl: './nos-services.component.html',
  styleUrls: ['./nos-services.component.scss']
})

export class NosServicesComponent implements OnInit {
  environment_host = environment.host;
  categories: any = []
  displayedColumns = ['Service', 'Quantité', 'Sous-total','delete'];
  displayedColumnsT2 = ['Service', 'delete'];
  ELEMENTS_DATA: services[] = [];
  types_service = ["Par heure","Par jour","Par séjour","Par semaine","Par mois","Par année","Par prestation","Sur demande","Gratuit","Autres types"]

  categories_shimmer = ["",""]
  calculTotal:number = 0
  logement_reserver = [];

  constructor(private categoriesService: CategoriesService,
              private searchbarService: SearchbarService,
              public currencyService: CurrencyService) {

                this.logement_reserver = this.searchbarService.searchbar_Data.logement_reserver;

              }

  ngOnInit(): void {
    this.getCategories();
    for (let index = 0; index < this.searchbarService.searchbar_Data.panier.length; index++) {
      this.ELEMENTS_DATA.push(this.searchbarService.searchbar_Data.panier[index]);
    }
    this.calculT();

      //show mini cart
      $('.show-mini-cart').on('click', function () {
        $(".shopping-card").toggleClass('active');
        $(".shopping-card").css("width", "100%");
        $(".mini-cart").toggleClass('after-open');
        $(this).toggleClass('mini-cart-btn');
        setTimeout(function () {
          $(".active-overlay-minicart").toggleClass('left-side');
        }, 400);
      });

      $('.active-overlay-minicart,.close-mini-cart').on('click', function () {
        $(".shopping-card").removeClass('active');
        $(".active-overlay-minicart").removeClass('left-side');
        $(".mini-cart").removeClass('after-open');
        $(".show-mini-cart").toggleClass('mini-cart-btn');
        setTimeout(function () {
          $(".shopping-card").css("width", "0%");
        }, 400);
      });


  }

  getCategories(){
    this.categoriesService.categories_aggregate().subscribe({
      next: data => {
        this.categories = data
        this.categories.forEach(categorie => {
          this.imageExists(categorie)
        });
      },
      error: error => {console.log("error",error);
      }
    });
  }

 imageExists(categorie){
  categorie.services.forEach(service => {
    if(this.logement_reserver['services_included']){
      let get_service_inclu:any[] = this.logement_reserver['services_included'].filter((_service:Service) => _service._id === service._id)
      if(get_service_inclu.length > 0) service.disable = true;
    }
    const image = this.environment_host  + service.image
    let img = new Image();
    img.src = image;
    img.onerror = (() => {
      service.image = undefined
      console.clear();
    });
  });
}


  onClickplus(service){
    let getIndex = this.ELEMENTS_DATA.findIndex(x => x.id === service.id);
    this.ELEMENTS_DATA[getIndex].quantite = this.ELEMENTS_DATA[getIndex].quantite + 1;
    this.ELEMENTS_DATA[getIndex].sous_total = this.ELEMENTS_DATA[getIndex].prix_unit * this.ELEMENTS_DATA[getIndex].quantite
    this.calculT()
  }

  onClickminus(service){
    let getIndex = this.ELEMENTS_DATA.findIndex(x => x.id === service.id);
    if(this.ELEMENTS_DATA[getIndex].quantite > 1) {
    this.ELEMENTS_DATA[getIndex].quantite = this.ELEMENTS_DATA[getIndex].quantite - 1;
    this.ELEMENTS_DATA[getIndex].sous_total -= this.ELEMENTS_DATA[getIndex].prix_unit
    this.calculT()
    }
  }

  onClickajouter(service:Service){
    let getElement:any[] = this.ELEMENTS_DATA.filter(x=> x.id == service._id);
    if(getElement.length > 0){
      getElement[0].sous_total += getElement[0].prix_unit
      getElement[0].quantite += 1
    } else {
      this.ELEMENTS_DATA.push({
        id: service._id,
        name: service.name,
        image: service.image,
        unit_measure: service.unit_measure,
        description: service.description,
        quantite: 1,
        sous_total: service.price,
        prix_unit: service.price,
      })
    }
    this.ELEMENTS_DATA = [...this.ELEMENTS_DATA];
    this.searchbarService.searchbar_Data.panier = this.ELEMENTS_DATA;
    this.calculT()
  }

  onClickDelete(service){
    let getIndex = this.ELEMENTS_DATA.findIndex(x => x.id === service.id);
    this.ELEMENTS_DATA.splice(getIndex, 1);
    this.ELEMENTS_DATA = [...this.ELEMENTS_DATA];
    this.calculT()
  }

  calculT() {
    this.calculTotal = 0;
    this.ELEMENTS_DATA.forEach(service=> {
      this.calculTotal += service.sous_total
    })
  }


  onClick_Confirmer(){
    this.searchbarService.searchbar_Data.panier = this.ELEMENTS_DATA;
  }

  convertCurrency(mad_original_price){
    return this.currencyService.convertCurrency(mad_original_price);
  }

  filter_services(service_type){
    if(service_type != "Autres types"){
      let newData:any[] = this.ELEMENTS_DATA.filter(x=> x.unit_measure === service_type);
      return newData;
    } else {
      let newAutresData = this.ELEMENTS_DATA;
      for (let index = 0; index < this.types_service.length; index++) {
        newAutresData = newAutresData.filter(x=> x.unit_measure != this.types_service[index]);
      }
      return newAutresData;
    }
  }

  step = 0;
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    // this.step++
    //   for (let index = this.step; index < this.types_service.length; index++) {
    //     if (this.filter_services(this.types_service[index]).length > 0) {
    //       this.step = index;
    //       break
    //     }
    //   }
  }

  prevStep() {
    // this.step--;
    // if(this.step > 0){
    //   for (let index = this.step; index < this.types_service.length; index--) {
    //     if (this.filter_services(this.types_service[index]).length > 0) {
    //       this.step = index;
    //       break
    //     }
    //   }
    // }
  }




}


  export interface services {
    name: string;
    quantite: number;
    sous_total: number;
    prix_unit: number;
    unit_measure: string;
    description: string;
    id:string;
    image: string
  }


