-- =============================================================================
-- MIGRAÇÃO: POLÍTICAS RLS (ROW LEVEL SECURITY)
-- Isolamento multi-tenant para segurança
-- =============================================================================

-- =============================================================================
-- HABILITAR RLS EM TODAS AS TABELAS
-- =============================================================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_off ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- POLÍTICAS PARA TABELA: tenants
-- =============================================================================

-- Política para permitir que usuários vejam apenas seu próprio tenant
CREATE POLICY "Users can view own tenant" ON tenants
    FOR SELECT USING (auth.uid()::text IN (
        SELECT id::text FROM users WHERE tenant_id = tenants.id
    ));

-- Política para permitir que admins do sistema criem tenants
CREATE POLICY "System admins can create tenants" ON tenants
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Política para permitir que admins do tenant atualizem seu tenant
CREATE POLICY "Tenant admins can update own tenant" ON tenants
    FOR UPDATE USING (auth.uid()::text IN (
        SELECT id::text FROM users 
        WHERE tenant_id = tenants.id 
        AND role = 'admin'
    ));

-- =============================================================================
-- POLÍTICAS PARA TABELA: units
-- =============================================================================

-- Política para permitir que usuários vejam unidades do seu tenant
CREATE POLICY "Users can view units from own tenant" ON units
    FOR SELECT USING (auth.uid()::text IN (
        SELECT id::text FROM users WHERE tenant_id = units.tenant_id
    ));

-- Política para permitir que admins criem unidades no seu tenant
CREATE POLICY "Tenant admins can create units" ON units
    FOR INSERT WITH CHECK (auth.uid()::text IN (
        SELECT id::text FROM users 
        WHERE tenant_id = units.tenant_id 
        AND role = 'admin'
    ));

-- Política para permitir que admins atualizem unidades do seu tenant
CREATE POLICY "Tenant admins can update own units" ON units
    FOR UPDATE USING (auth.uid()::text IN (
        SELECT id::text FROM users 
        WHERE tenant_id = units.tenant_id 
        AND role = 'admin'
    ));

-- Política para permitir que admins deletem unidades do seu tenant
CREATE POLICY "Tenant admins can delete own units" ON units
    FOR DELETE USING (auth.uid()::text IN (
        SELECT id::text FROM users 
        WHERE tenant_id = units.tenant_id 
        AND role = 'admin'
    ));

-- =============================================================================
-- POLÍTICAS PARA TABELA: users
-- =============================================================================

-- Política para permitir que usuários vejam outros usuários do mesmo tenant
CREATE POLICY "Users can view users from own tenant" ON users
    FOR SELECT USING (auth.uid()::text IN (
        SELECT id::text FROM users WHERE tenant_id = users.tenant_id
    ));

-- Política para permitir que usuários vejam seu próprio perfil
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (id::text = auth.uid()::text);

-- Política para permitir que admins criem usuários no seu tenant
CREATE POLICY "Tenant admins can create users" ON users
    FOR INSERT WITH CHECK (auth.uid()::text IN (
        SELECT id::text FROM users 
        WHERE tenant_id = users.tenant_id 
        AND role = 'admin'
    ));

-- Política para permitir que usuários atualizem seu próprio perfil
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (id::text = auth.uid()::text);

-- Política para permitir que admins atualizem usuários do seu tenant
CREATE POLICY "Tenant admins can update users" ON users
    FOR UPDATE USING (auth.uid()::text IN (
        SELECT id::text FROM users 
        WHERE tenant_id = users.tenant_id 
        AND role = 'admin'
    ));

-- Política para permitir que admins deletem usuários do seu tenant
CREATE POLICY "Tenant admins can delete users" ON users
    FOR DELETE USING (auth.uid()::text IN (
        SELECT id::text FROM users 
        WHERE tenant_id = users.tenant_id 
        AND role = 'admin'
    ));

-- =============================================================================
-- POLÍTICAS PARA TABELA: professionals
-- =============================================================================

-- Política para permitir que usuários vejam profissionais do seu tenant
CREATE POLICY "Users can view professionals from own tenant" ON professionals
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM users u
        JOIN units un ON u.tenant_id = un.tenant_id
        WHERE u.id::text = auth.uid()::text
        AND un.id = professionals.unit_id
    ));

-- Política para permitir que admins criem profissionais
CREATE POLICY "Tenant admins can create professionals" ON professionals
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM users u
        JOIN units un ON u.tenant_id = un.tenant_id
        WHERE u.id::text = auth.uid()::text
        AND u.role = 'admin'
        AND un.id = professionals.unit_id
    ));

-- Política para permitir que admins atualizem profissionais
CREATE POLICY "Tenant admins can update professionals" ON professionals
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM users u
        JOIN units un ON u.tenant_id = un.tenant_id
        WHERE u.id::text = auth.uid()::text
        AND u.role = 'admin'
        AND un.id = professionals.unit_id
    ));

