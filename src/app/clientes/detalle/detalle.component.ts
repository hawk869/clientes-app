import {Component, Input, OnInit} from '@angular/core';
import {Cliente} from "../cliente";
import {ClienteService} from "../cliente.service";
import swal from "sweetalert2";
import {HttpEventType} from "@angular/common/http";
import {ModalService} from "./modal.service";
import {AuthService} from "../../usuarios/auth.service";
import {FacturasService} from "../../facturas/services/facturas.service";
import {Factura} from "../../facturas/models/factura";

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  titulo = 'Detalle del cliente';
  @Input() cliente: Cliente;
  fotoSeleccionada: File;
  progreso: number = 0;
  constructor(private clienteService: ClienteService,
              private facturaService: FacturasService,
              public modalService: ModalService,
              public authService: AuthService) { }

  ngOnInit(): void {
    // this.activeRoute.paramMap.subscribe(params => {
    //   let id = +params.get('id');
    //   if (id){
    //     this.clienteService.getCliente(id).subscribe(cliente => this.cliente = cliente);
    //   }
    //
    // });
  }
  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0){
      swal.fire('Error al seleccionar la foto', 'Debe seleccionar una imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }
  subirFoto(){
    if (!this.fotoSeleccionada){
      swal.fire('Error al subir la foto', 'Debe seleccionar una foto', 'error');
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe(event =>{
          if (event.type === HttpEventType.UploadProgress){
            this.progreso = Math.round((event.loaded / event.total) * 100);
          }else if (event.type === HttpEventType.Response){
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            this.modalService.notificarUpload.emit(this.cliente);
            swal.fire('La foto se ha subido completamente', response.mensaje, 'success');
          }
        });
    }
  }
  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  delete(factura: Factura): void{
    swal.fire({
      title: '¿Está seguro?',
      text: `Está a punto de eliminar la factura ${factura.descripcion}`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.facturaService.delete(factura.id).subscribe(
          response => {
            this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura);
            swal.fire('Factura Eliminado', `Factura ${factura.descripcion} eliminado con éxito`, 'success');
          }
        );
      }
    });
  }
}
