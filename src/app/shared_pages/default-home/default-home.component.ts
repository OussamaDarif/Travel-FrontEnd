import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BreakpointObserver} from '@angular/cdk/layout'
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router, Event, NavigationStart, NavigationEnd, NavigationError} from '@angular/router';
import { TokenStorageService } from '../../services/token_storage.service';
import { GoogleApiService, UserInfo } from '../../services/google-api.service';
import {TranslateService} from '@ngx-translate/core';
import { SearchbarService } from 'src/app/services/search_bar.service';
import { CurrencyService } from 'src/app/services/currency-convertor.service';
import { NotificationService } from 'src/app/services/notificaton.service';

declare var $: any;

@Component({
  selector: 'app-default-home',
  templateUrl: './default-home.component.html',
  styleUrls: ['./default-home.component.scss']
})
export class DefaultHomeComponent implements OnInit {

  @ViewChild(MatSidenav)
  sidenav! : MatSidenav;
  showsearch_Bar: boolean = false;
  show_ul_list: boolean = true;
  show_popup = "";

  //Authentification
  private role: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  fullname?: string;

  userInfo?: UserInfo

  navbar_filter;

  currency: any[] = [
    {
      "currency_name":"Dirham marocain",
      "symbol":"MAD",
    },
    {
      "currency_name":"Dirham émirien",
      "symbol":"AED – ﺩ.ﺇ",
    },
    {
      "currency_name":"Dollar américain",
      "symbol":"USD – $",
    },
    {
      "currency_name":"Dollar australien",
      "symbol":"AUD – $",
    },
    {
      "currency_name":"Dollar canadien",
      "symbol":"CAD – $",
    },
    {
      "currency_name":"Dollar de Hong Kong",
      "symbol":"HKD – $",
    },
    {
      "currency_name":"Dollar de Singapour",
      "symbol":"SGD – $",
    },
    {
      "currency_name":"Dollar néo-zélandais",
      "symbol":"NZD – $",
    },
    {
      "currency_name":"Euro",
      "symbol":"EUR – €",
    },
    {
      "currency_name":"Peso philippin",
      "symbol":"PHP – ₱",
    },
    {
      "currency_name":"Baht thaïlandais",
      "symbol":"THB – ฿",
    },
    {
      "currency_name":"Colon costaricain",
      "symbol":"CRC – ₡",
    },
    {
      "currency_name":"Couronne danoise",
      "symbol":"DKK – kr",
    },
    {
      "currency_name":"Couronne norvégienne",
      "symbol":"NOK – kr",
    },
    {
      "currency_name":"Couronne suédoise",
      "symbol":"SEK – kr",
    },
    {
      "currency_name":"Couronne tchèque",
      "symbol":"CZK – Kč",
    },
    {
      "currency_name":"Forint hongrois",
      "symbol":"HUF – Ft",
    },
    {
      "currency_name":"Franc suisse",
      "symbol":"CHF",
    },
    {
      "currency_name":"Kuna croate",
      "symbol":"HRK – kn",
    },
    {
      "currency_name":"Leu roumain",
      "symbol":"RON – lei",
    },
    {
      "currency_name":"Lev bulgare",
      "symbol":"BGN – лв.",
    },
    {
      "currency_name":"Livre sterling",
      "symbol":"GBP – £",
    },
    {
      "currency_name":"Livre turque",
      "symbol":"TRY – ₺",
    },
    {
      "currency_name":"Nouveau Shekel israélien",
      "symbol":"ILS – ₪",
    },
    {
      "currency_name":"Nouveau dollar de Taïwan",
      "symbol":"TWD – $",
    },
    {
      "currency_name":"Peso chilien",
      "symbol":"CLP – $",
    },
    {
      "currency_name":"Peso colombien",
      "symbol":"COP – $",
    },
    {
      "currency_name":"Peso mexicain",
      "symbol":"MXN – $",
    },
    {
      "currency_name":"Peso uruguayen",
      "symbol":"UYU – $U",
    },
    {
      "currency_name":"Rand sud-africain",
      "symbol":"ZAR – R",
    },
    {
      "currency_name":"Real brésilien",
      "symbol":"BRL – R$",
    },
    {
      "currency_name":"Ringgit malais",
      "symbol":"MYR – RM",
    },
    {
      "currency_name":"Riyal saoudien",
      "symbol":"SAR – SR",
    },
    {
      "currency_name":"Roupie indienne",
      "symbol":"INR – ₹",
    },
    {
      "currency_name":"Sol péruvien",
      "symbol":"PEN – S",
    },
    {
      "currency_name":"Won sud-coréen",
      "symbol":"KRW – ₩",
    },
    {
      "currency_name":"Yen japonais",
      "symbol":"JPY – ¥",
    },
    {
      "currency_name":"Yuan chinois",
      "symbol":"CNY – ￥",
    },
    {
      "currency_name":"Zloty polonais",
      "symbol":"PLN – zł",
    }
  ]

