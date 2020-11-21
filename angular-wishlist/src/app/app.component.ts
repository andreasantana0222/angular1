import { Component } from '@angular/core';

// OBSERVABLE para la actualización asincrónica
import { Observable, throwError } from 'rxjs';

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
  });

  destinoAgregado(d){
    //alert(d.nombre);
  }
}
