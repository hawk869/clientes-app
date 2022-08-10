import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = 'Por favor inicie sesión!';
  usuario: Usuario;
  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
   }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()){
      swal.fire('Login', `Hola ${this.authService.usuario.nombre} ya estas autenticado!`, 'info');
      this.router.navigate(['/clientes']);
    }
  }

  login(): void{
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null){
      swal.fire('Error Login', 'Username o password vacías!', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe(response => {
      this.authService.saveUser(response.access_token);
      this.authService.saveToken(response.access_token);
      let usuario = this.authService.usuario;
      console.log(usuario);

      this.router.navigate(['/clientes']);
      swal.fire('Login', `Hola ${usuario.nombre}, has iniciado sesión con exito!`, 'success');
    }, error => {
      if(error.status == 400){
        swal.fire('Error login', 'Usuario o contraseña incorrectos', 'error');
      }
    });
  }
}
