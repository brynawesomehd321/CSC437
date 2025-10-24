import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        stats: resolve(__dirname, 'stats.html'),
        game: resolve(__dirname, 'game.html'),
        player: resolve(__dirname, 'player.html'),
        schedule: resolve(__dirname, 'schedule.html'),
        team: resolve(__dirname, 'team.html'),
        roster: resolve(__dirname, 'roster.html'),
      },
    },
  },
})