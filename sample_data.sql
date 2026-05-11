-- ============================================================
--  Serendib Grand Hotel — Sample Data
--  PostgreSQL · Neon DB
-- ============================================================
--  Pre-requisites (already done if you ran the app once):
--    • admin@hotel.com / Admin@123   → created by DataInitializer
--    • manager@hotel.com / Staff@123
--    • receptionist1@hotel.com / Staff@123
--    • receptionist2@hotel.com / Staff@123
--
--  Run this file:
--    psql "<your-jdbc-url-as-psql-url>" -f sample_data.sql
--  Or paste into Neon console SQL editor.
-- ============================================================

-- ── ROOMS ────────────────────────────────────────────────────
INSERT INTO rooms (room_number, room_type, floor, capacity, price_per_night, status, description, amenities, created_at, updated_at)
VALUES
  ('101', 'SINGLE',  1, 1, 45.00,  'AVAILABLE',         'Cozy single room with garden view',           'Free WiFi, AC, Hot water, TV',                      NOW(), NOW()),
  ('102', 'SINGLE',  1, 1, 45.00,  'OCCUPIED',          'Quiet single room near the courtyard',        'Free WiFi, AC, Hot water',                          NOW(), NOW()),
  ('103', 'SINGLE',  1, 1, 48.00,  'CLEANING',          'Single room with courtyard-facing window',    'Free WiFi, AC, Mini-fridge',                        NOW(), NOW()),
  ('201', 'DOUBLE',  2, 2, 85.00,  'AVAILABLE',         'Spacious double room with city view',         'Free WiFi, AC, Hot water, TV, Mini-bar',            NOW(), NOW()),
  ('202', 'DOUBLE',  2, 2, 85.00,  'OCCUPIED',          'Double room with balcony',                    'Free WiFi, AC, Balcony, TV, Hot water',             NOW(), NOW()),
  ('203', 'DOUBLE',  2, 2, 90.00,  'AVAILABLE',         'Premium double room, east-facing',            'Free WiFi, AC, TV, Safe, Mini-bar',                 NOW(), NOW()),
  ('301', 'SUITE',   3, 4, 180.00, 'AVAILABLE',         'Luxury suite with ocean-inspired decor',      'Free WiFi, AC, Jacuzzi, TV, Mini-bar, Balcony',     NOW(), NOW()),
  ('302', 'SUITE',   3, 4, 195.00, 'OCCUPIED',          'Premier suite with panoramic city view',      'Free WiFi, AC, Jacuzzi, King bed, Butler service',  NOW(), NOW()),
  ('401', 'DELUXE',  4, 3, 145.00, 'AVAILABLE',         'Deluxe room with private terrace',            'Free WiFi, AC, Sea view, TV, Mini-bar, Bathtub',    NOW(), NOW()),
  ('402', 'DELUXE',  4, 3, 145.00, 'UNDER_MAINTENANCE', 'Deluxe room — renovation in progress',        'Free WiFi, AC, City view',                          NOW(), NOW()),
  ('501', 'SUITE',   5, 6, 320.00, 'AVAILABLE',         'Presidential suite — entire top floor',       'Free WiFi, AC, Private pool, Butler, Sea view',     NOW(), NOW()),
  ('502', 'DELUXE',  5, 3, 155.00, 'AVAILABLE',         'Deluxe penthouse-level with sunset view',     'Free WiFi, AC, Sea view, Balcony, Bathtub, TV',     NOW(), NOW())
ON CONFLICT (room_number) DO NOTHING;


-- ── BOOKINGS ─────────────────────────────────────────────────
-- Uses subqueries so it works regardless of auto-generated IDs.

