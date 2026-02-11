
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.antigravity.memoryfix',
  appName: 'MemoryFix',
  webDir: 'out',
  server: {
    url: 'https://memory-fix-app.vercel.app',
    cleartext: true
  }
};

export default config;
