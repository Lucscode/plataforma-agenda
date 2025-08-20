-- =============================================================================
-- SEEDS: DADOS DE DEMONSTRAÇÃO
-- Dados iniciais para testar o sistema
-- =============================================================================

-- =============================================================================
-- TENANT DEMO
-- =============================================================================

INSERT INTO tenants (id, name, plan, status) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Barbearia Demo Ltda',
    'free',
    'active'
);

-- =============================================================================
-- UNIDADE DEMO
-- =============================================================================

INSERT INTO units (id, tenant_id, name, address, timezone) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    'Matriz - Centro',
    'Rua das Flores, 123 - Centro, São Paulo - SP, 01234-567',
    'America/Sao_Paulo'
);

-- =============================================================================
-- USUÁRIOS DEMO
-- =============================================================================

INSERT INTO users (id, tenant_id, name, email, phone, role, auth_provider) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440001',
    'João Silva',
    'joao@barbeariademo.com',
    '+5511999999999',
    'admin',
    'supabase'
),
(
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440001',
    'Maria Santos',
    'maria@barbeariademo.com',
    '+5511888888888',
    'professional',
    'supabase'
),
(
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440001',
    'Pedro Costa',
    'pedro@barbeariademo.com',
    '+5511777777777',
    'reception',
    'supabase'
);

-- =============================================================================
-- PROFISSIONAIS DEMO
-- =============================================================================

INSERT INTO professionals (id, unit_id, name, bio, active) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440002',
    'Carlos Barbearia',
    'Especialista em cortes modernos e barbas. 5 anos de experiência.',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440007',
    '550e8400-e29b-41d4-a716-446655440002',
    'Ana Estética',
    'Especialista em tratamentos capilares e hidratação. Formada em estética.',
    true
);

-- =============================================================================
-- CLIENTES DEMO
-- =============================================================================

INSERT INTO customers (id, tenant_id, name, email, phone, consent_flags) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440008',
    '550e8400-e29b-41d4-a716-446655440001',
    'Roberto Almeida',
    'roberto@email.com',
    '+5511666666666',
    '{"marketing": true, "reminders": true, "notifications": true}'
),
(
    '550e8400-e29b-41d4-a716-446655440009',
    '550e8400-e29b-41d4-a716-446655440001',
    'Fernanda Lima',
    'fernanda@email.com',
    '+5511555555555',
    '{"marketing": false, "reminders": true, "notifications": true}'
),
(
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440001',
    'Lucas Oliveira',
    'lucas@email.com',
    '+5511444444444',
    '{"marketing": true, "reminders": true, "notifications": false}'
);

-- =============================================================================
-- SERVIÇOS DEMO
-- =============================================================================

INSERT INTO services (id, tenant_id, name, duration_min, base_price, active) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440001',
    'Corte Masculino',
    30,
    35.00,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440001',
    'Barba',
    20,
    25.00,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440013',
    '550e8400-e29b-41d4-a716-446655440001',
    'Corte + Barba',
    45,
    50.00,
    true
);

-- =============================================================================
-- REGRAS DE HORÁRIO DEMO
-- =============================================================================

-- Horários para Carlos Barbearia (Segunda a Sexta)
INSERT INTO schedule_rules (id, calendar_id, day_of_week, start_time, end_time, slot_min) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440014',
    '550e8400-e29b-41d4-a716-446655440006',
    1, -- Segunda
    '09:00',
    '18:00',
    15
),
(
    '550e8400-e29b-41d4-a716-446655440015',
    '550e8400-e29b-41d4-a716-446655440006',
    2, -- Terça
    '09:00',
    '18:00',
    15
),
(
    '550e8400-e29b-41d4-a716-446655440016',
    '550e8400-e29b-41d4-a716-446655440006',
    3, -- Quarta
    '09:00',
    '18:00',
    15
),
(
    '550e8400-e29b-41d4-a716-446655440017',
    '550e8400-e29b-41d4-a716-446655440006',
    4, -- Quinta
    '09:00',
    '18:00',
    15
),
(
    '550e8400-e29b-41d4-a716-446655440018',
    '550e8400-e29b-41d4-a716-446655440006',
    5, -- Sexta
    '09:00',
    '18:00',
    15
),
(
    '550e8400-e29b-41d4-a716-446655440019',
    '550e8400-e29b-41d4-a716-446655440006',
    6, -- Sábado
    '08:00',
    '16:00',
    15
);

-- Horários para Ana Estética (Segunda a Sexta)
INSERT INTO schedule_rules (id, calendar_id, day_of_week, start_time, end_time, slot_min) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440020',
    '550e8400-e29b-41d4-a716-446655440007',
    1, -- Segunda
    '10:00',
    '19:00',
    15
),
(
    '550e8400-e29b-41d4-a716-446655440021',
    '550e8400-e29b-41d4-a716-446655440007',
    2, -- Terça
    '10:00',
    '19:00',
    15
),
(
    '550e8400-e29b-41d4-a716-446655440022',
    '550e8400-e29b-41d4-a716-446655440007',
    3, -- Quarta
    '10:00',
    '19:00',
    15
),
(
    '550e8400-e29b-41d4-a716-446655440023',
    '550e8400-e29b-41d4-a716-446655440007',
    4, -- Quinta
    '10:00',
    '19:00',
    15
),
(
    '550e8400-e29b-41d4-a716-446655440024',
    '550e8400-e29b-41d4-a716-446655440007',
    5, -- Sexta
    '10:00',
    '19:00',
    15
),
(
    '550e8400-e29b-41d4-a716-446655440025',
    '550e8400-e29b-41d4-a716-446655440007',
    6, -- Sábado
    '09:00',
    '17:00',
    15
);

-- =============================================================================
-- FOLGAS/BLOQUEIOS DEMO
-- =============================================================================

