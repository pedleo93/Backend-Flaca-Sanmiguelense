import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ServicioService {
  public api = 'http://127.0.0.1:8000/api/';
  public _url = '/_api.php?opcion=';

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };

  constructor(public http: HttpClient) {
    // this.api = 'http://127.0.0.1:8000/api/';
  }

  post(model: string, data:any) {

    return this.http.post(this.api + model, data);
  }

  get(model: string) {
    return this.http.get(this.api + model);
  }

}
