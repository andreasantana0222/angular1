import { Component } from '@angular/core';

// OBSERVABLE para la actualización asincrónica
import { Observable, throwError } from 'rxjs';
// TRANSLATE
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-wishlist';
  // OBSERVABLE declaro una variable para actualizar asíncrona
  time = new Observable ( observer => {
    setInterval(() => observer.next(new Date().toString()),1000);
    return null;
  });

  // TRANSLATE
  constructor(public translate: TranslateService){
    console.log('************** get translation');
    translate.getTranslation('en').subscribe( x => console.log ('x: ' + JSON.stringify(x)));
    translate.setDefaultLang('es');
  }


  destinoAgregado(d){
    //alert(d.nombre);
  }
}
