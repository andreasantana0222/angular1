import { Component, OnInit, InjectionToken, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store }  from '@ngrx/store';

import { DestinosApiClient } from './../../models/destinos-api-client.model';
import { DestinoViaje } from './../../models/destino-viaje.model';
import { AppState } from 'src/app/app.module';


//// INJECTOR Forma 2: generamos una versión anterior del API client
//// para probar que pueden convivir 2 versiones y funcionar
//class DestinosApiClientViejo {
//  getById (id: String): DestinoViaje {
//    console.log('llamado por la clase vieja!');
//    return null;
//  }
//}

//// INJECTOR Forma 3: generamos una funcionalidad distinta entre Api client nuevo
//// y Api client viejo
//// INIT
//interface AppConfig {
//  apiEndpoint: String;
//}

//const APP_CONFIG_VALUE: AppConfig = {
//  apiEndpoint: 'mi_api.com'
//};

//// Inyecto un valor por eso uso el InjectionToken
//const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

//// Patron de Diseño Decorador
//// Se hereda de DestinosApiClient y se sobreescribe el getById()
//class DestinosApiClientDecorated extends DestinosApiClient {
//  constructor ( @Inject(APP_CONFIG) private config: AppConfig, store: Store<AppState> ) {
//    super(store); // lo pasa a la clase padre
//  }

//  getById(id: String): DestinoViaje {
//    console.log ('llamado por la clase decorada!');
//    console.log ('config: ' + this.config.apiEndpoint);
//    return super.getById(id);
//  }
//}
//// FIN INJECTOR Forma 3

@Component({
  selector: 'app-destino-detalle',
  templateUrl: './destino-detalle.component.html',
  styleUrls: ['./destino-detalle.component.css'],

  //// INJECTOR Forma 1: vamos a inyectar la información del Api DestinosApiClient
  providers: [DestinosApiClient]

  //// INJECTOR Forma 2: generamos una versión anterior del API client
  //// para probar que pueden convivir 2 versiones y funcionar
  ///providers: [
  ////    DestinosApiClient, {
  ////    provide: DestinosApiClientViejo,
  ////    useExisting: DestinosApiClient
  ////   }
  //// ]

  // INJECTOR Forma 3: generamos una funcionalidad distinta entre Api client nuevo
  // y Api client viejo
  ///providers: [
  ///  {provide: APP_CONFIG, useValue: APP_CONFIG_VALUE },
  ///  {provide: DestinosApiClient, useClass: DestinosApiClientDecorated },
  ///  {provide: DestinosApiClientViejo, useExisting: DestinosApiClient }
  /// ]


})
export class DestinoDetalleComponent implements OnInit {
  destino: DestinoViaje;

  // INJECTOR Forma 2: generamos una versión anterior del API client
  // para probar que pueden convivir 2 versiones y funcionar
  //constructor ( private route: ActivatedRoute, private destinosApiClient: DestinosApiClientViejo) { }
  constructor ( private route: ActivatedRoute, private destinosApiClient: DestinosApiClient) { }


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.destino= this.destinosApiClient.getById(id);
    //this.destino.position= id;
    //this.destinosApiClient.elegir(this.destino);
  }

}
