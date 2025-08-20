import { z } from 'zod'

// =============================================================================
// SCHEMAS BASE
// =============================================================================

export const idSchema = z.string().uuid()
export const emailSchema = z.string().email('E-mail inválido')
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Telefone inválido').optional()
export const dateSchema = z.string().datetime()
export const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
export const timeSchema = z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário deve estar no formato HH:MM')

// =============================================================================
// SCHEMAS DE AUTENTICAÇÃO
// =============================================================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
})

export const signupSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: emailSchema,
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  tenant_name: z.string().min(2, 'Nome do negócio deve ter pelo menos 2 caracteres').max(100)
})

export const refreshTokenSchema = z.object({
  refresh_token: z.string()
})

// =============================================================================
// SCHEMAS DE TENANT
// =============================================================================

export const tenantSchema = z.object({
  name: z.string().min(2).max(100),
  plan: z.enum(['free', 'basic', 'premium']).default('free'),
  status: z.enum(['active', 'inactive', 'suspended']).default('active')
})

export const updateTenantSchema = tenantSchema.partial()

// =============================================================================
// SCHEMAS DE UNIDADE
// =============================================================================

export const unitSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  address: z.string().min(10, 'Endereço deve ter pelo menos 10 caracteres'),
  timezone: z.string().default('America/Sao_Paulo')
})

export const updateUnitSchema = unitSchema.partial()

// =============================================================================
// SCHEMAS DE USUÁRIO
// =============================================================================

export const userSchema = z.object({
  name: z.string().min(2).max(100),
  email: emailSchema,
  phone: phoneSchema,
  role: z.enum(['admin', 'professional', 'reception']),
  password: z.string().min(8).optional()
})

export const updateUserSchema = userSchema.partial().omit({ password: true })

// =============================================================================
// SCHEMAS DE PROFISSIONAL
// =============================================================================

export const professionalSchema = z.object({
  name: z.string().min(2).max(100),
  bio: z.string().max(500).optional(),
  active: z.boolean().default(true)
})

export const updateProfessionalSchema = professionalSchema.partial()

// =============================================================================
// SCHEMAS DE CLIENTE
// =============================================================================

export const customerSchema = z.object({
  name: z.string().min(2).max(100),
  email: emailSchema,
  phone: phoneSchema,
  consent_flags: z.object({
    marketing: z.boolean().default(false),
    reminders: z.boolean().default(true),
    notifications: z.boolean().default(true)
  }).default({
    marketing: false,
    reminders: true,
    notifications: true
  })
})

export const updateCustomerSchema = customerSchema.partial()

// =============================================================================
// SCHEMAS DE SERVIÇO
// =============================================================================

export const serviceSchema = z.object({
  name: z.string().min(2).max(100),
  duration_min: z.number().int().min(15).max(480), // 15min a 8h
  base_price: z.number().min(0).max(10000),
  active: z.boolean().default(true)
})

export const updateServiceSchema = serviceSchema.partial()

// =============================================================================
// SCHEMAS DE REGRAS DE HORÁRIO
// =============================================================================

export const scheduleRuleSchema = z.object({
  day_of_week: z.number().int().min(0).max(6), // 0=domingo, 6=sábado
  start_time: timeSchema,
  end_time: timeSchema,
  slot_min: z.number().int().min(15).max(120).default(15) // 15min a 2h
})

export const updateScheduleRuleSchema = scheduleRuleSchema.partial()

// =============================================================================
// SCHEMAS DE FOLGA/BLOQUEIO
// =============================================================================

export const timeOffSchema = z.object({
  start: dateSchema,
  end: dateSchema,
  reason: z.string().min(5).max(200)
})

export const updateTimeOffSchema = timeOffSchema.partial()

// =============================================================================
// SCHEMAS DE AGENDAMENTO
// =============================================================================

export const createAppointmentSchema = z.object({
  unit_id: idSchema,
  customer_id: idSchema.optional(),
  professional_id: idSchema,
  service_id: idSchema,
  start: dateSchema,
  customer_data: z.object({
    name: z.string().min(2).max(100),
    email: emailSchema,
    phone: phoneSchema
  }).optional(),
  notes: z.string().max(500).optional(),
  idempotency_key: z.string().optional()
})

export const updateAppointmentSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'no_show', 'completed']).optional(),
  start: dateSchema.optional(),
  end: dateSchema.optional(),
  notes: z.string().max(500).optional()
})

// =============================================================================
// SCHEMAS DE DISPONIBILIDADE
// =============================================================================

export const availabilityRequestSchema = z.object({
  unit_id: idSchema,
  service_id: idSchema,
  date: dateOnlySchema
})

export const availabilitySlotSchema = z.object({
  start: dateSchema,
  end: dateSchema,
  available: z.boolean(),
  professional_id: idSchema.optional()
})

export const availabilityResponseSchema = z.object({
  date: dateOnlySchema,
  unit_id: idSchema,
  service_id: idSchema,
  slots: z.array(availabilitySlotSchema)
})

// =============================================================================
// SCHEMAS DE RELATÓRIOS
// =============================================================================

export const reportFiltersSchema = z.object({
  from: dateOnlySchema,
  to: dateOnlySchema,
  unit_id: idSchema.optional(),
  professional_id: idSchema.optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'no_show', 'completed']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
})

// =============================================================================
// SCHEMAS DE NOTIFICAÇÃO
// =============================================================================

export const notificationSchema = z.object({
  channel: z.enum(['email', 'sms', 'push']),
  to: z.string(),
  template_code: z.string(),
  payload_json: z.record(z.any()),
  scheduled_for: dateSchema.optional()
})

