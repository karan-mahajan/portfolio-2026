import * as migration_20260407_164508 from './20260407_164508';
import * as migration_20260407_185032 from './20260407_185032';

export const migrations = [
  {
    up: migration_20260407_164508.up,
    down: migration_20260407_164508.down,
    name: '20260407_164508',
  },
  {
    up: migration_20260407_185032.up,
    down: migration_20260407_185032.down,
    name: '20260407_185032'
  },
];
