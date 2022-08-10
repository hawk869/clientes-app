import { Injectable } from '@angular/core';
import {Cliente} from "./cliente";
import {catchError, map, Observable, throwError} from "rxjs";
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {Router} from "@angular/router";
import {Region} from "./region";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  // private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  // private addAuthorizationHeader(){
  //   let token = this.authservice.token;
  //   if (token != null){
  //     return this.httpHeaders.append('Authorization', 'Bearer ' + token);
  //   }
  //   return this.httpHeaders;
  // }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
}

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
    // , {headers: this.addAuthorizationHeader()}
    return this.http.post<Cliente>(this.urlEndPoint, cliente).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        console.log(e.error.Mensaje);
        return throwError(e);
      }
    ));
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.Mensaje){
          this.router.navigate(['/clientes']);
          if (e.error.Mensaje){
            console.log(e.error.Mensaje);
          }
        }
        return throwError(e);
      }
    ));
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError(e => {
        // if (this.isNotAuthorized(e)){
        //   return throwError(e)
        // }
        if (e.status == 400) {
          return throwError(e);
        }
        if (e.error.Mensaje){
          console.log(e.error.Mensaje);
        }
          return throwError(e);
        }
      ));
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.Mensaje){
          console.log(e.error.Mensaje);
        }
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);
    // let httHeaders = new HttpHeaders();
    // let token = this.authservice.token;
    // if (token != null){
    //   httHeaders = httHeaders.append('Authorization', 'Bearer ' + token);
    // }
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true,
      // headers: httHeaders
    });

    return this.http.request(req);
  }
}

//.pipe(
//       map((response: any) => response.cliente as Cliente),
//       catchError(e => {
//         console.log(e.error.mensaje);
//         swal.fire('Error al subir la foto', e.error.mensaje, 'error');
//         return throwError(e);
//       })
//     )
