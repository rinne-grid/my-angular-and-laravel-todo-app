import { Component, OnInit,  } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TodoService } from '../TodoService';
import { Todo } from '../Todo';
@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {

  constructor(private todoService: TodoService,
              private modalService: NgbModal,
            ) {}

  closeResult: string;
  todoItemLatest: Todo;
  todoListObserve: Todo[] = [];

  editTitle: string;
  editBody: string;
  modalReference: NgbModalRef;

  ngOnInit() {
    this.refresh();
  }

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
        console.log(this.todoListObserve);

        this.todoItemLatest = this.todoListObserve[0];
        console.log("latestObj");

      });
    });
  }

  open(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
    });
  }

  createTodo() {
    let todo:Todo = new Todo();
    todo.title = this.editTitle;
    todo.contents = this.editBody;
    this.todoService.create(todo).subscribe(response => {
      console.log(response);
      console.log("登録成功");
      //this.modalService.close();
      this.modalReference.close();
      this.refresh();
    });

  }

  private getDismissReason(reason: any): string {
    if(reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSendClick() {
    // console.log("todoService.getTodo()");
    // console.log(">>> Promise Pattern");
    //this.todoService.getTodoPromise().then((response) => {
      //this.todoList = response;
      // this.todoItemLatest = new Todo();
      // let latestObj = this.todoList.shift();
      // console.log("latestObj");
      // console.log(latestObj);
      // this.todoItemLatest.id = latestObj.id;
      // this.todoItemLatest.title = latestObj.title;
      // this.todoItemLatest.contents = latestObj.contents;
      // this.todoItemLatest.user_id = latestObj.user_id;
      // this.todoItemLatest.created_at = latestObj.created_at;
      // this.todoItemLatest.updated_at = latestObj.updated_at;
      // console.log(this.todoList);
    //});


  }

}
