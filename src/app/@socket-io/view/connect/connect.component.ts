import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {SocketIoGateway} from "@shared-kernel/socket-io/infrastructure/socket-io.gateway";
import {Database, DATABASE, ServerCreate} from "@shared-kernel/database";
import {combineLatest, filter, first, map, Observable, of, switchMap} from "rxjs";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {SOCKET_IO_CONTROLLER} from "@shared-kernel/socket-io/application/contract/controller.token";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCardModule} from "@angular/material/card";
import {
  ServerAddHandler,
  ServerAddUseCase,
  ServerDetailHandler,
  ServerDetailUseCase,
  ServerListHandler,
  ServerModule
} from "@server/index";
import {ServerRemoveHandler} from "@server/application/handler/server-remove.handler";
import {MatIconModule} from "@angular/material/icon";
import {ServerRemoveUseCase} from "@server/application/use-case/server-remove.use-case";

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ServerModule,

    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    NgIf,
    AsyncPipe,
    MatExpansionModule,
    NgForOf,
    MatCardModule,
    MatIconModule
  ]
})
export class ConnectComponent implements OnInit {
  protected connectForm = new FormGroup({
      name: new FormControl('', {nonNullable: true}),
      host: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    }
  )

  protected loading!: Observable<boolean>;
  protected history!: Observable<{
    list: ServerCreate[]
  }>;

  constructor(
    private readonly serverAdd: ServerAddHandler,
    private readonly serverDetail: ServerDetailHandler,
    private readonly serverList: ServerListHandler,
    private readonly serverRemove: ServerRemoveHandler,
    @Inject(DATABASE) private readonly database: Database,
    @Inject(SOCKET_IO_CONTROLLER) private readonly connection: SocketIoGateway,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.loading = this.connection.health
      .pipe(
        map(health => health === "connecting"),
      )

    this.connection.health
      .pipe(
        filter(health => health === 'connected'),
        first(),
      )
      .subscribe(() => {
        this.router.navigate(['messages'])
      })

    this.history = this.serverList.handle()
      .pipe(
        switchMap(serverIdCollection => {
          if (serverIdCollection.length === 0) {
            return of([]);
          }

          let details = serverIdCollection.map(
            server => this.serverDetail.handle(new ServerDetailUseCase(server))
          );
          return combineLatest(details);
        }),
        map(v => {
          return {
            list: v
          }
        })
      )
  }

  connectFormSubmit() {
    if (!this.connectForm.valid) {
      return;
    }

    const host = this.connectForm.controls.host.value;
    let name = this.connectForm.controls.name.value;
    if (name.length === 0) {
      name = host;
    }

    this.storeHostIfNotFound(name, host)
      .subscribe((v) => {
        this.connect(host)
      })
  }

  connectFromHistory(server: ServerCreate) {
    this.connectForm.controls.host.setValue(server.host);
    this.connectForm.controls.name.setValue(server.name);

    this.connect(server.host)
  }

  removeHistory(id: number) {
    this.serverRemove.handle(new ServerRemoveUseCase(id)).subscribe(() => {
    })
  }


  connect(host: string) {
    this.connection.connect({
      host: host
    })
  }

  private storeHostIfNotFound(name: string, host: string) {
    return this.database.servers()
      .findOne({host})
      .pipe(
        first(),
        switchMap(v => {
          if (v === undefined) {
            return this.serverAdd.handle(new ServerAddUseCase(host, name))
          }

          return of(v);
        })
      )
  }
}
