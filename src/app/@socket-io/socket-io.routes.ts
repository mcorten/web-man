import {Routes} from "@angular/router";
import {ConnectComponent} from "./view/connect/connect.component";
import {MessagesComponent} from "./view/messages/messages.component";


export const SocketIoRoutes: Routes = [
  {path: '', component: ConnectComponent},
  {path: 'messages', component: MessagesComponent},


]
