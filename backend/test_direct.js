import { createJdService } from './src/modules/jd/service.js';
import { createAiProvider } from './src/modules/ai/provider.js';
import { getEnvironment } from './src/config/environment.js';
import { pool as databasePool } from './src/platform/db/pool.js';
import { createPrivateStorage } from './src/platform/storage/private-storage.js';
import fs from 'fs';



async function test() {
  const env = getEnvironment();
  const aiProvider = createAiProvider(env);
  const service = createJdService({ 
    pool: databasePool, 
    storage: createPrivateStorage(env.storage), 
    environment: env 
  });
  
  // Create a minimal PNG
  const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const buffer = Buffer.from(b64, 'base64');
  const file = {
    buffer,
    size: buffer.length,
    mimetype: 'image/png'
  };

  try {
    const result = await service.extractFromFileWithAi('00000000-0000-0000-0000-000000000101', file, aiProvider);
    console.log('Success:', result);
  } catch (e) {
    console.error('Extraction Failed:', e);
  } finally {
    await databasePool.end();
  }
}

test();
