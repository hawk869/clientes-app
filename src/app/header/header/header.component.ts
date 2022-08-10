import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/usuarios/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  title: string = 'App Angular'

  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit(): void {
  }

  logOut(): void{
    swal.fire('Logout', `${this.authService.usuario.nombre}, has cerrado sesión con exito!`, 'success');
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
}
