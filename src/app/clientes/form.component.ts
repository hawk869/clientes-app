import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import {ClienteService} from "./cliente.service";
import {ActivatedRoute, Router} from "@angular/router";
import swal from 'sweetalert2';
import {Observable} from "rxjs";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  public titulo: string = 'Crear Cliente';
  public titulo2: string = 'Editar Cliente';
  public errores: string[];

  constructor(private clienteService : ClienteService,
              private router : Router,
              private activeRoute : ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  create(): void {
    this.clienteService.create(this.cliente).subscribe(
      response => {
        this.router.navigate(['/clientes']);
        swal.fire('Nuevo cliente', `Cliente ${this.cliente.nombre} ha sido creado con éxito`, 'success');
      },
      error => {
        this.errores = error.error.Error as string[];
        console.error('Codigo del error desde el backend: ' + error.status);
        console.error(error.error.Error);
      }
    );
  }

  cargarCliente(): void{
    this.activeRoute.params.subscribe(
      params => {
        let id = params['id'];
        if(id){
          this.clienteService.getCliente(id).subscribe(
            (cliente) => this.cliente = cliente
          );
        }
      }
    );
  }

  update(): void {
    this.clienteService.update(this.cliente).subscribe(
      response => {
        this.router.navigate(['/clientes']);
        swal.fire('Cliente Actualizado', `Cliente ${this.cliente.nombre} ha sido actualizado con éxito`, 'success');
      },
      error => {
        this.errores = error.error.Error as string[];
        console.error('Codigo del error desde el backend: ' + error.status);
        console.error(error.error.Error);
      }
    );
  }

  // eliminar(): void {
  //   swal.fire({
  //     title: '¿Está seguro?',
  //     text: `Está a punto de eliminar al cliente ${this.cliente.nombre}`,
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Si, eliminar!'
  //   }).then((result) => {
  //     if (result.value) {
  //       this.clienteService.delete(this.cliente.id).subscribe(
  //         response => {
  //           this.router.navigate(['/clientes']);
  //           swal.fire('Cliente Eliminado', `Cliente ${this.cliente.nombre} eliminado con éxito`, 'success');
  //         }
  //       );
  //     }
  //   });
  // }
}


