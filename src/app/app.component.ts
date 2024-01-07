import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import * as AOS from 'aos';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'travelbyrec';

  constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('fr');

    //  // the lang to use, if the lang isn't available, it will use the current loader to get them
    // translate.use('en');
  }

  ngOnInit(): void {
    AOS.init();
  }


}
