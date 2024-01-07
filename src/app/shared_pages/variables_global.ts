/**
 * Variables Global
*/

 export let searchbar:any =
  {
    currency: {
      "currency_name":"Dirham marocain",
      "symbol":"MAD",
      "price_symbol":"MAD",
      "exchange_rate": null
    },
    voyageur_categories: {
        Adultes: 0,
        Enfants: 0,
        Bebes: 0
    },
    voyageurs: null,
    arrivee_date: null,
    depart_date: null,
    search_input: '',
    lat: null,
    lng: null,
    panier:[],
    logement_reserver:[],
    paiement_methode:"CMI",
    filtred_logements:[],
    selected_rayon:'',
    selected_type:'',
    selected_avis:'',
    equipements: [],
    max_price:0,
    lits:0,
    chambres:0,
    selles_bain:0,
    selected_language: 'fr',
    styles: [
      {
        "featureType": "administrative.locality",
        "elementType": "labels",
        "stylers": [
          {
            "lightness": 23
          },
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "saturation": -15
          },
          {
            "lightness": 25
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#b3e6f4"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#2e90aa"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#dcf2cd"
          }
        ]
      },
        {
          "featureType": "poi.business",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#fafafa"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#e6e6e6"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
    ]
  }

