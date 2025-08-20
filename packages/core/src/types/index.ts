// =============================================================================
// TIPOS PRINCIPAIS DA APLICAÇÃO
// =============================================================================

export interface Tenant {
  id: string
  name: string
  plan: 'free' | 'basic' | 'premium'
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
}

export interface Unit {
  id: string
  tenant_id: string
  name: string
  address: string
  timezone: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  tenant_id: string
  name: string
  email: string
  phone?: string
  role: 'admin' | 'professional' | 'reception'
  password_hash?: string
  auth_provider?: 'supabase' | 'google' | 'microsoft'
  created_at: string
  updated_at: string
}

export interface Professional {
  id: string
  unit_id: string
  name: string
  bio?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  tenant_id: string
  name: string
  email: string
  phone?: string
  consent_flags: {
    marketing: boolean
    reminders: boolean
    notifications: boolean
  }
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  tenant_id: string
  name: string
  duration_min: number
  base_price: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface ScheduleRule {
  id: string
  calendar_id: string
  day_of_week: number // 0-6 (domingo-sábado)
  start_time: string // HH:MM
  end_time: string // HH:MM
  slot_min: number
  created_at: string
  updated_at: string
}

export interface TimeOff {
  id: string
  calendar_id: string
  start: string // ISO datetime
  end: string // ISO datetime
  reason: string
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  tenant_id: string
  unit_id: string
  customer_id: string
  professional_id: string
  service_id: string
  start: string // ISO datetime
  end: string // ISO datetime
  status: 'pending' | 'confirmed' | 'cancelled' | 'no_show' | 'completed'
  source: 'web' | 'phone' | 'walk_in'
  price_estimate: number
  notes?: string
  idempotency_key?: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  tenant_id: string
  channel: 'email' | 'sms' | 'push'
  to: string
  template_code: string
  payload_json: Record<string, any>
  status: 'pending' | 'sent' | 'failed'
  scheduled_for: string // ISO datetime
  sent_at?: string
  created_at: string
  updated_at: string
}

// =============================================================================
// TIPOS PARA API E REQUESTS
// =============================================================================

export interface CreateAppointmentRequest {
  unit_id: string
  customer_id: string
  professional_id: string
  service_id: string
  start: string
  customer_data?: {
    name: string
    email: string
    phone?: string
  }
  notes?: string
  idempotency_key?: string
}

export interface UpdateAppointmentRequest {
  status?: Appointment['status']
  start?: string
  end?: string
  notes?: string
}

export interface AvailabilityRequest {
  unit_id: string
  service_id: string
  date: string // YYYY-MM-DD
}

export interface AvailabilitySlot {
  start: string // ISO datetime
  end: string // ISO datetime
  available: boolean
  professional_id?: string
}

export interface AvailabilityResponse {
  date: string
  unit_id: string
  service_id: string
  slots: AvailabilitySlot[]
}

// =============================================================================
// TIPOS PARA RELATÓRIOS
// =============================================================================

export interface AppointmentReport {
  total: number
  by_status: Record<Appointment['status'], number>
  by_professional: Record<string, number>
  by_unit: Record<string, number>
  by_date: Record<string, number>
}

export interface ReportFilters {
  from: string // YYYY-MM-DD
  to: string // YYYY-MM-DD
  unit_id?: string
  professional_id?: string
  status?: Appointment['status']
}

// =============================================================================
// TIPOS PARA AUTENTICAÇÃO
// =============================================================================

export interface AuthUser {
  id: string
  tenant_id: string
  email: string
  name: string
  role: User['role']
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
  tenant_name: string
}

export interface AuthResponse {
  user: AuthUser
  access_token: string
  refresh_token: string
}

// =============================================================================
// TIPOS PARA PAGAMENTOS (OPCIONAL)
// =============================================================================

export interface PaymentMethod {
  id: string
  type: 'mercadopago' | 'stripe'
  enabled: boolean
  config: Record<string, any>
}

export interface PaymentRequest {
  appointment_id: string
  amount: number
  currency: 'BRL'
  method: 'mercadopago' | 'stripe'
  customer_data: {
    name: string
    email: string
    phone?: string
  }
}

export interface PaymentResponse {
  id: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  checkout_url?: string
  external_id?: string
}

// =============================================================================
// TIPOS PARA CONFIGURAÇÕES
// =============================================================================

export interface AppConfig {
  timezone: string
  locale: string
  currency: string
  enable_payments: boolean
  enable_notifications: boolean
  rate_limit_requests: number
  rate_limit_window_ms: number
  cache_ttl_seconds: number
}

// =============================================================================
// TIPOS PARA TEMPLATES DE E-MAIL
// =============================================================================

export interface EmailTemplate {
  code: string
  subject: string
  html: string
  text: string
}

export interface EmailData {
  to: string
  template_code: string
  data: Record<string, any>
  scheduled_for?: string
}

// =============================================================================
// TIPOS PARA CACHE
// =============================================================================

export interface CacheKey {
  prefix: string
  tenant_id?: string
  unit_id?: string
  service_id?: string
  date?: string
  professional_id?: string
}

export interface CacheData<T = any> {
  data: T
  expires_at: number
  created_at: number
}

// =============================================================================
// TIPOS PARA LOGS
// =============================================================================

export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  timestamp: string
  request_id?: string
  tenant_id?: string
  user_id?: string
  metadata?: Record<string, any>
}

// =============================================================================
// TIPOS PARA VALIDAÇÃO
// =============================================================================

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: ValidationError[]
}

// =============================================================================
// TIPOS PARA RESPONSES PADRÃO
// =============================================================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    has_more?: boolean
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_more: boolean
  }
}