// =============================================================================
// SCHEMAS DE PAGAMENTO (OPCIONAL)
// =============================================================================

export const paymentRequestSchema = z.object({
  appointment_id: idSchema,
  amount: z.number().positive(),
  currency: z.literal('BRL'),
  method: z.enum(['mercadopago', 'stripe']),
  customer_data: z.object({
    name: z.string().min(2).max(100),
    email: emailSchema,
    phone: phoneSchema.optional()
  })
})

// =============================================================================
// SCHEMAS DE QUERY PARAMS
// =============================================================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).default('asc')
})

export const dateRangeSchema = z.object({
  from: dateOnlySchema.optional(),
  to: dateOnlySchema.optional()
})

// =============================================================================
// SCHEMAS DE RESPONSE
// =============================================================================

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
    meta: z.object({
      page: z.number().optional(),
      limit: z.number().optional(),
      total: z.number().optional(),
      has_more: z.boolean().optional()
    }).optional()
  })

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    meta: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      total_pages: z.number(),
      has_more: z.boolean()
    })
  })

// =============================================================================
// SCHEMAS DE VALIDAÇÃO DE IDEMPOTÊNCIA
// =============================================================================

export const idempotencyKeySchema = z.object({
  idempotency_key: z.string().min(1).max(255)
})

// =============================================================================
// SCHEMAS DE CONFIGURAÇÃO
// =============================================================================

export const appConfigSchema = z.object({
  timezone: z.string().default('America/Sao_Paulo'),
  locale: z.string().default('pt-BR'),
  currency: z.string().default('BRL'),
  enable_payments: z.boolean().default(false),
  enable_notifications: z.boolean().default(true),
  rate_limit_requests: z.number().int().min(1).default(100),
  rate_limit_window_ms: z.number().int().min(1000).default(900000),
  cache_ttl_seconds: z.number().int().min(1).default(120)
})

// =============================================================================
// SCHEMAS DE E-MAIL
// =============================================================================

export const emailTemplateSchema = z.object({
  code: z.string(),
  subject: z.string(),
  html: z.string(),
  text: z.string()
})

export const emailDataSchema = z.object({
  to: emailSchema,
  template_code: z.string(),
  data: z.record(z.any()),
  scheduled_for: dateSchema.optional()
})

// =============================================================================
// SCHEMAS DE CACHE
// =============================================================================

export const cacheKeySchema = z.object({
  prefix: z.string(),
  tenant_id: idSchema.optional(),
  unit_id: idSchema.optional(),
  service_id: idSchema.optional(),
  date: dateOnlySchema.optional(),
  professional_id: idSchema.optional()
})

export const cacheDataSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    expires_at: z.number(),
    created_at: z.number()
  })

// =============================================================================
// SCHEMAS DE LOG
// =============================================================================

export const logEntrySchema = z.object({
  level: z.enum(['debug', 'info', 'warn', 'error']),
  message: z.string(),
  timestamp: z.string(),
  request_id: z.string().optional(),
  tenant_id: idSchema.optional(),
  user_id: idSchema.optional(),
  metadata: z.record(z.any()).optional()
})

// =============================================================================
// SCHEMAS DE ERRO DE VALIDAÇÃO
// =============================================================================

export const validationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string()
})

export const validationResultSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    errors: z.array(validationErrorSchema).optional()
  })

// =============================================================================
// EXPORTAR TODOS OS SCHEMAS
// =============================================================================

export const schemas = {
  // Base
  id: idSchema,
  email: emailSchema,
  phone: phoneSchema,
  date: dateSchema,
  dateOnly: dateOnlySchema,
  time: timeSchema,

  // Auth
  login: loginSchema,
  signup: signupSchema,
  refreshToken: refreshTokenSchema,

  // Entities
  tenant: tenantSchema,
  updateTenant: updateTenantSchema,
  unit: unitSchema,
  updateUnit: updateUnitSchema,
  user: userSchema,
  updateUser: updateUserSchema,
  professional: professionalSchema,
  updateProfessional: updateProfessionalSchema,
  customer: customerSchema,
  updateCustomer: updateCustomerSchema,
  service: serviceSchema,
  updateService: updateServiceSchema,
  scheduleRule: scheduleRuleSchema,
  updateScheduleRule: updateScheduleRuleSchema,
  timeOff: timeOffSchema,
  updateTimeOff: updateTimeOffSchema,

  // Appointments
  createAppointment: createAppointmentSchema,
  updateAppointment: updateAppointmentSchema,
  availabilityRequest: availabilityRequestSchema,
  availabilitySlot: availabilitySlotSchema,
  availabilityResponse: availabilityResponseSchema,

  // Reports
  reportFilters: reportFiltersSchema,

  // Notifications
  notification: notificationSchema,

  // Payments
  paymentRequest: paymentRequestSchema,

  // Query params
  pagination: paginationSchema,
  dateRange: dateRangeSchema,

  // Responses
  apiResponse: apiResponseSchema,
  paginatedResponse: paginatedResponseSchema,

  // Idempotency
  idempotencyKey: idempotencyKeySchema,

  // Config
  appConfig: appConfigSchema,

  // Email
  emailTemplate: emailTemplateSchema,
  emailData: emailDataSchema,

  // Cache
  cacheKey: cacheKeySchema,
  cacheData: cacheDataSchema,

  // Logs
  logEntry: logEntrySchema,

  // Validation
  validationError: validationErrorSchema,
  validationResult: validationResultSchema
}
