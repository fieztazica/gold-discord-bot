module.exports = {
    apps: [
        {
            name: 'gold-discord-bot',
            script: 'dist/index.js',
            cwd: './',
            instances: 1,
            exec_mode: 'fork',
            interpreter: 'node',
            env: {
                NODE_ENV: 'production',
                NODE_OPTIONS: '--max_old_space_size=256'
            },
            // Auto restart
            autorestart: true,
            max_memory_restart: '300M',

            // Logging
            output: './logs/out.log',
            error: './logs/error.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

            // Watch mode (optional)
            watch: false,
            ignore_watch: ['node_modules', 'dist', 'logs'],

            // Graceful shutdown
            kill_timeout: 5000,
            wait_ready: true,
            listen_timeout: 10000,

            // Environment variables from .env file
            env_file: '.env'
        }
    ],

    // Deploy configuration (optional)
    deploy: {
        production: {
            user: 'node',
            host: 'your_host_ip',
            ref: 'origin/main',
            repo: 'git@github.com:your_repo/gold-discord-bot.git',
            path: '/var/www/gold-discord-bot',
            'post-deploy':
                'npm run build && pm2 reload ecosystem.config.cjs --env production'
        }
    }
}
