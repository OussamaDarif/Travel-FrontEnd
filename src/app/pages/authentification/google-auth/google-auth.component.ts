import { Component, OnInit } from '@angular/core';
import { GoogleApiService,UserInfo } from 'src/app/services/google-api.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.scss']
})
export class GoogleAuthComponent implements OnInit {
  userInfo?: UserInfo

  constructor(private readonly googleApi: GoogleApiService,private spinner: NgxSpinnerService) {
      this.spinner.show();
    }

    ngOnInit(): void {
    this.googleApi.userProfileSubject.subscribe( info => {
      this.userInfo = info
    })
  }

}