-- Folga do Carlos na próxima segunda-feira
INSERT INTO time_off (id, calendar_id, start, end, reason) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440026',
    '550e8400-e29b-41d4-a716-446655440006',
    (CURRENT_DATE + INTERVAL '7 days')::date + '09:00'::time,
    (CURRENT_DATE + INTERVAL '7 days')::date + '18:00'::time,
    'Folga pessoal'
);

-- =============================================================================
-- AGENDAMENTOS DEMO
-- =============================================================================

-- Agendamentos para hoje
INSERT INTO appointments (id, tenant_id, unit_id, customer_id, professional_id, service_id, start, end, status, source, price_estimate, notes) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440027',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440008',
    '550e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440013',
    CURRENT_DATE + '10:00'::time,
    CURRENT_DATE + '10:45'::time,
    'confirmed',
    'web',
    50.00,
    'Cliente preferencial'
),
(
    '550e8400-e29b-41d4-a716-446655440028',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440009',
    '550e8400-e29b-41d4-a716-446655440007',
    '550e8400-e29b-41d4-a716-446655440011',
    CURRENT_DATE + '14:00'::time,
    CURRENT_DATE + '14:30'::time,
    'confirmed',
    'phone',
    35.00,
    'Primeira vez'
);

-- Agendamentos para amanhã
INSERT INTO appointments (id, tenant_id, unit_id, customer_id, professional_id, service_id, start, end, status, source, price_estimate, notes) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440029',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440012',
    (CURRENT_DATE + INTERVAL '1 day')::date + '11:00'::time,
    (CURRENT_DATE + INTERVAL '1 day')::date + '11:20'::time,
    'pending',
    'web',
    25.00,
    NULL
),
(
    '550e8400-e29b-41d4-a716-446655440030',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440008',
    '550e8400-e29b-41d4-a716-446655440007',
    '550e8400-e29b-41d4-a716-446655440013',
    (CURRENT_DATE + INTERVAL '1 day')::date + '15:00'::time,
    (CURRENT_DATE + INTERVAL '1 day')::date + '15:45'::time,
    'confirmed',
    'web',
    50.00,
    'Retorno'
);

-- Agendamentos para a próxima semana
INSERT INTO appointments (id, tenant_id, unit_id, customer_id, professional_id, service_id, start, end, status, source, price_estimate, notes) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440031',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440009',
    '550e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440011',
    (CURRENT_DATE + INTERVAL '7 days')::date + '13:00'::time,
    (CURRENT_DATE + INTERVAL '7 days')::date + '13:30'::time,
    'pending',
    'web',
    35.00,
    NULL
);

-- =============================================================================
-- NOTIFICAÇÕES DEMO
-- =============================================================================

-- Notificação de confirmação para o agendamento de hoje
INSERT INTO notifications (id, tenant_id, channel, to_address, template_code, payload_json, status, scheduled_for) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440032',
    '550e8400-e29b-41d4-a716-446655440001',
    'email',
    'roberto@email.com',
    'APPT_CONFIRM',
    '{
        "appointment_id": "550e8400-e29b-41d4-a716-446655440027",
        "customer_name": "Roberto Almeida",
        "professional_name": "Carlos Barbearia",
        "service_name": "Corte + Barba",
        "appointment_date": "' || CURRENT_DATE || '",
        "appointment_time": "10:00",
        "unit_name": "Matriz - Centro",
        "unit_address": "Rua das Flores, 123 - Centro, São Paulo - SP"
    }',
    'sent',
    CURRENT_TIMESTAMP - INTERVAL '1 hour'
);

-- Notificação de lembrete para amanhã
INSERT INTO notifications (id, tenant_id, channel, to_address, template_code, payload_json, status, scheduled_for) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440033',
    '550e8400-e29b-41d4-a716-446655440001',
    'email',
    'lucas@email.com',
    'APPT_REMINDER',
    '{
        "appointment_id": "550e8400-e29b-41d4-a716-446655440029",
        "customer_name": "Lucas Oliveira",
        "professional_name": "Carlos Barbearia",
        "service_name": "Barba",
        "appointment_date": "' || (CURRENT_DATE + INTERVAL '1 day')::date || '",
        "appointment_time": "11:00",
        "unit_name": "Matriz - Centro",
        "unit_address": "Rua das Flores, 123 - Centro, São Paulo - SP"
    }',
    'pending',
    (CURRENT_DATE + INTERVAL '1 day')::date + '07:00'::time
);

-- =============================================================================
-- COMENTÁRIOS SOBRE OS DADOS
-- =============================================================================

COMMENT ON TABLE tenants IS 'Dados de demonstração: Barbearia Demo Ltda';
COMMENT ON TABLE units IS 'Dados de demonstração: Unidade Matriz no Centro';
COMMENT ON TABLE users IS 'Dados de demonstração: João (admin), Maria (profissional), Pedro (recepção)';
COMMENT ON TABLE professionals IS 'Dados de demonstração: Carlos e Ana (profissionais)';
COMMENT ON TABLE customers IS 'Dados de demonstração: Roberto, Fernanda e Lucas (clientes)';
COMMENT ON TABLE services IS 'Dados de demonstração: Corte, Barba e Corte+Barba';
COMMENT ON TABLE schedule_rules IS 'Dados de demonstração: Horários de funcionamento dos profissionais';
COMMENT ON TABLE time_off IS 'Dados de demonstração: Folga do Carlos na próxima segunda';
COMMENT ON TABLE appointments IS 'Dados de demonstração: Agendamentos para hoje, amanhã e próxima semana';
COMMENT ON TABLE notifications IS 'Dados de demonstração: Notificações de confirmação e lembretes';

-- =============================================================================
-- FIM DOS SEEDS
-- =============================================================================
