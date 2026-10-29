import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  // Local en desarrollo (ng serve) y producción en build, vía environments
  public api = environment.apiUrl;

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };

  constructor(public http: HttpClient) {}

  post(model: string, data: any) {
    return this.http.post(this.api + model, data);
  }

  put(model: string, data: any) {
    return this.http.put(this.api + model, data);
  }

  patch(model: string, data: any) {
    return this.http.patch(this.api + model, data);
  }

  get(model: string) {
    return this.http.get(this.api + model);
  }

  subirImagen(formData: FormData) {
    return this.http.post(this.api + 'imagenes', formData);
  }

  delete(model: string) {
    return this.http.delete(this.api + model);
  }
}
