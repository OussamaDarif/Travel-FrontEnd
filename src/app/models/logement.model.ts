export class Logement {
    _id: string;
    title: string;
    slug: string;
    price: number;
    photos: any[];
    type: string;
    bathrooms : number;
    bedrooms : number;
    beds : number;
    details_logement: string
    reduction : number
    cleaning_fees : number
    service_fees : number
    services_included: any[];
    equipements: any[];
    details_location: string;
    location: any;
    number_fans : any[];
    disable : boolean;
    disableEq : boolean;
    disableType : boolean;
    disableMax_price : boolean;
    disableAvis : boolean;
    ispreferred : boolean;
  }
