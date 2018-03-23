import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, RequestMethod } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap} from 'rxjs/operators';
import { Todo } from './Todo';
import { environment} from '../environments/environment'
@Injectable()
export class TodoService {
  constructor(private http: HttpClient) {}

  apiUrl = "http://localhost:8000/api/todos";

  apiGetTodos = "todos";
  apiCreateTodo = "todos";

  getTodoPromise(): Promise<Todo[]> {

    return this.http.get<Todo[]>(environment.API_ENDPOINT + this.apiGetTodos,
      {
        withCredentials: true
      })
      .toPromise()
      .then(response => response as Todo[]);

  }

  get(): Observable<any> {
    return this.http.get<Todo[]>(environment.API_ENDPOINT + this.apiGetTodos,
      {
        withCredentials: true
      });
  }

  create(todo: Todo) {
    const title: string = todo.title;
    const contents: string = todo.contents;
    const body = {
      title,
      contents
    };

    let headers: HttpHeaders = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.post(environment.API_ENDPOINT + this.apiCreateTodo,
      JSON.stringify(body),
      {
        withCredentials: true,
        headers: headers
      }).subscribe();

  }

  handleError() {

  }
}
