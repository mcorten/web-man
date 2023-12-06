import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Message } from "@shared-kernel/database";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  @Input({required: true})
  public mode!: 'NO_MESSAGES' | 'ALREADY_EXISTING_MESSAGES';

  @Input()
  public messageToEdit: Message | null = null;

  @Output()
  public close = new EventEmitter<void>();

  @Output()
  public request = new EventEmitter<{ name: string, event: string, body: string }>();

  @Output()
  public saveMessage = new EventEmitter<{id?: number, name: string, event: string, body: string }>();

  protected sendRequestForm = new FormGroup({
    name: new FormControl('', {nonNullable: true, validators: []}),
    event: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    body: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    }
  )

  ngOnInit(): void {
    if (this.messageToEdit === null) {
      return;
    }

    /**
     * When name is changed we have the following situations
     * 1: change the name to the current already existing message => overwrite?
     * 2: change the name to a non-existing message => create new?
     * 3: change the name to an OTHER already existing message => error? overwrite?
     *
     * TODO create tasks ^
     */
    this.sendRequestForm.controls.name.setValue(this.messageToEdit.name);

    this.sendRequestForm.controls.event.setValue(this.messageToEdit.event);

    this.sendRequestForm.controls.body.setValue(this.messageToEdit.body);
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

    this.sendRequest(name, event, body);
  }

  sendRequest(name: string, event: string, body: string) {
    this.request.next({
      name: name,
      event: event,
      body: body
    })
  }

  saveForm() {
    if (!this.sendRequestForm.valid) {
      return;
    }

    if (!this.sendRequestForm.dirty) {
      return;
    }

    let name = this.sendRequestForm.controls.name.value;
    if (name.length === 0) {
      name = this.sendRequestForm.controls.event.value;
    }
    const event = this.sendRequestForm.controls.event.value;
    const body = this.sendRequestForm.controls.body.value;

    if (this.messageToEdit) {
      return this.saveMessageExisting(this.messageToEdit, name, event, body);
    }
  }

  private saveMessageExisting(messageToEdit: Message, name: string, event: string, body: string) {
    if (this.messageToEdit?.name === name &&
      this.messageToEdit.event === event &&
      this.messageToEdit.body === body
    ) {
      return; // nothing changed
    }

    this.saveMessage.emit({
      id: messageToEdit.id,
      name,
      event,
      body
    })
  }
}
