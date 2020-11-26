import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Importo el Modulo de Ruteo
import { RouterModule, Routes } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule as NgRxStoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../environments/environment'; // Angular CLI environment
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DestinoViajeComponent } from './components/destino-viaje/destino-viaje.component';
import { ListaDestinosComponent } from './components/lista-destinos/lista-destinos.component';
import { DestinoDetalleComponent } from './components/destino-detalle/destino-detalle.component';
import { DestinosApiClient } from './models/destinos-api-client.model';
import { FormDestinoViajeComponent } from './components/form-destino-viaje/form-destino-viaje.component';
import { DestinosViajesState,
  reducerDestinosViajes,
initializeDestinosViajesState,
DestinosViajesEffects
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
    ReservasModule
  ],
  providers: [
    DestinosApiClient, AuthService, UsuarioLogueadoGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
