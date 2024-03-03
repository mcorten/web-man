import { Label } from "@shared-kernel/database/application/contract/table/label.table";

export interface MessageCreate {
  id?: number,
  name: string,
  hash: string,
  event: string
  body: string
  labels: {id: number}[]
}

export interface Message<Label = {id: number}> {
  id: number,
  name: string,
  hash: string,
  event: string
  body: string,
  labels: Label[]
}
