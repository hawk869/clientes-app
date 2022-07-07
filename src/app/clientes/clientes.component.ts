import { Component, OnInit } from '@angular/core';
import {Cliente} from "./cliente";
import {ClienteService} from "./cliente.service";
import swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];

  constructor(private clienteService: ClienteService ) { }

  ngOnInit(): void {
    this.clienteService.getClientes().subscribe( clientes => this.clientes = clientes);
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
