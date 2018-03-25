import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, RequestMethod } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap} from 'rxjs/operators';

import { Todo } from './Todo';
import { environment} from '../environments/environment'

@Injectable()
/**
 * @class TodoService
 * @description TodoのCRUDを実行する
 */
export class TodoService {
  apiGetTodos = "todos";
  apiCreateTodo = "todos";

  /**
   * @method constructor
   * @param http 
   */
  constructor(private http: HttpClient) {}

  /**
   * @method getTodoPromise
   * @description Promiseでリクエスト非同期処理を制御する
   */
  getTodoPromise(): Promise<Todo[]> {
    return this.http.get<Todo[]>(environment.API_ENDPOINT + this.apiGetTodos,
      {
        withCredentials: true
      })
      .toPromise()
      .then(response => response as Todo[]);
  }

  /**
   * @method get
   * @description APIにHTTPリクエストを送信し、Todo一覧を取得する
   */
  get(): Observable<any> {
    return this.http.get<Todo[]>(environment.API_ENDPOINT + this.apiGetTodos,
      {
        withCredentials: true
      });
  }

  /**
   * @method create
   * @description APIにHTTPリクエストを送信し、Todoを登録する
   * @param todo 
   */
  create(todo: Todo) {
    const title: string = todo.title;
    const contents: string = todo.contents;
    const body = {
      title,
      contents
    };

    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
    });
    
    return this.http.post(environment.API_ENDPOINT + this.apiCreateTodo,
      JSON.stringify(body),
      {
        headers: headers
      });
  }

  /**
   * @method update
   * @description APIにHTTPリクエストを送信し、Todoを更新する
   * @param todo 
   */
  update(todo: Todo) {
    const title: string = todo.title;
    const contents: string = todo.contents;
    const id = todo.id;
    const body = {
      id,
      title,
      contents
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put(environment.API_ENDPOINT + this.apiCreateTodo + "/" + id,
      JSON.stringify(body),
      {
        headers: headers
      }
    );
  }
}
