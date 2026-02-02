UPDATE ai_settings
SET value = 'llama3.2:1b', type = 'string'
WHERE key = 'ollama_model';

UPDATE ai_settings
SET value = 'nomic-embed-text:v1.5', type = 'string'
WHERE key = 'ollama_embedding_model';
