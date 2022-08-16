import { Component, OnInit } from '@angular/core';
import {Factura} from "./models/factura";
import {ActivatedRoute, Router} from "@angular/router";
import {ClienteService} from "../clientes/cliente.service";
import {FormControl} from "@angular/forms";
import {mergeMap, Observable} from "rxjs";
import {map} from 'rxjs/operators';
import {FacturasService} from "./services/facturas.service";
import {Producto} from "./models/producto";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {ItemFactura} from "./models/item-factura";
import swal from "sweetalert2";

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {

  title: string = 'Nueva Factura';
  factura: Factura = new Factura();
  myControl = new FormControl('');
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService,
              private facturaService: FacturasService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let clienteId = +params.get('id'); //el clienteId viene de la ruta en app.module
      this.clienteService.getCliente(clienteId).subscribe(cliente => {
        this.factura.cliente = cliente;
      });
    });
    this.productosFiltrados = this.myControl.valueChanges.pipe(
      map(value => typeof value === 'string'? value : ''),
      mergeMap(value => value? this._filter(value): [])
    );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();
    return this.facturaService.filtrarProducto(filterValue);
  }
  mostrarNombre(producto?: Producto): string | undefined {
    return producto? producto.nombre : undefined;
  }
  seleccionarProducto(event: MatAutocompleteSelectedEvent): void{
    let producto = event.option.value as Producto;
    if (this.existeItem(producto.id)){
      this.incrementarCantidad(producto.id)
    }
    else {
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }
    this.myControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }
  actualizarCantidad(id: number, event: any): void{
    let cantidad: number = event.target.value as number;
    if (cantidad === 0){
      return this.eliminarItem(id);
    }
    this.factura.items = this.factura.items.map((item:ItemFactura) => {
      if (id === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    });
  }
  existeItem(id: number): boolean{
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if (id === item.producto.id){
        existe = true;
      }
    });
    return existe;
  }
  incrementarCantidad(id: number): void{
    this.factura.items = this.factura.items.map((item:ItemFactura) => {
      if (id === item.producto.id){
        ++item.cantidad;
      }
      return item;
    });
  }
  eliminarItem(id: number): void{
    this.factura.items = this.factura.items.filter((item: ItemFactura) => id !== item.producto.id);
  }
  create():void{
    this.facturaService.create(this.factura).subscribe(factura =>{
      swal.fire(this.title, `${factura.descripcion} creada con exito!`, "success");
      this.router.navigate(['/facturas', factura.id]);
    });
  }
}
