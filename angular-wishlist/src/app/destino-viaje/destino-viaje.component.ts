import { Component, OnInit, Input, HostBinding, EventEmitter, Output } from '@angular/core';
import { DestinoViaje } from './../models/destino-viaje.model';
import { DestinosApiClient } from './../models/destinos-api-client.model';

@Component({
  selector: 'app-destino-viaje',
  templateUrl: './destino-viaje.component.html',
  styleUrls: ['./destino-viaje.component.css']
})
export class DestinoViajeComponent implements OnInit {
@Input() destino: DestinoViaje;
@Input() position: number;
@HostBinding ('attr.class') cssClass='col-md-4';
@Output() onClicked: EventEmitter<DestinoViaje>;

  constructor() {
    this.onClicked=new EventEmitter();
  }

  ngOnInit() {
  }

  ir(){
    this.onClicked.emit(this.destino);
    return false;
  }
}
