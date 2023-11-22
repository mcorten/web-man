import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Message } from "@shared-kernel/database";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit{
  @Input({required:true})
  public mode!: 'ADD' | 'EDIT';

  @Input()
  public message: Message | null = null;

  @Output()
  public close = new EventEmitter<void>();

  @Output()
  public request = new EventEmitter<{name: string, event: string, body: string}>();

  protected sendRequestForm = new FormGroup({
      event: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
      name: new FormControl('', {nonNullable: true, validators: []}),
      body: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    }
  )

  ngOnInit(): void {
    if (this.message === null) {
      return;
    }

    this.sendRequestForm.controls.event.setValue(this.message.event);
    this.sendRequestForm.controls.name.setValue(this.message.name);
    this.sendRequestForm.controls.body.setValue(this.message.body);
  }

  closeDrawer() {
    this.close.next()
  }

  requestForm() {
    if (!this.sendRequestForm.valid) {
      return;
    }

    let name = this.sendRequestForm.controls.name.value;
    if (name.length === 0) {
      name = this.sendRequestForm.controls.event.value;
    }
    const event = this.sendRequestForm.controls.event.value;
    const body = this.sendRequestForm.controls.body.value;

    this.sendRequest(name, event,body);
    this.closeDrawer();
  }

  sendRequest(name: string, event: string, body: string) {
    this.request.next({
      name: name,
      event: event,
      body: body
    })
  }
}
