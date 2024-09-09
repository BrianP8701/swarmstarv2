import { existsSync, readFileSync } from 'fs'
import { injectable } from 'inversify'
import path from 'path'

const CONFIG_FILE_NAME = 'secrets.json'

export enum Environment {
  LOCAL = 'local',
  DEV = 'dev',
  PROD = 'prod',
}

@injectable()
export class SecretService {
  private config: Record<string, string>

  constructor() {
    const filePath = this.findFileUpwards(CONFIG_FILE_NAME, __dirname)
    if (filePath === null) {
      throw new Error(`Could not find ${CONFIG_FILE_NAME} in any parent directory of ${__dirname}`)
    }
    const rawConfig = readFileSync(filePath, 'utf-8')
    this.config = JSON.parse(rawConfig)
  }

  public getEnvironment(): Environment {
    return this.getConfig('MODE') as Environment
  }

  public getDatabaseUrl(): string {
    return this.getConfig('DATABASE_URL')
  }

  public getClerkConfig(): { secretKey: string; publishableKey: string } {
    return {
      secretKey: this.getConfig('CLERK_SECRET_KEY'),
      publishableKey: this.getConfig('CLERK_PUBLISHABLE_KEY'),
    }
  }

  public getClerkWebhookSecret(): string {
    return this.getConfig('CLERK_WEBHOOK_SECRET')
  }

  public getTwilioPhoneNumber(): string {
    return this.getConfig('TWILIO_PHONE_NUMBER')
  }

  public getTwilioAccountSid(): string {
    return this.getConfig('TWILIO_ACCOUNT_SID')
  }

  public getTwilioAuthToken(): string {
    return this.getConfig('TWILIO_AUTH_TOKEN')
  }

  public getOpenAIKey(): string {
    return this.getConfig('OPENAI_API_KEY')
  }

  public getActionFolderPath(): string {
    return this.getConfig('ACTION_FOLDER_PATH')
  }

  public getSeedUserId(): string {
    return this.getConfig('SEED_USER_ID')
  }

  public getGlobalContextId(): string {
    return this.getConfig('GLOBAL_CONTEXT_ID')
  }

  public getViteConfig(): { websocketUrl: string; clerkPublishableKey: string; graphqlUrl: string } {
    return {
      websocketUrl: this.getConfig('VITE_WEBSOCKET_URL'),
      clerkPublishableKey: this.getConfig('VITE_CLERK_PUBLISHABLE_KEY'),
      graphqlUrl: this.getConfig('VITE_GRAPHQL_URL'),
    }
  }

  public getGcpProductionProjectId(): string {
    return this.getConfig('GCP_PRODUCTION_PROJECT_ID')
  }

  public getMyPhoneNumber(): string {
    return this.getConfig('MY_PHONE_NUMBER')
  }

  public getConfig(key: string): string {
    const value = this.config[key]
    if (value === undefined) {
      throw new Error(`Configuration key "${key}" not found`)
    }
    return value
  }

  private findFileUpwards(filename: string, startDir?: string): string | null {
    let currentDir = startDir || process.cwd()

    while (currentDir) {
      const potentialPath = path.join(currentDir, filename)
      if (existsSync(potentialPath)) {
        return potentialPath
      }

      const nextDir = path.dirname(currentDir)
      if (nextDir === currentDir) break // This means we're at the root and didn't find the file
      currentDir = nextDir
    }

    return null
  }
}
