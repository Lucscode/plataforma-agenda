import { format, addMinutes, parseISO, isValid, startOfDay, endOfDay } from 'date-fns'
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// =============================================================================
// UTILITÁRIOS DE DATA E HORA
// =============================================================================

export const TIMEZONE = 'America/Sao_Paulo'
export const LOCALE = 'pt-BR'

export function formatDate(date: Date | string, formatStr: string = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: require('date-fns/locale/pt-BR') })
}

export function formatTime(date: Date | string, formatStr: string = 'HH:mm'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export function formatDateTime(date: Date | string, formatStr: string = 'dd/MM/yyyy HH:mm'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: require('date-fns/locale/pt-BR') })
}

export function toUTC(date: Date | string, timezone: string = TIMEZONE): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return zonedTimeToUtc(dateObj, timezone)
}

export function fromUTC(date: Date | string, timezone: string = TIMEZONE): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return utcToZonedTime(dateObj, timezone)
}

export function isValidDate(date: string): boolean {
  const parsed = parseISO(date)
  return isValid(parsed)
}

export function getDayOfWeek(date: Date | string): number {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return dateObj.getDay() // 0 = domingo, 6 = sábado
}

export function addMinutesToDate(date: Date | string, minutes: number): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return addMinutes(dateObj, minutes)
}

export function getStartOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return startOfDay(dateObj)
}

export function getEndOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return endOfDay(dateObj)
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  slotMinutes: number = 15
): string[] {
  const slots: string[] = []
  const start = parseISO(`2000-01-01T${startTime}:00`)
  const end = parseISO(`2000-01-01T${endTime}:00`)
  
  let current = start
  while (current < end) {
    slots.push(format(current, 'HH:mm'))
    current = addMinutes(current, slotMinutes)
  }
  
  return slots
}

// =============================================================================
// UTILITÁRIOS DE ID E CHAVES
// =============================================================================

export function generateId(): string {
  return nanoid(16)
}

export function generateIdempotencyKey(): string {
  return `idemp_${nanoid(32)}`
}

export function generateApiKey(): string {
  return `pk_${nanoid(32)}`
}

export function generateSecretKey(): string {
  return `sk_${nanoid(64)}`
}

// =============================================================================
// UTILITÁRIOS DE CRIPTOGRAFIA
// =============================================================================

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateJWT(payload: any, secret: string, expiresIn: string = '1h'): string {
  return jwt.sign(payload, secret, { expiresIn })
}

export function verifyJWT(token: string, secret: string): any {
  try {
    return jwt.verify(token, secret)
  } catch (error) {
    return null
  }
}

// =============================================================================
// UTILITÁRIOS DE VALIDAÇÃO
// =============================================================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone)
}

export function isValidCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '')
  
  if (cleanCPF.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false
  
  // Validação do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false
  
  // Validação do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false
  
  return true
}

export function isValidCNPJ(cnpj: string): boolean {
  const cleanCNPJ = cnpj.replace(/\D/g, '')
  
  if (cleanCNPJ.length !== 14) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false
  
  // Validação do primeiro dígito verificador
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights1[i]
  }
  let remainder = sum % 11
  let digit1 = remainder < 2 ? 0 : 11 - remainder
  if (digit1 !== parseInt(cleanCNPJ.charAt(12))) return false
  
  // Validação do segundo dígito verificador
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights2[i]
  }
  remainder = sum % 11
  let digit2 = remainder < 2 ? 0 : 11 - remainder
  if (digit2 !== parseInt(cleanCNPJ.charAt(13))) return false
  
  return true
}

// =============================================================================
// UTILITÁRIOS DE FORMATAÇÃO
// =============================================================================

export function formatCurrency(amount: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency
  }).format(amount)
}

export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '')
  
  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`
  }
  
  if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`
  }
  
  return phone
}

