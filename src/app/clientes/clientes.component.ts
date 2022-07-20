import { Component, OnInit } from '@angular/core';
import {Cliente} from "./cliente";
import {ClienteService} from "./cliente.service";
import swal from 'sweetalert2';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;

  constructor(private clienteService: ClienteService, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.clienteService.getClientes(page).subscribe( response => {
        this.clientes = response.content as Cliente[];
        this.paginador = response;
      });
    });
  }

  eliminar(cliente: Cliente): void {
    swal.fire({
      title: '¿Está seguro?',
      text: `Está a punto de eliminar al cliente ${cliente.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            swal.fire('Cliente Eliminado', `Cliente ${cliente.nombre} eliminado con éxito`, 'success');
          }
        );
      }
    });
  }

}
