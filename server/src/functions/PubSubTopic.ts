
export enum PubSubTopic {
  // BemEventHandler = 'bem-event-handler',
  // DedupePersonHandler = 'dedupe-person-handler',
  // EmailHandler = 'email-handler',
  // EnrichmentHandler = 'enrichment-handler',
  // EntityExtractionHandler = 'entity-extraction-handler',
  // GptExtractionHandler = 'gpt-extraction-handler',
  // NotificationHandler = 'notification-handler',
  // RealEstatePropertyHandler = 'real-estate-property-handler',
  // ScraperHandler = 'scraper-handler',
  // SignalMonitoringNotificationsHandler = 'signalmonitoring-notifications',
  // SkipTracingHandler = 'skip-tracing-handler',
  // SkipTraceRequestCreationHandler = 'skip-trace-request-creation-handler',
  // StripeEvent = 'stripe-event',
  // TabularFileProcessingHandler = 'tabular-file-processing-handler',
  // ScrapedEntityHandler = 'scraped-entity-handler',
  // ExportHandler = 'export-handler',
}

export type TopicPayload = {
  // [PubSubTopic.BemEventHandler]: BemHandlerPayload
  // [PubSubTopic.DedupePersonHandler]: DedupePersonPayload
  // [PubSubTopic.EmailHandler]: EmailHandlerPayload
  // [PubSubTopic.EnrichmentHandler]: EnrichmentHandlerPayload // 4
  // [PubSubTopic.EntityExtractionHandler]: EntityExtractionHandlerPayload // 3
  // [PubSubTopic.GptExtractionHandler]: GptExtractionHandlerPayload // 2
  // [PubSubTopic.NotificationHandler]: NotificationHandlerPayload
  // [PubSubTopic.RealEstatePropertyHandler]: RealEstatePropertyHandlerPayload
  // [PubSubTopic.ScraperHandler]: ScraperHandlerPayload // 1
  // [PubSubTopic.SignalMonitoringNotificationsHandler]: SignalMonitoringNotificationsPayload
  // [PubSubTopic.SkipTracingHandler]: SkipTracingHandlerPayload
  // [PubSubTopic.SkipTraceRequestCreationHandler]: SkipTraceRequestCreationHandlerPayload
  // [PubSubTopic.StripeEvent]: StripeEventPayload
  // [PubSubTopic.TabularFileProcessingHandler]: TabularFileProcessingHandlerPayload
  // [PubSubTopic.ScrapedEntityHandler]: ScrapedEntityHandlerPayload
  // [PubSubTopic.ExportHandler]: ExportHandlerPayload
}
