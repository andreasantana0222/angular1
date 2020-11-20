export class DestinoViaje{
  private selected: boolean;
  public servicios: string[];
  public position: number;

  constructor(public nombre: string, public url: string){
    this.servicios=['pileta','desayuno'];
  }

  isSelected(): boolean{
    return this.selected;
  }


  setSelected(s:boolean){
    this.selected=s;
  }
}
