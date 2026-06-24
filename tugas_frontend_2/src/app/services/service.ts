import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { Observable, throwError } from "rxjs";

@Injectable({providedIn: 'root'})

export class BaseService{

    protected apiUrl = 'http://localhost:3000';
    constructor (
        protected http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    protected getHeaders(): HttpHeaders{
        let headers = new HttpHeaders({
            'Content-type' : 'application/json'
        });
        if(isPlatformBrowser(this.platformId)){
            const token = localStorage.getItem('token');
            if(token){
                headers = headers.set('Authorization',`Bearer ${token}`);
            }
        }
        return headers;
    }
    protected handleError(error: any): Observable<never>{
        console.log('API Error:', error);
        return throwError(() => error);
    }
}