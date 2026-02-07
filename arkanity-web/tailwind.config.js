module.exports = {
    content: [
        "./index.html",
        "./privacy.html",
        "./terms.html",
        "./404.html",
        "./js/main.js"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#00d9ff',
                    dark: '#00a8cc',
                },
                dark: {
                    DEFAULT: '#1a1a1a',
                    elevated: '#242424',
                },
                gray: {
                    100: '#f5f5f5',
                    300: '#d4d4d4',
                    600: '#6b7280',
                },
                accent: {
                    success: '#10b981',
                    warning: '#f59e0b',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        }
    },
    plugins: []
}
