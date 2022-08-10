import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import {catchError, Observable, throwError} from 'rxjs';
import {AuthService} from "../auth.service";
import swal from 'sweetalert2';
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router:Router) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError(err => {
        if(err.status==401){
          if (this.authService.isAuthenticated()){
            this.authService.logOut();
          }
          this.router.navigate(['/login']);
        }
        if (err.status==403){
          swal.fire('Acceso denegado', `${this.authService.usuario.nombre} no tiene acceso a este recurso!`, 'warning');
          this.router.navigate(['/clientes']);
        }
        return throwError(err);
      })
    );
  }
}
