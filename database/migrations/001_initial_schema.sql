-- =============================================================================
-- MIGRAÇÃO INICIAL - ESQUEMA DO BANCO DE DADOS
-- Plataforma de Agendamento SaaS
-- =============================================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- TABELA: tenants (empresas/negócios)
-- =============================================================================

CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'premium')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABELA: units (unidades/filiais)
-- =============================================================================

CREATE TABLE IF NOT EXISTS units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'America/Sao_Paulo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABELA: users (usuários do sistema)
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'professional', 'reception')),
    password_hash VARCHAR(255),
    auth_provider VARCHAR(20) CHECK (auth_provider IN ('supabase', 'google', 'microsoft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABELA: professionals (profissionais)
-- =============================================================================

CREATE TABLE IF NOT EXISTS professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABELA: customers (clientes)
-- =============================================================================

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    consent_flags JSONB NOT NULL DEFAULT '{"marketing": false, "reminders": true, "notifications": true}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABELA: services (serviços)
-- =============================================================================

CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    duration_min INTEGER NOT NULL CHECK (duration_min >= 15 AND duration_min <= 480),
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (base_price >= 0),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABELA: schedule_rules (regras de horário)
-- =============================================================================

CREATE TABLE IF NOT EXISTS schedule_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    calendar_id UUID NOT NULL, -- Referência para professional_id ou unit_id
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_min INTEGER NOT NULL DEFAULT 15 CHECK (slot_min >= 15 AND slot_min <= 120),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- =============================================================================
-- TABELA: time_off (folgas/bloqueios)
-- =============================================================================

CREATE TABLE IF NOT EXISTS time_off (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    calendar_id UUID NOT NULL, -- Referência para professional_id ou unit_id
    start TIMESTAMP WITH TIME ZONE NOT NULL,
    end TIMESTAMP WITH TIME ZONE NOT NULL,
    reason VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_time_off_range CHECK (start < end)
);

-- =============================================================================
-- TABELA: appointments (agendamentos)
-- =============================================================================

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    start TIMESTAMP WITH TIME ZONE NOT NULL,
    end TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'no_show', 'completed')),
    source VARCHAR(20) NOT NULL DEFAULT 'web' CHECK (source IN ('web', 'phone', 'walk_in')),
    price_estimate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    idempotency_key VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_appointment_time CHECK (start < end)
);

-- =============================================================================
-- TABELA: notifications (notificações)
-- =============================================================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('email', 'sms', 'push')),
    to_address VARCHAR(255) NOT NULL,
    template_code VARCHAR(100) NOT NULL,
    payload_json JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================================================

-- Índices para tenants
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenants_plan ON tenants(plan);

-- Índices para units
CREATE INDEX IF NOT EXISTS idx_units_tenant_id ON units(tenant_id);

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Índices para professionals
CREATE INDEX IF NOT EXISTS idx_professionals_unit_id ON professionals(unit_id);
CREATE INDEX IF NOT EXISTS idx_professionals_active ON professionals(active);

-- Índices para customers
CREATE INDEX IF NOT EXISTS idx_customers_tenant_id ON customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Índices para services
CREATE INDEX IF NOT EXISTS idx_services_tenant_id ON services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);

-- Índices para schedule_rules
CREATE INDEX IF NOT EXISTS idx_schedule_rules_calendar_id ON schedule_rules(calendar_id);
CREATE INDEX IF NOT EXISTS idx_schedule_rules_day_of_week ON schedule_rules(day_of_week);

-- Índices para time_off
CREATE INDEX IF NOT EXISTS idx_time_off_calendar_id ON time_off(calendar_id);
CREATE INDEX IF NOT EXISTS idx_time_off_start_end ON time_off(start, end);