export function formatCPF(cpf: string): string {
  const clean = cpf.replace(/\D/g, '')
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function formatCNPJ(cnpj: string): string {
  const clean = cnpj.replace(/\D/g, '')
  return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

export function formatCEP(cep: string): string {
  const clean = cep.replace(/\D/g, '')
  return clean.replace(/(\d{5})(\d{3})/, '$1-$2')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// =============================================================================
// UTILITÁRIOS DE CACHE
// =============================================================================

export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|')
  
  return `${prefix}:${sortedParams}`
}

export function getCacheTTL(seconds: number = 120): number {
  return Math.floor(Date.now() / 1000) + seconds
}

// =============================================================================
// UTILITÁRIOS DE LOG
// =============================================================================

export function createLogEntry(
  level: 'debug' | 'info' | 'warn' | 'error',
  message: string,
  metadata?: Record<string, any>
) {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    request_id: metadata?.request_id,
    tenant_id: metadata?.tenant_id,
    user_id: metadata?.user_id,
    metadata: metadata ? { ...metadata } : undefined
  }
}

// =============================================================================
// UTILITÁRIOS DE PAGINAÇÃO
// =============================================================================

export function calculatePagination(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit)
  const hasMore = page < totalPages
  const offset = (page - 1) * limit
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasMore,
    offset
  }
}

// =============================================================================
// UTILITÁRIOS DE ARRAY E OBJETO
// =============================================================================

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

// =============================================================================
// UTILITÁRIOS DE STRING
// =============================================================================

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// =============================================================================
// UTILITÁRIOS DE VALIDAÇÃO DE NEGÓCIO
// =============================================================================

export function isValidAppointmentTime(
  start: Date | string,
  end: Date | string,
  businessHours: { start: string; end: string },
  dayOfWeek: number
): boolean {
  const startDate = typeof start === 'string' ? parseISO(start) : start
  const endDate = typeof end === 'string' ? parseISO(end) : end
  
  // Verifica se é um dia útil (1-5 = segunda a sexta)
  if (dayOfWeek === 0 || dayOfWeek === 6) return false
  
  // Verifica se está dentro do horário comercial
  const startTime = format(startDate, 'HH:mm')
  const endTime = format(endDate, 'HH:mm')
  
  return startTime >= businessHours.start && endTime <= businessHours.end
}

export function calculateAppointmentDuration(start: Date | string, end: Date | string): number {
  const startDate = typeof start === 'string' ? parseISO(start) : start
  const endDate = typeof end === 'string' ? parseISO(end) : end
  
  const diffMs = endDate.getTime() - startDate.getTime()
  return Math.round(diffMs / (1000 * 60)) // Retorna em minutos
}

// =============================================================================
// UTILITÁRIOS DE CONFIGURAÇÃO
// =============================================================================

export function getAppConfig() {
  return {
    timezone: process.env.TIMEZONE || TIMEZONE,
    locale: process.env.DEFAULT_LOCALE || LOCALE,
    currency: 'BRL',
    enable_payments: process.env.ENABLE_PAYMENTS === 'true',
    enable_notifications: process.env.ENABLE_NOTIFICATIONS !== 'false',
    rate_limit_requests: parseInt(process.env.RATE_LIMIT_REQUESTS || '100'),
    rate_limit_window_ms: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    cache_ttl_seconds: parseInt(process.env.CACHE_TTL_SECONDS || '120')
  }
}

// =============================================================================
// EXPORTAR TODOS OS UTILITÁRIOS
// =============================================================================

export const utils = {
  // Date
  formatDate,
  formatTime,
  formatDateTime,
  toUTC,
  fromUTC,
  isValidDate,
  getDayOfWeek,
  addMinutesToDate,
  getStartOfDay,
  getEndOfDay,
  generateTimeSlots,
  
  // ID
  generateId,
  generateIdempotencyKey,
  generateApiKey,
  generateSecretKey,
  
  // Crypto
  hashPassword,
  verifyPassword,
  generateJWT,
  verifyJWT,
  
  // Validation
  isValidEmail,
  isValidPhone,
  isValidCPF,
  isValidCNPJ,
  
  // Format
  formatCurrency,
  formatPhone,
  formatCPF,
  formatCNPJ,
  formatCEP,
  slugify,
  truncateText,
  
  // Cache
  generateCacheKey,
  getCacheTTL,
  
  // Log
  createLogEntry,
  
  // Pagination
  calculatePagination,
  
  // Array/Object
  groupBy,
  uniqueBy,
  sortBy,
  
  // String
  capitalize,
  titleCase,
  generateRandomString,
  
  // Business
  isValidAppointmentTime,
  calculateAppointmentDuration,
  
  // Config
  getAppConfig
}