INSERT INTO bookings (
    guest_name, guest_email, guest_phone,
    room_id, check_in_date, check_out_date,
    status, total_price,
    booked_by_id, cancelled_by_id, cancellation_reason,
    created_at, updated_at
)
VALUES

  -- 1. Confirmed future booking (room 201)
  (
    'Nuwan Perera', 'nuwan.perera@gmail.com', '071 234 5678',
    (SELECT id FROM rooms WHERE room_number = '201'),
    CURRENT_DATE + 2, CURRENT_DATE + 5,
    'CONFIRMED', 255.00,
    (SELECT id FROM users WHERE email = 'receptionist1@hotel.com'),
    NULL, NULL,
    NOW(), NOW()
  ),

  -- 2. Checked-in guest (room 302)
  (
    'Dilini Jayawardena', 'dilini.j@yahoo.com', '077 891 2345',
    (SELECT id FROM rooms WHERE room_number = '302'),
    CURRENT_DATE - 1, CURRENT_DATE + 2,
    'CHECKED_IN', 585.00,
    (SELECT id FROM users WHERE email = 'manager@hotel.com'),
    NULL, NULL,
    NOW() - INTERVAL '1 day', NOW()
  ),

  -- 3. Checked-in guest (room 102)
  (
    'Ruwan Bandara', 'ruwan.b@hotmail.com', '076 456 7890',
    (SELECT id FROM rooms WHERE room_number = '102'),
    CURRENT_DATE, CURRENT_DATE + 3,
    'CHECKED_IN', 135.00,
    (SELECT id FROM users WHERE email = 'receptionist2@hotel.com'),
    NULL, NULL,
    NOW(), NOW()
  ),

  -- 4. Checked-in guest (room 202)
  (
    'Chamari Dissanayake', 'chamari.d@gmail.com', '070 123 4567',
    (SELECT id FROM rooms WHERE room_number = '202'),
    CURRENT_DATE - 2, CURRENT_DATE + 1,
    'CHECKED_IN', 255.00,
    (SELECT id FROM users WHERE email = 'receptionist1@hotel.com'),
    NULL, NULL,
    NOW() - INTERVAL '2 days', NOW()
  ),

  -- 5. Completed booking (checked out)
  (
    'Kasun Fernando', 'kasun.fernando@hotmail.com', '071 987 6543',
    (SELECT id FROM rooms WHERE room_number = '401'),
    CURRENT_DATE - 5, CURRENT_DATE - 2,
    'CHECKED_OUT', 435.00,
    (SELECT id FROM users WHERE email = 'manager@hotel.com'),
    NULL, NULL,
    NOW() - INTERVAL '5 days', NOW()
  ),

  -- 6. Cancelled booking
  (
    'Ashan Rajapaksa', 'ashan.r@gmail.com', '077 321 0987',
    (SELECT id FROM rooms WHERE room_number = '203'),
    CURRENT_DATE + 10, CURRENT_DATE + 14,
    'CANCELLED', 360.00,
    (SELECT id FROM users WHERE email = 'receptionist2@hotel.com'),
    (SELECT id FROM users WHERE email = 'manager@hotel.com'),
    'Guest requested cancellation due to travel change.',
    NOW() - INTERVAL '2 hours', NOW()
  ),

  -- 7. Future confirmed booking for suite
  (
    'Malsha Senanayake', 'malsha.s@gmail.com', '076 654 3210',
    (SELECT id FROM rooms WHERE room_number = '301'),
    CURRENT_DATE + 7, CURRENT_DATE + 10,
    'CONFIRMED', 540.00,
    (SELECT id FROM users WHERE email = 'manager@hotel.com'),
    NULL, NULL,
    NOW(), NOW()
  ),

  -- 8. Past completed booking
  (
    'Sanduni Kumari', 'sanduni.k@yahoo.com', '071 111 2222',
    (SELECT id FROM rooms WHERE room_number = '101'),
    CURRENT_DATE - 10, CURRENT_DATE - 7,
    'CHECKED_OUT', 135.00,
    (SELECT id FROM users WHERE email = 'receptionist1@hotel.com'),
    NULL, NULL,
    NOW() - INTERVAL '10 days', NOW()
  );


-- ── AUDIT LOGS ───────────────────────────────────────────────

INSERT INTO audit_logs (action, entity_type, entity_id, performed_by_id, details, timestamp)
VALUES
  (
    'BOOKING_CREATED', 'Booking', 1,
    (SELECT id FROM users WHERE email = 'receptionist1@hotel.com'),
    'Booking created for guest: Nuwan Perera, room: 201',
    NOW() - INTERVAL '30 minutes'
  ),
  (
    'BOOKING_CREATED', 'Booking', 2,
    (SELECT id FROM users WHERE email = 'manager@hotel.com'),
    'Booking created for guest: Dilini Jayawardena, room: 302',
    NOW() - INTERVAL '1 day'
  ),
  (
    'BOOKING_CANCELLED', 'Booking', 6,
    (SELECT id FROM users WHERE email = 'manager@hotel.com'),
    'Booking cancelled — reason: Guest requested cancellation due to travel change.',
    NOW() - INTERVAL '2 hours'
  ),
  (
    'ROOM_STATUS_CHANGED', 'Room',
    (SELECT id FROM rooms WHERE room_number = '103'),
    (SELECT id FROM users WHERE email = 'receptionist2@hotel.com'),
    'Room 103 status changed to CLEANING after checkout',
    NOW() - INTERVAL '3 hours'
  ),
  (
    'ROLE_CHANGED', 'User',
    (SELECT id FROM users WHERE email = 'receptionist2@hotel.com'),
    (SELECT id FROM users WHERE email = 'admin@hotel.com'),
    'Role changed to RECEPTIONIST',
    NOW() - INTERVAL '1 hour'
  );


-- ── VERIFY ───────────────────────────────────────────────────
SELECT 'rooms'      AS "table", COUNT(*) AS rows FROM rooms
UNION ALL
SELECT 'bookings',               COUNT(*)        FROM bookings
UNION ALL
SELECT 'audit_logs',             COUNT(*)        FROM audit_logs
UNION ALL
SELECT 'users',                  COUNT(*)        FROM users;
