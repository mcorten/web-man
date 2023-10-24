import {ModuleWithProviders, NgModule} from "@angular/core";
import {DATABASE} from "./application/contract/database.token";
import {Database} from "./application/controller/database.controller";

@NgModule()
export class DatabaseModule {
  public static forRoot(): ModuleWithProviders<DatabaseModule> {
    // For now

    return ({
      ngModule: DatabaseModule,

      providers: [
        { provide: DATABASE, useFactory: () => new Database() }
      ]
    })
  }
}
