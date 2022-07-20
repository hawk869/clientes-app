import { Injectable } from '@angular/core';
import {Cliente} from "./cliente";
import {CLIENTES} from "./clientes.json";
import {catchError, map, Observable, of, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import swal from "sweetalert2";
import {Router} from "@angular/router";
import {formatDate} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private router: Router) { }
/*
  getClientes(): Observable<any> {
    // return of(CLIENTES);
    // return this.http.get<Cliente[]>(this.urlEndPoint);
    return this.http.get(this.urlEndPoint).pipe(
      map((response: any) => {
        let clientes = response as Cliente[];
        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          // cliente.apellido = cliente.apellido.toUpperCase();
          // formato de fecha
          // EEEEE, MMMMM, yyyy o 3 digitos para simplificar el formato dd/MM/yyyy
          // cliente.createAt = formatDate(cliente.createAt, 'EEEE dd MMMM yyyy', 'es-ES');
          return cliente;
        });
      })
    );
  }
 */
  getClientes(page: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/page/${page}`).pipe(
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          return cliente;
        });
        return response;
      })
    );
  }
  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        }

        console.log(e.error.Mensaje);
        swal.fire(e.error.Mensaje, e.error.Error, 'error');
        return throwError(e);
      }
    ));
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.log(e.error.Mensaje);
        swal.fire('Error al editar cliente', e.error.Mensaje, 'error');
        return throwError(e);
      }
    ));
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
          console.log(e.error.Mensaje);
          swal.fire('Error al editar cliente', e.error.Mensaje, 'error');
          return throwError(e);
        }
      ));
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e.error.Mensaje);
        swal.fire('Error al eliminar cliente', e.error.Mensaje, 'error');
        return throwError(e);
      })
    );
  }
}
