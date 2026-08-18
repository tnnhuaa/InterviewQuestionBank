-- Forward-only repair for the synthetic load namespace. The original load
-- profile intentionally repeated one payload; bulk-import duplicate detection
-- requires each synthetic question to have a distinct normalized hash.
UPDATE questions
SET content = 'Synthetic non-production content for query and pagination preparation: ' || slug || '.',
    normalized_content_hash = encode(
      digest(
        lower(trim(regexp_replace(
          'Synthetic non-production content for query and pagination preparation: ' || slug || '.',
          '\s+', ' ', 'g'
        ))),
        'sha256'
      ),
      'hex'
    ),
    updated_at = now()
WHERE slug LIKE 'load-question-%';
