export enum OperationType {
  FunctionCall,
  Termination,
  Blocking,
}

export interface OperationPayload {
  operationType: OperationType
  operationId: string
}
