import { Component, OnInit, Output, EventEmitter, Inject, InjectionToken, forwardRef } from '@angular/core';
// VALIDATOR: Importo modulos para agrupar controles
import {FormGroup,FormBuilder, Validators, FormControl, ValidatorFn} from '@angular/forms';

// OBSERVABLE se importa el módulo que queda esperando el ingreso de una letra
import {fromEvent} from 'rxjs';
// OBSERVABLE se importan operaciones en serie
import {map, filter, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {ajax} from 'rxjs/ajax';

import { APP_CONFIG, AppConfig } from 'src/app/app.module';
import {DestinoViaje} from './../../models/destino-viaje.model';

@Component({
  selector: 'app-form-destino-viaje',
  templateUrl: './form-destino-viaje.component.html',
  styleUrls: ['./form-destino-viaje.component.css']
})

export class FormDestinoViajeComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  // VALIDATOR: Declaro una variable
  //para el grupo de controles que será validado
  fg: FormGroup;
  minLongitud=5;

  // OBSERVABLE declaro un array de una cadena
  searchResults: string[];

  // VALIDATOR: armo el formulario con FormBuilder
  // constructor(fb: FormBuilder) {

 // NODE.JS sin persistencia y sin deploy
 // Inyecto información al form de destino
  constructor(fb: FormBuilder, @Inject(forwardRef(() => APP_CONFIG)) private config: AppConfig) {
    this.onItemAdded=new EventEmitter();
    this.fg=fb.group({
      nombre: ['', Validators.compose([
        Validators.required,
        this.nombreValidator,
        this.nombreValidatorParametrizable(this.minLongitud)
      ])],
      url: ['']
    });

    this.fg.valueChanges.subscribe((form: any) => {
      console.log('cambio el formulario: ', form);
    });

    this.fg.controls['nombre'].valueChanges.subscribe(
      (value: string) => {
        console.log ('nombre cambió: ', value);
      }
    );
  }

  ngOnInit(){
    // OBSERVABLE valida cuando ingresan un texto
    let elemNombre=<HTMLInputElement>document.getElementById('nombre');
    // OBSERVABLE espera el evento del ingreso de una tecla
    fromEvent(elemNombre, 'input')
    .pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
      filter(text => text.length > 2),
      debounceTime(200),
      distinctUntilChanged(),
      // NODE.JS sin persistencia y sin deploy
      //switchMap(() => ajax('/assets/datos.json'))
      switchMap((text: string) => ajax(this.config.apiEndpoint + '/ciudades?q=' + text))
    ).subscribe(ajaxResponse => {
      this.searchResults = ajaxResponse.response;
    });
  }

  guardar(nombre: string, url: string): boolean {
    const d = new DestinoViaje(nombre, url);
    this.onItemAdded.emit(d);
    return false;
  }


  nombreValidator(control: FormControl): { [s: string]: boolean } {
    const l = control.value.toString().trim().length;
    if(l>0 && l<5){
      return {invalidNombre: true};
    }
    return null;
  }

  nombreValidatorParametrizable(minLong: number): ValidatorFn{
    return (control: FormControl): {[s:string]: boolean}|null => {
      const l=control.value.toString().trim().length;
      if(l>0 && l< this.minLongitud ){
        return {invalidNombre: true};
      }
      return null;
    }
  }
}