  constructor(private observer : BreakpointObserver,
              public router: Router,
              private route: ActivatedRoute,
              public  searchbarService: SearchbarService,
              private tokenStorageService: TokenStorageService,
              private googleApi: GoogleApiService,
              public translate: TranslateService,
              public currencyService: CurrencyService,
              private notificationService: NotificationService,
              ) {
                this.navbar_filter = searchbarService.searchbar_Data;
                const CURRENCY_DATA = JSON.parse(localStorage.getItem("currency"));
                if(CURRENCY_DATA){
                  this.navbar_filter.currency = CURRENCY_DATA;
                } else {
                  this.navbar_filter.currency = {
                    "currency_name":"Dirham marocain",
                    "symbol":"MAD",
                    "price_symbol":"MAD",
                    "exchange_rate": null
                  };
                }
                this.router.events.subscribe((event: Event) => {
                    if (event instanceof NavigationEnd) {
                      this.show_popup = event.urlAfterRedirects;
                        if (event.urlAfterRedirects == "/detailsHebergement" || event.urlAfterRedirects.substring(0, 13) == "/nosLogements" )  this.showsearch_Bar = true
                        else this.showsearch_Bar = false

                        // event.urlAfterRedirects == "/confirmationLogement" ||
                        if (event.urlAfterRedirects == "/reservation_confirme")  this.show_ul_list = false
                        else this.show_ul_list = true
                    }
                    if (event instanceof NavigationError) {
                        this.showsearch_Bar = false
                        this.show_ul_list = true
                    }
                });

              }

  ngOnInit(): void {
    this.googleApi.userProfileSubject.subscribe( info => {
      this.userInfo = info
    })
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.role = user.role;
      // this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.fullname = user.fullname;
    }
    $(document).ready(function () {
      function removeAnimation(){
        $(".dropdown_menup").removeClass("animation-dropdown");
        $(".active-dropdown-menu").removeClass('bg-color-side');
      };
      function addAnimation(){
        $(this).addClass("show");
        $(".dropdown_menup").addClass("show");
        $(".dropdown_menup").addClass("animation-dropdown");
        $(".active-dropdown-menu").addClass('bg-color-side');
      };

      $(".card-menu.dropdown-toggle").hover(function () {
        removeAnimationlng();
        addAnimation();
      });
      $(".card-menu.dropdown-toggle").click(function () {
        removeAnimationlng();
        addAnimation();
      });
      $(".dropdown-item").click(function () {
        removeAnimation()
      });

      $(".active-dropdown-menu").hover(function () {
       removeAnimation();
       removeAnimationlng();
       $('.searchCollapse').hide("fast");
      });
      $(".active-dropdown-menu").click(function () {
       removeAnimation();
       removeAnimationlng();
       $('.searchCollapse').hide("fast");
      });

      //when open Currency Model close all model
      $("#Convertor").click(function() {
       removeAnimation();
       removeAnimationlng();
       $('.searchCollapse').hide("fast");
      });


      if(this.show_popup == '/'){
        //PopUp
        $('#popup_video').modal({
            backdrop: 'static',
            keyboard: false  // to prevent closing with Esc button (if you want this too)
        })

        $('#popup_video').modal('show');

        setTimeout(() => {
          $('#video-popup').get(0).play();
        }, 2000);

        $(".btn_close").click(function() {
          $('#video-popup').get(0).pause();
        });
        //Fin PopUp
      }

      /////////////Multi lng//////////////
      function removeAnimationlng(){
        $(".dropdown-menu-lng").removeClass("animation-dropdown-lng");
        $(".active-dropdown-menu").removeClass('bg-color-side');
      };
      function addAnimationlng(){
        $(this).addClass("show");
        $(".dropdown-menu-lng").addClass("show");
        $(".dropdown-menu-lng").addClass("animation-dropdown-lng");
        $(".active-dropdown-menu").addClass('bg-color-side');
      };

      $(".lng-menu.dropdown-toggle").hover(function () {
        removeAnimation();
        addAnimationlng();
      });
      $(".lng-menu.dropdown-toggle").click(function () {
        removeAnimation();
        addAnimationlng();
      });
      $(".dropdown-item").click(function () {
        removeAnimationlng()
      });
      /////////////Fin Multi lng//////////////


      $(document).scroll(function () {
        var $scroll_top = $(".scroll-top");
            $scroll_top.toggleClass('d-none', $(this).scrollTop() < 300);
      });

    });
  }


  selectedCurrency(currency){
    this.navbar_filter.currency['currency_name'] = currency.currency_name;
    this.navbar_filter.currency['symbol'] = currency.symbol;
    currency.symbol = currency.symbol.replace(/\s/g, '');
    this.navbar_filter.currency['price_symbol'] = currency.symbol.split("–")[1] ? currency.symbol.split("–")[1] : currency.symbol;
    this.currencyService.latestRateCurrency(currency.symbol.split("–")[0])
    .then(response => response.text())
    .then((result:any) => {
      result =  JSON.parse(result);
      this.navbar_filter.currency['exchange_rate'] = result['rates'][currency.symbol.split("–")[0]],
      localStorage.setItem("currency", JSON.stringify(this.navbar_filter.currency))
      window.location.reload();
    })
    .catch(error => {
      this.notificationService.showNotification('top','right', 'danger', 'La devise ne peut pas être convertie pour le moment. Veuillez réessayer plus tard');
      this.navbar_filter.currency = {
        "currency_name":"Dirham marocain",
        "symbol":"MAD",
        "price_symbol":"MAD",
        "exchange_rate": null
      }
    })
  }

  array_move() {
    var  arr = this.currency;
    var  old_index = this.currency.findIndex(x => x['currency_name'] === this.navbar_filter.currency['currency_name'])
    var  new_index = 0;
      if (new_index >= arr.length) {
          var k = new_index - arr.length + 1;
          while (k--) {
              arr.push(undefined);
          }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return this.currency = arr;
  };

  scrolTop(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
    this.googleApi.signOut();
  }

  selectedLanguage(lng){
    this.translate.use(lng);
    this.navbar_filter.selected_language = lng;
  }


}
