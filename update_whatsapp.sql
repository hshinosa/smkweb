-- Update WhatsApp number di site_settings
-- Jalankan di pgAdmin atau via command line:
-- psql -U postgres -d smkweb -f update_whatsapp.sql

-- Update field whatsapp di general settings
UPDATE site_settings 
SET content = jsonb_set(
    COALESCE(content->'general', '{}'),
    'whatsapp',
    '"+6281234567890"'
)
WHERE section_key = 'general'
AND NOT (content->'general' ? 'whatsapp');

-- Verify update
SELECT section_key, content->'general'->'whatsapp' as whatsapp
FROM site_settings
WHERE section_key = 'general';
