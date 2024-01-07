import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';

const baseUrl = 'https://api.apilayer.com/exchangerates_data';

var myHeaders = new Headers();
myHeaders.append("apikey", "FyU12DO4RWTGpA0ZsD47BkDtzC4fGfrm");

var requestOptions = {
  method: 'GET',
  headers: myHeaders
};


@Injectable({
  providedIn: 'root'
})

export class CurrencyService {

  constructor(private http: HttpClient) {}

  latestRateCurrency(currency) {
    return fetch(`${baseUrl}/latest?symbols=${currency}&base=MAD`, requestOptions);
  }

  convertCurrency(mad_original_price){
    const CURRENCY_DATA = JSON.parse(localStorage.getItem("currency"));
    if(CURRENCY_DATA){
      return {"price": (mad_original_price * CURRENCY_DATA.exchange_rate).toFixed(CURRENCY_DATA.price_symbol == "MAD" ? null : 1),"price_symbol":CURRENCY_DATA.price_symbol}
    } else return {"price":mad_original_price,"price_symbol":"MAD"}
  }

}
