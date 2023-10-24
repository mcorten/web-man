import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {SocketIoRoutes} from "./socket-io.routes";
import {SharedSocketIoModule} from "@shared-kernel/socket-io";
import {MessagesComponent} from './view/messages/messages.component';
import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatExpansionModule} from "@angular/material/expansion";
import {JsonViewComponent} from './view/messages/json-view/json-view.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MessageModule} from "@message/message.module";
import {MatMenuModule} from "@angular/material/menu";
import { MessageListComponent } from './view/messages/list/message-list/message-list.component';
import {ClipboardModule} from "@angular/cdk/clipboard";

@NgModule({
  imports: [
    RouterModule.forChild(SocketIoRoutes),
    SharedSocketIoModule.forRoot(),
    AsyncPipe,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    MatCardModule,
    MatExpansionModule,
    MatTabsModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,

    MessageModule,
    MatMenuModule,
    MessageListComponent,
    JsonPipe,
    ClipboardModule,
  ],
  declarations: [

    MessagesComponent,
    JsonViewComponent,
  ]
})
export class SocketIoModule {
}
