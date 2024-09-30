export enum AlertType {
  NewUser,
}

export type AlertBody = SlackBodyForNewUser

export type SlackBodyForNewUser = {
  type: AlertType.NewUser
  userId: string
}

export interface AlertPayload {
  eventType: AlertType
  body?: AlertBody
}
