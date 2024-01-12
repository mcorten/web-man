import { NgModule } from "@angular/core";
import { LabelFindAdapter } from "./infrastructure/gateway/adapter/label-find.adapter";
import { LabelAddAdapter } from "./infrastructure/gateway/adapter/label-add.adapter";
import { LabelListAdapter } from "./infrastructure/gateway/adapter/label-list.adapter";
import { LabelAddHandler } from "./application/handler/label-add.handler";
import { LabelFindHandler } from "./application/handler/label-find.handler";
import { LabelListHandler } from "./application/handler/label-list.handler";
import { LabelFindOrCreateHandler } from "./application/handler/label-find-or-create.handler";

@NgModule({
  providers: [
    LabelAddAdapter,
    LabelAddHandler,

    LabelFindAdapter,
    LabelFindHandler,

    LabelListAdapter,
    LabelListHandler,

    LabelFindOrCreateHandler,
  ]
})
export class LabelModule {

}
