import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { TokenStorageService } from './token_storage.service';


const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://accounts.google.com',

  // strict discovery document disallows urls which not start with issuers url
  strictDiscoveryDocumentValidation: false,

  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin,

  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: '742636221906-g9hl1i5rltkkpp4casegpm41pkeejm2h.apps.googleusercontent.com',

  // set the scope for the permissions the client should request
  scope: 'openid profile email',

  showDebugInformation: true,
};

export interface UserInfo {
  info: {
    sub: string,
    aud: string,
    email: string,
    name: string,
    picture: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  gmail = 'https://gmail.googleapis.com'
  urlAfterRedirects =  ""

  userProfileSubject = new Subject<UserInfo>()


  //Authentification

  constructor(
    private readonly oAuthService: OAuthService,
    private readonly httpClient: HttpClient,
    private router: Router,
    private tokenStorage: TokenStorageService,
    private authService: AuthService) {

    // confiure oauth2 service
    oAuthService.configure(authCodeFlowConfig);
    // manually configure a logout url, because googles discovery document does not provide it
    oAuthService.logoutUrl = "https://www.google.com/accounts/Logout";

    // loading the discovery document from google, which contains all relevant URL for
    // the OAuth flow, e.g. login url
    oAuthService.loadDiscoveryDocument().then( () => {
      // // This method just tries to parse the token(s) within the url when
      // // the auth-server redirects the user back to the web-app
      // // It doesn't send the user the the login page
      oAuthService.tryLoginImplicitFlow().then( () => {

        // when not logged in, redirecvt to google for login
        // else load user profile
              if (!oAuthService.hasValidAccessToken() && this.router.url == "/google-auth") {
                oAuthService.initLoginFlow()
              } else {
                if (window.sessionStorage.getItem("access_token")) {
                  oAuthService.loadUserProfile().then( (userProfile) => {
                    this.userProfileSubject.next(userProfile as UserInfo)

                      if (userProfile){
                        const fullname = userProfile["info"].name;
                        const email = userProfile["info"].email;
                        const idclient = userProfile["info"].aud;
                        this.authService.google_login(email, fullname, idclient).subscribe({
                          next: data => {
                            this.tokenStorage.saveToken(data.accessToken ? data.accessToken : localStorage.getItem("access_token"));
                            this.tokenStorage.saveUser(data.id ? data : JSON.parse(localStorage.getItem("id_token_claims_obj")));
                          },
                          error: err => {
                            console.log('err',err);
                          }
                        });
                      }
                  })
                }
              }
      })
    });
  }

  signOut() {
    this.oAuthService.logOut()
  }


}
