import { Injectable } from '@angular/core';
import {Cliente} from "./cliente";
import {CLIENTES} from "./clientes.json";
import {catchError, map, Observable, of, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import swal from "sweetalert2";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  getClientes(): Observable<Cliente[]> {
    // return of(CLIENTES);
    // return this.http.get<Cliente[]>(this.urlEndPoint);
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as Cliente[])
    );
  }
  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e.error.Mensaje);
        swal.fire('Error al crear cliente', e.error.Mensaje, 'error');
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
