import {Routes} from "@angular/router";

export const AppRoutes: Routes = [
  {
    path: 'socket-io',
    loadChildren: () => import('./@socket-io/socket-io.module').then(m => m.SocketIoModule)
  },
  {
    path: '',
    redirectTo: 'socket-io',
    pathMatch: "prefix"
  }
]
