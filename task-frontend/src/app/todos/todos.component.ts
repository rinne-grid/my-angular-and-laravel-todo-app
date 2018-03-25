import { Component, OnInit,  } from '@angular/core';

import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { TodoService } from '../TodoService';
import { Todo } from '../Todo';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
/**
 * @class TodosComponent
 * @description Todoコンポーネント
 */
export class TodosComponent implements OnInit {

  // モーダルを閉じる際に利用した方法（xボタン、キャンセルボタン等）の情報を格納
  closeResult: string;

  // モーダル登録ボタンのローディング管理用
  loadingControl = {
    "ld": true,
    "ld-ring": false,
    "ld-spin": false,
    "running": false
  };
  // モーダル参照用。closeする際に利用
  modalReference: NgbModalRef;

  // 直近のTODO
  todoItemLatest: Todo;
  // Observableで取得したTodoリスト
  todoListObserve: Todo[] = [];

  // モーダルのTodo件名：双方向バインディング
  editTitle: string;
  // モーダルのTodo本文：双方向バインディング
  editBody: string;

  // 登録済みTodoのうち、クリックで選択されたTodo
  currentTodo: Todo;

  /**
   * @method constructor
   * @param todoService
   * @param modalService 
   */
  constructor(private todoService: TodoService,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.refresh();
  }

  /**
   * @method refresh
   * @description
   *  Todoの取得を行い、画面に表示する
   */
  refresh() {
    this.todoService.get().subscribe(responses => {
      this.todoListObserve = [];
      responses.forEach(todo => {
        let todoObj:Todo = new Todo();
        todoObj.id          = todo.id;
        todoObj.title       = todo.title;
        todoObj.contents    = todo.contents;
        todoObj.user_id     = todo.user_id;
        todoObj.created_at  = todo.created_at;
        todoObj.updated_at  = todo.updated_at;
        this.todoListObserve.push(todoObj);
        this.todoItemLatest = this.todoListObserve[0];

      });
    });
  }

  /**
   * @method open
   * @description
   *  モーダルウィンドウを開く。編集の場合は選択済みTodoの値をフォームにセットする
   * @param content テンプレート
   * @param todoObj  Todoインスタンスあるいはundefined
   */
  open(content, todoObj) {
    this.currentTodo = todoObj;
    
    if(!this.isNewTodo()) {
      this.editTitle = this.currentTodo.title;
      this.editBody = this.currentTodo.contents;
    }

    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
    });
  }

  /**
   * @method createTodo
   * @description Todoの登録・更新用APIをを呼び出す
   */
  createTodo() {
    // ローディング用スタイルを有効にする
    this.setLoadingControl(true);

    let todo:Todo = new Todo();
    todo.title = this.editTitle;
    todo.contents = this.editBody;
    
    // 新規Todo
    if(this.isNewTodo()) {
      this.todoService.create(todo).subscribe(response => {
        // モーダルウィンドウを閉じる
        this.modalReference.close();

        // 新規Todo情報をバインド
        let newTodoData: Todo = new Todo();
        newTodoData = response["newTodoData"];
        todo.id = newTodoData.id;
        todo.user_id = newTodoData.user_id;
        todo.created_at = newTodoData.created_at;
        todo.updated_at = newTodoData.updated_at;
        this.todoListObserve.unshift(todo);

        // 入力内容をクリア
        this.editBody = "";
        this.editTitle = "";
        
        // 最新Todoに、今回登録したTodoをセットする
        this.todoItemLatest = todo;

        // ローディング用スタイルを無効化する
        this.setLoadingControl(false);
      });
    } else {
      // 更新対象となったTodoのIdを設定し、APIをコール
      todo.id = this.currentTodo.id;
      this.todoService.update(todo).subscribe(response => {

        // 対象のTodoを検索し、画面表示内容の変更を行う
        for(var targetObj of this.todoListObserve) {
          if(todo.id === targetObj.id) {
            targetObj.title = this.editTitle;
            targetObj.contents = this.editBody;
            break;
          }
        }

        // 入力内容のクリア
        this.editBody = "";
        this.editTitle = "";

        this.setLoadingControl(false);
        this.modalReference.close();
      });
    }

  }

  /**
   * @method trackTodo
   * @description Todoのトラッキング
   * @param index 
   * @param todo 
   */
  trackTodo(index: any, todo: Todo) {
    return todo.id;
  }

  /**
   * @method getDismissReason
   * @description モーダルウィンドウがクローズされた理由を返す
   * @param reason クローズされた理由
   */
  private getDismissReason(reason: any): string {
    if(reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  /**
   * @method isNewTodo
   * @description 新規データかどうかを判断する
   */
  private isNewTodo() {
    return !( this.currentTodo !== undefined && this.currentTodo.hasOwnProperty('id') )
  }

  /**
   * @method setLoadingControl
   * @description ローディング用スタイルの有効・無効を制御する 
   * @param bool 
   */
  private setLoadingControl(bool: boolean) {
    this.loadingControl["ld-spin"] = bool;
    this.loadingControl["ld-ring"] = bool;
    this.loadingControl["running"] = bool;
  }
}
