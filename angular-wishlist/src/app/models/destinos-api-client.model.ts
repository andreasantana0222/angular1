import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../app.module';
import { DestinoViaje } from './destino-viaje.model';
import { NuevoDestinoAction,
  ElegidoFavoritoAction,
  VoteUpAction,
  VoteDownAction } from './destinos-viajes-state.model';


@Injectable()
export class DestinosApiClient{
  destinos: DestinoViaje[];
  //current: Subject<DestinoViaje> = new BehaviorSubject<DestinoViaje>(null);
  constructor( private store: Store<AppState>) {
  }

  add(d: DestinoViaje) {
    this.store.dispatch(new NuevoDestinoAction(d));
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
