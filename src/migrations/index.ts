import * as migration_20260407_164508 from './20260407_164508';
import * as migration_20260407_185032 from './20260407_185032';
import * as migration_20260412_000000 from './20260412_000000';
import * as migration_20260426_about_description_richtext from './20260426_about_description_richtext';

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
  {
    up: migration_20260412_000000.up,
    down: migration_20260412_000000.down,
    name: '20260412_000000',
  },
  {
    up: migration_20260426_about_description_richtext.up,
    down: migration_20260426_about_description_richtext.down,
    name: '20260426_about_description_richtext',
  },
];
