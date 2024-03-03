import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Message } from "@shared-kernel/database";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Label, LabelCreate } from "@shared-kernel/database/application/contract/table/label.table";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideBarComponent implements OnInit {
  @Input({required: true})
  public mode!: 'NO_MESSAGES' | 'ALREADY_EXISTING_MESSAGES';

  @Input()
  public messageToEdit: Message<Label> | null = null;

  @Output()
  public close = new EventEmitter<void>();

  @Output()
  public request = new EventEmitter<{ name: string, event: string, body: string }>();

  @Output()
  public saveMessage = new EventEmitter<{id?: number, name: string, event: string, body: string }>();

  @Output()
  public addLabel = new EventEmitter<{
    message: Pick<Message, 'id'>,
    label: LabelCreate
  }>();

  @Output()
  public removeLabel = new EventEmitter<{
    message: Pick<Message, 'id'>,
    label: Label
  }>();

  protected readonly separatorKeysCodes = [ENTER, COMMA] as const;


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

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (!this.messageToEdit) {
      return;
    }

    if (value.length === 0) {
      return;
    }

    this.addLabel.emit({
      label: {
        name: value
      },
      message: this.messageToEdit
    })

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(label: Label): void {
    if (!this.messageToEdit) {
      return;
    }

    this.removeLabel.emit({
      label,
      message: this.messageToEdit
    })
  }
}
