import 'reflect-metadata'
import { logger } from '../utils/logging/logger'

const script = async () => { }

script()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    logger.error('Unexpected error', { cause: error })
    process.exit(1)
  })
