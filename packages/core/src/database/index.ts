import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

// =============================================================================
// CONFIGURAÇÃO DO CLIENTE SUPABASE
// =============================================================================

export class DatabaseClient {
  private client: SupabaseClient<Database>
  private serviceClient: SupabaseClient<Database>

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL!
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      throw new Error('Variáveis de ambiente do Supabase não configuradas')
    }

    this.client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })

    this.serviceClient = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }

  // =============================================================================
  // GETTERS PARA OS CLIENTES
  // =============================================================================

  getClient(): SupabaseClient<Database> {
    return this.client
  }

  getServiceClient(): SupabaseClient<Database> {
    return this.serviceClient
  }

  // =============================================================================
  // MÉTODOS DE AUTENTICAÇÃO
  // =============================================================================

  async signUp(email: string, password: string, metadata?: any) {
    return this.client.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
  }

  async signIn(email: string, password: string) {
    return this.client.auth.signInWithPassword({
      email,
      password
    })
  }

  async signOut() {
    return this.client.auth.signOut()
  }

  async refreshSession(refreshToken: string) {
    return this.client.auth.refreshSession({
      refresh_token: refreshToken
    })
  }

  async getSession() {
    return this.client.auth.getSession()
  }

  async getUser() {
    return this.client.auth.getUser()
  }

  // =============================================================================
  // MÉTODOS DE TENANT
  // =============================================================================

  async createTenant(data: {
    name: string
    plan?: 'free' | 'basic' | 'premium'
    status?: 'active' | 'inactive' | 'suspended'
  }) {
    return this.serviceClient
      .from('tenants')
      .insert({
        ...data,
        plan: data.plan || 'free',
        status: data.status || 'active'
      })
      .select()
      .single()
  }

  async getTenant(id: string) {
    return this.serviceClient
      .from('tenants')
      .select('*')
      .eq('id', id)
      .single()
  }

  async updateTenant(id: string, data: Partial<Database['public']['Tables']['tenants']['Update']>) {
    return this.serviceClient
      .from('tenants')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }

  // =============================================================================
  // MÉTODOS DE UNIDADE
  // =============================================================================

  async createUnit(data: {
    tenant_id: string
    name: string
    address: string
    timezone?: string
  }) {
    return this.client
      .from('units')
      .insert({
        ...data,
        timezone: data.timezone || 'America/Sao_Paulo'
      })
      .select()
      .single()
  }

  async getUnits(tenant_id: string) {
    return this.client
      .from('units')
      .select('*')
      .eq('tenant_id', tenant_id)
      .order('name')
  }

  async getUnit(id: string) {
    return this.client
      .from('units')
      .select('*')
      .eq('id', id)
      .single()
  }

  async updateUnit(id: string, data: Partial<Database['public']['Tables']['units']['Update']>) {
    return this.client
      .from('units')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }

  async deleteUnit(id: string) {
    return this.client
      .from('units')
      .delete()
      .eq('id', id)
  }

  // =============================================================================
  // MÉTODOS DE USUÁRIO
  // =============================================================================

  async createUser(data: {
    tenant_id: string
    name: string
    email: string
    phone?: string
    role: 'admin' | 'professional' | 'reception'
    password_hash?: string
    auth_provider?: 'supabase' | 'google' | 'microsoft'
  }) {
    return this.client
      .from('users')
      .insert(data)
      .select()
      .single()
  }

  async getUsers(tenant_id: string) {
    return this.client
      .from('users')
      .select('*')
      .eq('tenant_id', tenant_id)
      .order('name')
  }

  async getUser(id: string) {
    return this.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
  }

  async getUserByEmail(email: string) {
    return this.client
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
  }

  async updateUser(id: string, data: Partial<Database['public']['Tables']['users']['Update']>) {
    return this.client
      .from('users')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }

  async deleteUser(id: string) {
    return this.client
      .from('users')
      .delete()
      .eq('id', id)
  }

  // =============================================================================
  // MÉTODOS DE PROFISSIONAL
  // =============================================================================

  async createProfessional(data: {
    unit_id: string
    name: string
    bio?: string
    active?: boolean
  }) {
    return this.client
      .from('professionals')
      .insert({
        ...data,
        active: data.active ?? true
      })
      .select()
      .single()
  }

  async getProfessionals(unit_id: string) {
    return this.client
      .from('professionals')
      .select('*')
      .eq('unit_id', unit_id)
      .eq('active', true)
      .order('name')
  }

  async getProfessional(id: string) {
    return this.client
      .from('professionals')
      .select('*')
      .eq('id', id)
      .single()
  }

  async updateProfessional(id: string, data: Partial<Database['public']['Tables']['professionals']['Update']>) {
    return this.client
      .from('professionals')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }

  async deleteProfessional(id: string) {
    return this.client
      .from('professionals')
      .delete()
      .eq('id', id)
  }

  // =============================================================================
  // MÉTODOS DE CLIENTE
  // =============================================================================

  async createCustomer(data: {
    tenant_id: string
    name: string
    email: string
    phone?: string
    consent_flags?: {
      marketing: boolean
      reminders: boolean
      notifications: boolean
    }
  }) {
    return this.client
      .from('customers')
      .insert({
        ...data,
        consent_flags: data.consent_flags || {
          marketing: false,
          reminders: true,
          notifications: true
        }
      })
      .select()
      .single()
  }

  async getCustomers(tenant_id: string, filters?: {
    search?: string
    page?: number
    limit?: number
  }) {
    let query = this.client
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenant_id)

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
    }

    if (filters?.page && filters?.limit) {
      const offset = (filters.page - 1) * filters.limit
      query = query.range(offset, offset + filters.limit - 1)
    }

    return query.order('name')
  }

  async getCustomer(id: string) {
    return this.client
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()
  }

  async getCustomerByEmail(email: string, tenant_id: string) {
    return this.client
      .from('customers')
      .select('*')
      .eq('email', email)
      .eq('tenant_id', tenant_id)
      .single()
  }

  async updateCustomer(id: string, data: Partial<Database['public']['Tables']['customers']['Update']>) {
    return this.client
      .from('customers')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }

  async deleteCustomer(id: string) {
    return this.client
      .from('customers')
      .delete()
      .eq('id', id)
  }

  // =============================================================================
  // MÉTODOS DE SERVIÇO
  // =============================================================================

  async createService(data: {
    tenant_id: string
    name: string
    duration_min: number
    base_price: number
    active?: boolean
  }) {
    return this.client
      .from('services')
      .insert({
        ...data,
        active: data.active ?? true
      })
      .select()
      .single()
  }

  async getServices(tenant_id: string) {
    return this.client
      .from('services')
      .select('*')
      .eq('tenant_id', tenant_id)
      .eq('active', true)
      .order('name')
  }

  async getService(id: string) {
    return this.client
      .from('services')
      .select('*')
      .eq('id', id)
      .single()
  }

  async updateService(id: string, data: Partial<Database['public']['Tables']['services']['Update']>) {
    return this.client
      .from('services')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }

  async deleteService(id: string) {
    return this.client
      .from('services')
      .delete()
      .eq('id', id)
  }

  // =============================================================================
  // MÉTODOS DE REGRAS DE HORÁRIO
  // =============================================================================

  async createScheduleRule(data: {
    calendar_id: string
    day_of_week: number
    start_time: string
    end_time: string
    slot_min: number
  }) {
    return this.client
      .from('schedule_rules')
      .insert(data)
      .select()
      .single()
  }

  async getScheduleRules(calendar_id: string) {
    return this.client
      .from('schedule_rules')
      .select('*')
      .eq('calendar_id', calendar_id)
      .order('day_of_week')
  }

  async updateScheduleRule(id: string, data: Partial<Database['public']['Tables']['schedule_rules']['Update']>) {
    return this.client
      .from('schedule_rules')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }

  async deleteScheduleRule(id: string) {
    return this.client
      .from('schedule_rules')
      .delete()
      .eq('id', id)
  }

  // =============================================================================
  // MÉTODOS DE FOLGA/BLOQUEIO
  // =============================================================================

  async createTimeOff(data: {
    calendar_id: string
    start: string
    end: string
    reason: string
  }) {
    return this.client
      .from('time_off')
      .insert(data)
      .select()
      .single()
  }

  async getTimeOff(calendar_id: string, start?: string, end?: string) {
    let query = this.client
      .from('time_off')
      .select('*')
      .eq('calendar_id', calendar_id)

    if (start && end) {
      query = query.overlaps('start', start, 'end', end)
    }

    return query.order('start')
  }

  async updateTimeOff(id: string, data: Partial<Database['public']['Tables']['time_off']['Update']>) {
    return this.client
      .from('time_off')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }

  async deleteTimeOff(id: string) {
    return this.client
      .from('time_off')
      .delete()
      .eq('id', id)
  }

  // =============================================================================
  // MÉTODOS DE AGENDAMENTO
  // =============================================================================

  async createAppointment(data: {
    tenant_id: string
    unit_id: string
    customer_id: string
    professional_id: string
    service_id: string
    start: string
    end: string
    status?: 'pending' | 'confirmed' | 'cancelled' | 'no_show' | 'completed'
    source?: 'web' | 'phone' | 'walk_in'
    price_estimate: number
    notes?: string
    idempotency_key?: string
  }) {
    return this.client
      .from('appointments')
      .insert({
        ...data,
        status: data.status || 'pending',
        source: data.source || 'web'
      })
      .select()
      .single()
  }

  async getAppointments(tenant_id: string, filters?: {
    unit_id?: string
    professional_id?: string
    customer_id?: string
    status?: string
    from?: string
    to?: string
    page?: number
    limit?: number
  }) {
    let query = this.client
      .from('appointments')
      .select(`
        *,
        customer:customers(name, email, phone),
        professional:professionals(name),
        service:services(name, duration_min, base_price),
        unit:units(name)
      `, { count: 'exact' })
      .eq('tenant_id', tenant_id)

    if (filters?.unit_id) {
      query = query.eq('unit_id', filters.unit_id)
    }

    if (filters?.professional_id) {
      query = query.eq('professional_id', filters.professional_id)
    }

    if (filters?.customer_id) {
      query = query.eq('customer_id', filters.customer_id)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.from) {
      query = query.gte('start', filters.from)
    }

    if (filters?.to) {
      query = query.lte('start', filters.to)
    }

    if (filters?.page && filters?.limit) {
      const offset = (filters.page - 1) * filters.limit
      query = query.range(offset, offset + filters.limit - 1)
    }

    return query.order('start', { ascending: false })
  }

  async getAppointment(id: string) {
    return this.client
      .from('appointments')
      .select(`
        *,
        customer:customers(name, email, phone),
        professional:professionals(name),
        service:services(name, duration_min, base_price),
        unit:units(name)
      `)
      .eq('id', id)
      .single()
  }

  async updateAppointment(id: string, data: Partial<Database['public']['Tables']['appointments']['Update']>) {
    return this.client
      .from('appointments')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }

  async deleteAppointment(id: string) {
    return this.client
      .from('appointments')
      .delete()
      .eq('id', id)
  }

  // =============================================================================
  // MÉTODOS DE NOTIFICAÇÃO
  // =============================================================================

  async createNotification(data: {
    tenant_id: string
    channel: 'email' | 'sms' | 'push'
    to: string
    template_code: string
    payload_json: Record<string, any>
    status?: 'pending' | 'sent' | 'failed'
    scheduled_for?: string
  }) {
    return this.client
      .from('notifications')
      .insert({
        ...data,
        status: data.status || 'pending'
      })
      .select()
      .single()
  }

  async getPendingNotifications() {
    return this.client
      .from('notifications')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .order('scheduled_for')
  }

  async updateNotification(id: string, data: Partial<Database['public']['Tables']['notifications']['Update']>) {
    return this.client
      .from('notifications')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }

  // =============================================================================
  // MÉTODOS DE RELATÓRIOS
  // =============================================================================

  async getAppointmentReport(tenant_id: string, filters: {
    from: string
    to: string
    unit_id?: string
    professional_id?: string
  }) {
    let query = this.client
      .from('appointments')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenant_id)
      .gte('start', filters.from)
      .lte('start', filters.to)

    if (filters.unit_id) {
      query = query.eq('unit_id', filters.unit_id)
    }

    if (filters.professional_id) {
      query = query.eq('professional_id', filters.professional_id)
    }

    return query
  }

  // =============================================================================
  // MÉTODOS DE UTILIDADE
  // =============================================================================

  async checkIdempotency(idempotency_key: string) {
    const result = await this.client
      .from('appointments')
      .select('id')
      .eq('idempotency_key', idempotency_key)
      .single()

    return result.data !== null
  }

  async getConflictingAppointments(professional_id: string, start: string, end: string, exclude_id?: string) {
    let query = this.client
      .from('appointments')
      .select('*')
      .eq('professional_id', professional_id)
      .not('status', 'in', '(cancelled,no_show)')
      .overlaps('start', start, 'end', end)

    if (exclude_id) {
      query = query.neq('id', exclude_id)
    }

    return query
  }
}

// =============================================================================
// INSTÂNCIA SINGLETON
// =============================================================================

let dbClient: DatabaseClient | null = null

export function getDatabaseClient(): DatabaseClient {
  if (!dbClient) {
    dbClient = new DatabaseClient()
  }
  return dbClient
}

// =============================================================================
// EXPORTAR TIPOS
// =============================================================================

export type { Database }
export type { DatabaseClient }