-- Política para permitir que admins deletem profissionais
CREATE POLICY "Tenant admins can delete professionals" ON professionals
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM users u
        JOIN units un ON u.tenant_id = un.tenant_id
        WHERE u.id::text = auth.uid()::text
        AND u.role = 'admin'
        AND un.id = professionals.unit_id
    ));

-- =============================================================================
-- POLÍTICAS PARA TABELA: customers
-- =============================================================================

-- Política para permitir que usuários vejam clientes do seu tenant
CREATE POLICY "Users can view customers from own tenant" ON customers
    FOR SELECT USING (auth.uid()::text IN (
        SELECT id::text FROM users WHERE tenant_id = customers.tenant_id
    ));

-- Política para permitir que usuários criem clientes no seu tenant
CREATE POLICY "Users can create customers" ON customers
    FOR INSERT WITH CHECK (auth.uid()::text IN (
        SELECT id::text FROM users WHERE tenant_id = customers.tenant_id
    ));

-- Política para permitir que usuários atualizem clientes do seu tenant
CREATE POLICY "Users can update customers" ON customers
    FOR UPDATE USING (auth.uid()::text IN (
        SELECT id::text FROM users WHERE tenant_id = customers.tenant_id
    ));

-- Política para permitir que usuários deletem clientes do seu tenant
CREATE POLICY "Users can delete customers" ON customers
    FOR DELETE USING (auth.uid()::text IN (
        SELECT id::text FROM users WHERE tenant_id = customers.tenant_id
    ));

-- =============================================================================
-- POLÍTICAS PARA TABELA: services
-- =============================================================================

-- Política para permitir que usuários vejam serviços do seu tenant
CREATE POLICY "Users can view services from own tenant" ON services
    FOR SELECT USING (auth.uid()::text IN (
        SELECT id::text FROM users WHERE tenant_id = services.tenant_id
    ));

-- Política para permitir que admins criem serviços
CREATE POLICY "Tenant admins can create services" ON services
    FOR INSERT WITH CHECK (auth.uid()::text IN (
        SELECT id::text FROM users 
        WHERE tenant_id = services.tenant_id 
        AND role = 'admin'
    ));

-- Política para permitir que admins atualizem serviços
CREATE POLICY "Tenant admins can update services" ON services
    FOR UPDATE USING (auth.uid()::text IN (
        SELECT id::text FROM users 
        WHERE tenant_id = services.tenant_id 
        AND role = 'admin'
    ));

-- Política para permitir que admins deletem serviços
CREATE POLICY "Tenant admins can delete services" ON services
    FOR DELETE USING (auth.uid()::text IN (
        SELECT id::text FROM users 
        WHERE tenant_id = services.tenant_id 
        AND role = 'admin'
    ));

-- =============================================================================
-- POLÍTICAS PARA TABELA: schedule_rules
-- =============================================================================

-- Política para permitir que usuários vejam regras de horário do seu tenant
CREATE POLICY "Users can view schedule rules from own tenant" ON schedule_rules
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM users u
        JOIN professionals p ON p.unit_id IN (
            SELECT id FROM units WHERE tenant_id = u.tenant_id
        )
        WHERE u.id::text = auth.uid()::text
        AND p.id = schedule_rules.calendar_id
    ));

-- Política para permitir que admins criem regras de horário
CREATE POLICY "Tenant admins can create schedule rules" ON schedule_rules
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM users u
        JOIN professionals p ON p.unit_id IN (
            SELECT id FROM units WHERE tenant_id = u.tenant_id
        )
        WHERE u.id::text = auth.uid()::text
        AND u.role = 'admin'
        AND p.id = schedule_rules.calendar_id
    ));

-- Política para permitir que admins atualizem regras de horário
CREATE POLICY "Tenant admins can update schedule rules" ON schedule_rules
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM users u
        JOIN professionals p ON p.unit_id IN (
            SELECT id FROM units WHERE tenant_id = u.tenant_id
        )
        WHERE u.id::text = auth.uid()::text
        AND u.role = 'admin'
        AND p.id = schedule_rules.calendar_id
    ));

-- Política para permitir que admins deletem regras de horário
CREATE POLICY "Tenant admins can delete schedule rules" ON schedule_rules
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM users u
        JOIN professionals p ON p.unit_id IN (
            SELECT id FROM units WHERE tenant_id = u.tenant_id
        )
        WHERE u.id::text = auth.uid()::text
        AND u.role = 'admin'
        AND p.id = schedule_rules.calendar_id
    ));

-- =============================================================================
-- POLÍTICAS PARA TABELA: time_off
-- =============================================================================

-- Política para permitir que usuários vejam folgas do seu tenant
CREATE POLICY "Users can view time off from own tenant" ON time_off
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM users u
        JOIN professionals p ON p.unit_id IN (
            SELECT id FROM units WHERE tenant_id = u.tenant_id
        )
        WHERE u.id::text = auth.uid()::text
        AND p.id = time_off.calendar_id
    ));

-- Política para permitir que admins criem folgas
CREATE POLICY "Tenant admins can create time off" ON time_off
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM users u
        JOIN professionals p ON p.unit_id IN (
            SELECT id FROM units WHERE tenant_id = u.tenant_id
        )
        WHERE u.id::text = auth.uid()::text
        AND u.role = 'admin'
        AND p.id = time_off.calendar_id
    ));

