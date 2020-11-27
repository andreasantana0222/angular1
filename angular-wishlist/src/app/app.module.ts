import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Inject, InjectionToken, Injectable, APP_INITIALIZER, forwardRef  } from '@angular/core';
import { Store }  from '@ngrx/store';

// Importo el Modulo de Ruteo
import { RouterModule, Routes } from '@angular/router';

//Base de datos
import Dexie from 'dexie';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule as NgRxStoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// NODE.JS importo la librería para leer el REST
import { HttpClientModule, HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";

import { environment } from '../environments/environment'; // Angular CLI environment
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DestinoViajeComponent } from './components/destino-viaje/destino-viaje.component';
import { ListaDestinosComponent } from './components/lista-destinos/lista-destinos.component';
import { DestinoDetalleComponent } from './components/destino-detalle/destino-detalle.component';
// INJECTOR vamos a inyectar la información del Api DestinosApiClient
// por lo que se quita la importación y el provider
// import { DestinosApiClient } from './models/destinos-api-client.model';
import { FormDestinoViajeComponent } from './components/form-destino-viaje/form-destino-viaje.component';
import { DestinosViajesState,
  reducerDestinosViajes,
initializeDestinosViajesState,
DestinosViajesEffects,
InitMyDataAction
 } from './models/destinos-viajes-state.model';
import { LoginComponent } from './components/login/login/login.component';
import { ProtectedComponent } from './components/protected/protected/protected.component';
import { UsuarioLogueadoGuard } from "./guards/usuario-logueado/usuario-logueado.guard";
import { AuthService } from "./services/auth.service";
import { VuelosComponent } from './components/vuelos/vuelos-component/vuelos.component';
import { VuelosMainComponent } from './components/vuelos/vuelos-main-component/vuelos-main.component';
import { VuelosMasInfoComponent } from './components/vuelos/vuelos-mas-info-component/vuelos-mas-info.component';
import { VuelosDetalleComponent } from './components/vuelos/vuelos-detalle-component/vuelos-detalle.component';
import { ReservasModule } from './reservas/reservas.module';
import { DestinoViaje } from './models/destino-viaje.model';


// NODE.JS sin persistencia y sin deploy
// app config
export interface AppConfig {
  apiEndpoint: String;
}

const APP_CONFIG_VALUE: AppConfig = {
  apiEndpoint: 'http://localhost:3000'
};

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
//fin app config


// ROUTES declaro las rutas hijas primero
// porque sino no las va a encontrar en la declaracion de la ruta raiz

export const childrenRoutesVuelos: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: VuelosMainComponent  },
  { path: 'mas-info', component: VuelosMasInfoComponent },

  // ROUTES se envia el id como parametro dentro de params
  { path: ':id', component: VuelosDetalleComponent }

]

// ROUTES: Declaro las rutas RAÍZ
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch:'full' },
  { path: 'home', component: ListaDestinosComponent },
  { path: 'destino/:id', component: DestinoDetalleComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [UsuarioLogueadoGuard]
  },

  // ROUTES declaro la relación con la ruta hija Vuelos
  // vuelos
  // vuelos/home
  // vuelos/destino/5
  {
    path: 'vuelos',
    component: VuelosComponent,
    canActivate: [UsuarioLogueadoGuard],
    children: childrenRoutesVuelos
  }

];



// REDUX init

export interface AppState  {
  destinos: DestinosViajesState;
}

const reducers: ActionReducerMap<AppState> = {
  destinos: reducerDestinosViajes
};

const reducersInitialState = {
  destinos: initializeDestinosViajesState()
};
// REDUX fin init

// NODE.JS importo codigo para leer el REST
// APP init
export function init_app (appLoadService: AppLoadService): () => Promise<any> {
  return () => appLoadService.initializeDestinosViajesState();
}
@Injectable()
class AppLoadService {
  constructor ( private store: Store<AppState>, private http: HttpClient) {}
  async initializeDestinosViajesState(): Promise<any> {
    const headers: HttpHeaders = new HttpHeaders ({ 'X-API-TOKEN': 'token-seguridad' });
    const req = new HttpRequest ('GET', APP_CONFIG_VALUE.apiEndpoint + '/my', { headers: headers });
    // al ser asíncrono, se espera la respuesta "await" en lugar de subscribe
    const response: any = await this.http.request(req).toPromise();
    this.store.dispatch(new InitMyDataAction(response.body));
  }
}
// APP fin


// dexie db init
@Injectable({
  providedIn: 'root'
})

export class MyDatabase extends Dexie {
  destinos: Dexie.Table<DestinoViaje, number>;
  constructor () {
    super ('MyDatabase');
    // primer version de la base de datos
    this.version(1).stores({
      destinos: '++id, nombre, url',
    });
  }
}
export const db = new MyDatabase();
// dexie db fin

@NgModule({
  declarations: [
    AppComponent,
    DestinoViajeComponent,
    ListaDestinosComponent,
    DestinoDetalleComponent,
    FormDestinoViajeComponent,
    LoginComponent,
    ProtectedComponent,
    //NgRxStoreModule,

    VuelosComponent,
    VuelosMainComponent,
    VuelosMasInfoComponent,
    VuelosDetalleComponent

  ],
  imports: [
    BrowserModule,
    // ROUTES: Se registran las rutas en el componente
    RouterModule.forRoot(routes),

    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    NgRxStoreModule.forRoot(reducers, {initialState: reducersInitialState }),
    EffectsModule.forRoot ([DestinosViajesEffects]),
    StoreDevtoolsModule.instrument(),

    // módulo RESERVAS
    ReservasModule,

    // NODE.JS importo la librería para leer el REST
    HttpClientModule,

    // Base de datos dexie
    MyDatabase
  ],
  // INJECTOR vamos a inyectar la información del Api DestinosApiClient
  // por lo que se quita la importación y el provider
  providers: [
    //DestinosApiClient, AuthService, UsuarioLogueadoGuard
    AuthService, UsuarioLogueadoGuard,
    // NODE.JS sin persistencia y sin deploy
    { provide: APP_CONFIG, useValue: APP_CONFIG_VALUE },
    // NODE.JS declaro mis proveedores de información
    AppLoadService,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
