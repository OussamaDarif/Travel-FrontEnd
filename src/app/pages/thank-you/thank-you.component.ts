import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Reservation } from 'src/app/models/reservation.model';
import { CurrencyService } from 'src/app/services/currency-convertor.service';
import { ReservationsService } from 'src/app/services/reservation.service';
import { SearchbarService } from 'src/app/services/search_bar.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {

  environment_host = environment.host;
  environment_hostFront = environment.hostFront;
  reservation:Reservation;
  Difference_In_Days: number = 1
  oid = "";
  // search_globV;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private reservationsService: ReservationsService,
              private searchbarService:SearchbarService,
              public currencyService: CurrencyService,
              private spinner: NgxSpinnerService) {
    // this.searchbarService.searchbar_Data.logement_reserver = [];
    // this.reservation = history.state.reservation;
    // this.global_rating = this.reservation.id_logement['avis']['score']?.toFixed(2);
    // this.search_globV = this.searchbarService.searchbar_Data;
    this.oid = this.route.snapshot.params['oid'];
    if(!this.oid){
      this.router.navigate(['/nosLogements']);
    }
  }

  ngOnInit(): void {
    this.spinner.show();
    console.log('this.oid',this.oid);
    this.reservationsService.findSingleReservations(this.oid).subscribe({
      next: (data:any) => {
        this.reservation = data;
        this.reservation["id_logement"] = this.reservation["id_logement"][0];
        this.reservation["voyageurs"] = this.getVoyageurs(this.reservation.voyageurs);
        this.calculate_days_between_two_dates(this.reservation.date_depart,this.reservation.date_arrivee);
        if(this.reservation){
          this.spinner.hide();
        }
      },
      error: (e) => {
        this.router.navigate(['/confirmationLogement']);
      }
    });

  }

  getVoyageurs(voyageurs){
    let total = 0;
    voyageurs.forEach(function(voyageur) {
      total += voyageur.Adultes + voyageur.Bebes + voyageur.Enfants;
    });
    return total;
  }

  calculate_days_between_two_dates(depart_date,arrivee_date){
    let newdepart_date = new Date(depart_date);
    let newarrivee_date = new Date(arrivee_date);
    if(newdepart_date != null && newarrivee_date != null) {
      let Difference_In_Time = newdepart_date.getTime() - newarrivee_date.getTime();
      let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      this.Difference_In_Days = Difference_In_Days > 0 ? Difference_In_Days : 1;
    }
  }


  Indicator = 0
  prevBtn(){
    if(this.Indicator > 0){
      this.Indicator--
    }
  }

  nextBtn(){
    if(this.Indicator < this.reservation.id_logement['photos'].length - 1  ){
      this.Indicator++
    }
  }


  convertCurrency(mad_original_price){
    return this.currencyService.convertCurrency(mad_original_price);
   }


}
