import { Observable, catchError, throwError } from 'rxjs';
// import { StorageService } from '../plugins/storage.service';
import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpIntercptorService implements HttpInterceptor {
  token?: any = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTU2LCJ1c2VyTmFtZSI6ImVzZXNAeS5lcyIsImVtYWlsIjoiZXNlc0B5LmVzIiwicGFzc3dvcmQiOiIkMmEkMTAkWG5yR1hwYkJBSnhNLmp6TTRVWE9TdUFPdG94WjZPOFhGMlVqeVNqcExJdHZ4Mm9xYk1vNlciLCJzdWJzY3JpcHRpb24iOm51bGwsInRva2VuIjpudWxsLCJpZENvdW50cnkiOjE2LCJjcmVhdGVkQXQiOiIyMDI2LTA3LTEwVDE4OjM4OjMwLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDI2LTA3LTEwVDE4OjM4OjMwLjAwMFoiLCJjb3VudHJ5Ijp7ImlkIjoxNiwibmFtZSI6IkVzcGHDsW9sIChFc3Bhw7FhKSIsImFjdGl2ZSI6dHJ1ZSwiZm9sZGVyIjoiZXNlcyIsImkxOG4iOiJlcyIsImNyZWF0ZWRBdCI6bnVsbCwidXBkYXRlZEF0IjpudWxsfSwiaWF0IjoxNzg4NDA1NDkxLCJleHAiOjE4MTk5NDE0OTF9.IKzCQTv5Ex5qbMLa_Obmj_r44rfZDl3H-OxMznxqQgM';
//   constructor(private storage: StorageService) {
//     this.storage.get({ key: 'token' }).then((data) => {
//       this.token = data.value;
//     });
//   }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // console.log("token",this.token);
    const headers = req.headers
      .append('x-token', `Bearer ${this.token}`)
      .append('Content-Type', 'application/json; charset=utf-8')
      .append('Access-Control-Allow-Origin', '*');

    let requestClone = req;
    // if (this.route.url != '/auth/login' && this.route.url != '/auth/createUser') {
    requestClone = req.clone({ headers });
    // }

    return next.handle(requestClone).pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse): Observable<any> {
    const status = err.status;
    console.log(err.error);
    return throwError(() => err);
  }
}