-- Política para permitir que admins atualizem folgas
CREATE POLICY "Tenant admins can update time off" ON time_off
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM users u
        JOIN professionals p ON p.unit_id IN (
            SELECT id FROM units WHERE tenant_id = u.tenant_id
        )
        WHERE u.id::text = auth.uid()::text
        AND u.role = 'admin'
        AND p.id = time_off.calendar_id
    ));

-- Política para permitir que admins deletem folgas
CREATE POLICY "Tenant admins can delete time off" ON time_off
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM users u
        JOIN professionals p ON p.unit_id IN (
            SELECT id FROM units WHERE tenant_id = u.tenant_id
        )
        WHERE u.id::text = auth.uid()::text
        AND u.role = 'admin'
        AND p.id = time_off.calendar_id
    ));

-- =============================================================================
-- POLÍTICAS PARA TABELA: appointments
-- =============================================================================

-- Política para permitir que usuários vejam agendamentos do seu tenant
CREATE POLICY "Users can view appointments from own tenant" ON appointments
    FOR SELECT USING (auth.uid()::text IN (
        SELECT id::text FROM users WHERE tenant_id = appointments.tenant_id
    ));

-- Política para permitir que usuários criem agendamentos no seu tenant
CREATE POLICY "Users can create appointments" ON appointments
    FOR INSERT WITH CHECK (auth.uid()::text IN (
        SELECT id::text FROM users WHERE tenant_id = appointments.tenant_id
    ));

-- Política para permitir que usuários atualizem agendamentos do seu tenant
CREATE POLICY "Users can update appointments" ON appointments
    FOR UPDATE USING (auth.uid()::text IN (
        SELECT id::text FROM users WHERE tenant_id = appointments.tenant_id
    ));

-- Política para permitir que usuários deletem agendamentos do seu tenant
CREATE POLICY "Users can delete appointments" ON appointments
    FOR DELETE USING (auth.uid()::text IN (
        SELECT id::text FROM users WHERE tenant_id = appointments.tenant_id
    ));

-- =============================================================================
-- POLÍTICAS PARA TABELA: notifications
-- =============================================================================

-- Política para permitir que usuários vejam notificações do seu tenant
CREATE POLICY "Users can view notifications from own tenant" ON notifications
    FOR SELECT USING (auth.uid()::text IN (
        SELECT id::text FROM users WHERE tenant_id = notifications.tenant_id
    ));

-- Política para permitir que usuários criem notificações no seu tenant
CREATE POLICY "Users can create notifications" ON notifications
    FOR INSERT WITH CHECK (auth.uid()::text IN (
        SELECT id::text FROM users WHERE tenant_id = notifications.tenant_id
    ));

-- Política para permitir que usuários atualizem notificações do seu tenant
CREATE POLICY "Users can update notifications" ON notifications
    FOR UPDATE USING (auth.uid()::text IN (
        SELECT id::text FROM users WHERE tenant_id = notifications.tenant_id
    ));

-- Política para permitir que usuários deletem notificações do seu tenant
CREATE POLICY "Users can delete notifications" ON notifications
    FOR DELETE USING (auth.uid()::text IN (
        SELECT id::text FROM users WHERE tenant_id = notifications.tenant_id
    ));

-- =============================================================================
-- POLÍTICAS ESPECIAIS PARA BOOKING PÚBLICO
-- =============================================================================

-- Política para permitir acesso público a unidades (apenas para booking)
CREATE POLICY "Public can view units for booking" ON units
    FOR SELECT USING (true);

-- Política para permitir acesso público a profissionais (apenas para booking)
CREATE POLICY "Public can view professionals for booking" ON professionals
    FOR SELECT USING (active = true);

-- Política para permitir acesso público a serviços (apenas para booking)
CREATE POLICY "Public can view services for booking" ON services
    FOR SELECT USING (active = true);

-- Política para permitir acesso público a regras de horário (apenas para booking)
CREATE POLICY "Public can view schedule rules for booking" ON schedule_rules
    FOR SELECT USING (true);

-- =============================================================================
-- FUNÇÃO PARA OBTER TENANT_ID DO USUÁRIO ATUAL
-- =============================================================================

CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT tenant_id 
        FROM users 
        WHERE id::text = auth.uid()::text
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- FUNÇÃO PARA VERIFICAR SE USUÁRIO É ADMIN DO TENANT
-- =============================================================================

CREATE OR REPLACE FUNCTION is_tenant_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM users 
        WHERE id::text = auth.uid()::text
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- FUNÇÃO PARA VERIFICAR SE USUÁRIO PERTENCE AO TENANT
-- =============================================================================

CREATE OR REPLACE FUNCTION belongs_to_tenant(p_tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM users 
        WHERE id::text = auth.uid()::text
        AND tenant_id = p_tenant_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- FIM DA MIGRAÇÃO RLS
-- =============================================================================
