import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { User } from 'src/app/models/User';


@Injectable({ 
  providedIn: 'root'
})
export class RestService {

  baseURL: String = "http://localhost";
  constructor(private httpClient: HttpClient) {}

  get(route: String, port: String, params: any, authToken: String): Observable<any> {
    let url = this.baseURL + ":" + port + route;
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ` + authToken)
        .set('Access-Control-Allow-Origin', '*')
        .set('Access-Control-Allow-Headers', 'Origin')
    }
    return this.httpClient.get(url, header);
  }

  post(route: String, port: String, params: any, authToken: String): Observable<any> {
    console.log("Route: " + route);
    console.log("Params: " + params);
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ` + authToken)
    }    
    let url = this.baseURL + ":" + port + route;
    console.log("attempting to post to route: " + url);
    console.log(params);
    return this.httpClient.post(url, params, header);
  }

  postImages(route: String, port: String, formData: FormData, authToken: String): Observable<any> {
    const headers = new HttpHeaders(
        {'Authorization':  `Bearer ` + authToken}
    );
       
    let url = this.baseURL + ":" + port + route;
    return this.httpClient.post(url, formData, {headers: headers});
  }

  put(route: String, port: string, params: any, authToken: any): Observable<any> {
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ` + authToken)
    }    
    let url = this.baseURL + ":" + port + route;
    return this.httpClient.put(url, params, header);
  }

  patch(route: String, port: string, params: any, authToken: string) {
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ` + authToken)
    }    
    let url = this.baseURL + ":" + port + route;
    console.log("Updating journal url: " + url);
    console.log(params);
    //return this.httpClient.patch(url, params, header);
  }

  delete(route: string, port: string, params: any, authToken: string) {
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ` + authToken)
    }    
    let url = this.baseURL + ":" + port + route;
    return this.httpClient.delete(url, header);
  }
}