-- Índices para appointments
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_id ON appointments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_unit_id ON appointments(unit_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_professional_id ON appointments(professional_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service_id ON appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start ON appointments(start);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_idempotency_key ON appointments(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_appointments_start_end ON appointments(start, end);

-- Índices para notifications
CREATE INDEX IF NOT EXISTS idx_notifications_tenant_id ON notifications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_for ON notifications(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_notifications_channel ON notifications(channel);

-- =============================================================================
-- FUNÇÕES PARA ATUALIZAÇÃO AUTOMÁTICA DE updated_at
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON professionals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedule_rules_updated_at BEFORE UPDATE ON schedule_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_time_off_updated_at BEFORE UPDATE ON time_off FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- VIEWS PARA RELATÓRIOS
-- =============================================================================

-- View para agendamentos com dados relacionados
CREATE OR REPLACE VIEW appointments_with_details AS
SELECT 
    a.*,
    c.name as customer_name,
    c.email as customer_email,
    c.phone as customer_phone,
    p.name as professional_name,
    s.name as service_name,
    s.duration_min as service_duration,
    s.base_price as service_price,
    u.name as unit_name
FROM appointments a
JOIN customers c ON a.customer_id = c.id
JOIN professionals p ON a.professional_id = p.id
JOIN services s ON a.service_id = s.id
JOIN units u ON a.unit_id = u.id;

-- View para disponibilidade de profissionais
CREATE OR REPLACE VIEW professional_availability AS
SELECT 
    p.id as professional_id,
    p.name as professional_name,
    u.id as unit_id,
    u.name as unit_name,
    sr.day_of_week,
    sr.start_time,
    sr.end_time,
    sr.slot_min
FROM professionals p
JOIN units u ON p.unit_id = u.id
JOIN schedule_rules sr ON sr.calendar_id = p.id
WHERE p.active = true;

-- =============================================================================
-- FUNÇÕES ÚTEIS
-- =============================================================================

-- Função para verificar conflitos de agendamento
CREATE OR REPLACE FUNCTION check_appointment_conflicts(
    p_professional_id UUID,
    p_start TIMESTAMP WITH TIME ZONE,
    p_end TIMESTAMP WITH TIME ZONE,
    p_exclude_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    conflict_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO conflict_count
    FROM appointments
    WHERE professional_id = p_professional_id
      AND status NOT IN ('cancelled', 'no_show')
      AND (
          (start < p_end AND end > p_start) OR
          (start >= p_start AND start < p_end) OR
          (end > p_start AND end <= p_end)
      )
      AND (p_exclude_id IS NULL OR id != p_exclude_id);
    
    RETURN conflict_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Função para gerar slots de disponibilidade
CREATE OR REPLACE FUNCTION generate_availability_slots(
    p_professional_id UUID,
    p_date DATE,
    p_service_duration INTEGER
)
RETURNS TABLE (
    slot_start TIMESTAMP WITH TIME ZONE,
    slot_end TIMESTAMP WITH TIME ZONE,
    available BOOLEAN
) AS $$
DECLARE
    day_of_week INTEGER;
    slot_interval INTEGER;
    current_slot TIMESTAMP WITH TIME ZONE;
    slot_end_time TIMESTAMP WITH TIME ZONE;
    rule_start TIME;
    rule_end TIME;
    has_conflict BOOLEAN;
BEGIN
    -- Obter dia da semana (0 = domingo, 6 = sábado)
    day_of_week := EXTRACT(DOW FROM p_date);
    
    -- Obter regras de horário para o profissional
    SELECT start_time, end_time, slot_min
    INTO rule_start, rule_end, slot_interval
    FROM schedule_rules
    WHERE calendar_id = p_professional_id
      AND day_of_week = day_of_week
    LIMIT 1;
    
    -- Se não há regras para este dia, retornar vazio
    IF rule_start IS NULL THEN
        RETURN;
    END IF;
    
    -- Gerar slots
    current_slot := p_date + rule_start;
    slot_end_time := p_date + rule_end;
    
    WHILE current_slot < slot_end_time LOOP
        -- Verificar se há conflitos
        SELECT check_appointment_conflicts(p_professional_id, current_slot, current_slot + (p_service_duration || ' minutes')::INTERVAL)
        INTO has_conflict;
        
        -- Retornar slot
        RETURN QUERY SELECT 
            current_slot,
            current_slot + (p_service_duration || ' minutes')::INTERVAL,
            NOT has_conflict;
        
        -- Próximo slot
        current_slot := current_slot + (slot_interval || ' minutes')::INTERVAL;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- COMENTÁRIOS NAS TABELAS
-- =============================================================================

COMMENT ON TABLE tenants IS 'Empresas/negócios que usam a plataforma';
COMMENT ON TABLE units IS 'Unidades/filiais das empresas';
COMMENT ON TABLE users IS 'Usuários do sistema (admin, profissional, recepção)';
COMMENT ON TABLE professionals IS 'Profissionais que atendem clientes';
COMMENT ON TABLE customers IS 'Clientes que fazem agendamentos';
COMMENT ON TABLE services IS 'Serviços oferecidos pelas empresas';
COMMENT ON TABLE schedule_rules IS 'Regras de horário de funcionamento';
COMMENT ON TABLE time_off IS 'Folgas e bloqueios de horário';
COMMENT ON TABLE appointments IS 'Agendamentos dos clientes';
COMMENT ON TABLE notifications IS 'Notificações enviadas aos clientes';

-- =============================================================================
-- FIM DA MIGRAÇÃO
-- =============================================================================
