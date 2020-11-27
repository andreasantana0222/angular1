import { NgModule, Inject, InjectionToken, Injectable, APP_INITIALIZER, forwardRef  } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
// NODE.JS importo la librería para leer el REST
import { HttpClientModule, HttpClient, HttpHeaders, HttpRequest, HttpResponse } from "@angular/common/http";

import { AppState, AppConfig, APP_CONFIG, db } from '../app.module';
import { DestinoViaje } from './destino-viaje.model';
import { NuevoDestinoAction,
  ElegidoFavoritoAction,
  VoteUpAction,
  VoteDownAction } from './destinos-viajes-state.model';


@Injectable()
export class DestinosApiClient{
  destinos: DestinoViaje[];
  //current: Subject<DestinoViaje> = new BehaviorSubject<DestinoViaje>(null);

  //NODE.JS se cambia el constructor para leer la api
  // constructor( private store: Store<AppState>) {
  //}
  constructor(
    private store: Store<AppState>,
    @Inject(forwardRef (() => APP_CONFIG )) private config: AppConfig,
    private http: HttpClient
  ) {

    this.store
    .select(state => state.destinos)
    .subscribe ((data) => {
      console.log('destinos sub store');
      console.log(data);
      this.destinos = data.items;
    });
    this.store
    .subscribe ((data) => {
      console.log('all store');
      console.log(data);
    });
  }

  add(d: DestinoViaje) {
    // credenciales de validación que se envian en el header como parametro
    const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'token-seguridad'});
    const req = new HttpRequest ('POST', this.config.apiEndpoint + '/my', {nuevo: d.nombre}, {headers: headers });
    this.http.request(req).subscribe((data: HttpResponse<{}>) => {
      // 200  es el resultado de si el servidor está funcionando
      if (data.status === 200) {
        this.store.dispatch(new NuevoDestinoAction(d));
        const myDb = db;
        //tabla destinos agregamos destino nuevo
        myDb.destinos.add(d);
        console.log('todos los destinos de la db!');
        // consulto la tabla como "toArray" no me devuelve un array
        myDb.destinos.toArray().then(destinos => console.log(destinos));
      }
    });
  }

  elegir(d: DestinoViaje) {
    this.store.dispatch(new ElegidoFavoritoAction(d));
  }

  getById(id: String): DestinoViaje {
    return this.destinos.filter(function(d) { return d.id.toString() === id; })[0];
  }

  getAll(): DestinoViaje[]{
    return this.destinos;
  }

}
