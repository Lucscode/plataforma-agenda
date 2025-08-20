// =============================================================================
// EXPORTAÇÕES PRINCIPAIS DO PACOTE CORE
// =============================================================================

// Tipos
export * from './types'

// Validações
export * from './validations'

// Utilitários
export * from './utils'

// Banco de dados
export * from './database'

// =============================================================================
// EXPORTAÇÕES CONVENIÊNCIA
// =============================================================================

// Re-exportar schemas mais usados
export {
  idSchema,
  emailSchema,
  phoneSchema,
  dateSchema,
  dateOnlySchema,
  timeSchema,
  loginSchema,
  signupSchema,
  createAppointmentSchema,
  updateAppointmentSchema,
  availabilityRequestSchema,
  reportFiltersSchema,
  schemas
} from './validations'

// Re-exportar utilitários mais usados
export {
  formatDate,
  formatTime,
  formatDateTime,
  formatCurrency,
  formatPhone,
  generateId,
  generateIdempotencyKey,
  hashPassword,
  verifyPassword,
  generateJWT,
  verifyJWT,
  isValidEmail,
  isValidPhone,
  getAppConfig,
  utils
} from './utils'

// Re-exportar cliente de banco
export {
  DatabaseClient,
  getDatabaseClient
} from './database'
