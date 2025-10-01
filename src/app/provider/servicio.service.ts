import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ServicioService {
  public api = 'https://fsws.bananasoft.com.mx/api/';

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };

  constructor(public http: HttpClient) {
  }

  post(model: string, data: any) {
    return this.http.post(this.api + model, data);
  }

  put(model: string, data: any) {
    return this.http.put(this.api + model, data);
  }

  patch(model: string, data: any) {
    return this.http.put(this.api + model, data);
  }

  get(model: string) {
    return this.http.get(this.api + model);
  }

  delete(model: string) {
    return this.http.delete(this.api + model);
  }

}
