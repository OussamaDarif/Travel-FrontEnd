import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  PlyrComponent
} from 'ngx-plyr';
import * as Plyr from 'plyr';
import { SearchbarService } from 'src/app/services/search_bar.service';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.scss']
})

export class AuthentificationComponent implements OnInit {

  // get the component instance to have access to plyr instance
  @ViewChild(PlyrComponent, {
    static: true
  })
  plyr: PlyrComponent;

  // or get it from plyrInit event
  player: Plyr;


  options: Plyr.Options = {
    autoplay: true,
    invertTime: false,
    disableContextMenu: true,
    settings: ['quality', 'speed', 'loop'],
    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
    captions: {
      active: true,
      update: true,
      language: 'en'
    }
  }


  youtubeSources: any = [{
    src: 'https://youtu.be/EpGykXNZqv8',
    provider: 'youtube'
   }
  ];
  navbar_filter;

  constructor(private  searchbarService: SearchbarService) {
    this.navbar_filter = searchbarService.searchbar_Data;
  }

  ngOnInit(): void {
  }

  played(event: Plyr.PlyrEvent) {
  }

  play(): void {
    this.player.play(); // or this.plyr.player.play()
  }

  pause(): void {
    this.player.pause(); // or this.plyr.player.play()
  }

  stop(): void {
    this.player.stop(); // or this.plyr.player.stop()
  }

}
