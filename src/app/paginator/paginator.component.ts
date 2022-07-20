import {Component, Input, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit {

  @Input() paginador: any;
  paginas: number[]
  desde: number;
  hasta: number;
  constructor() { }

  ngOnInit(): void {
    this.initPaginator();
  }
  ngOnChanges(changes: SimpleChanges){
    let paginadorActual = changes['paginador'];
    if(paginadorActual.previousValue){
      this.initPaginator();
    }
  }
  private initPaginator(): void{
    this.desde = Math.min( Math.max(1, this.paginador.number - 1), this.paginador.totalPages - 2);
    this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number + 3), 4);
    if (this.paginador.totalPages > 5){
      this.paginas = new Array(this.hasta - this.desde + 1).fill(0).map((_, i) => i + this.desde);
    }else {
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((_, i) => i + 1);
    }
  }
}
