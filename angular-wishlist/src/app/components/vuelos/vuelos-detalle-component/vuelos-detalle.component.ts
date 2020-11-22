import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vuelos-detalle',
  templateUrl: './vuelos-detalle.component.html',
  styleUrls: ['./vuelos-detalle.component.css']
})
export class VuelosDetalleComponent implements OnInit {
id: any;

// ROUTER recibe la ruta y extrae el id
// de los parámetros recibidos del app.module
  constructor(private route: ActivatedRoute) {
    route.params.subscribe(params => {this.id = params['id']; });
  }

  ngOnInit(): void {
  }

}
