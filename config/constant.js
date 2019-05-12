module.exports = {
    SECRET: 'NtubeAPP5ec7e1',
    CLIENT_URL: 'http://local.ntube.com:8080/',
    SOCIAL_KEYS: {
        GOOGLE: {
            CLIENT_ID: '390361488631-i8as8kn2pa2par0mm5s3dap4d2oa77f0.apps.googleusercontent.com',
            CLIENT_SECRET: 'ZreoYllR1Y582_lhbJ6Ox49L',
            CALLBACK: "http://localhost:8000/api/auth/google/callback"
        },
        FACEBOOK: {
            CLIENT_ID: '2248341318764911',
            CLIENT_SECRET: '927e379cd2208d49286f8c1ece6b5e40',
            CALLBACK: "http://localhost:8000/api/auth/facebook/callback"
        },
        TWITTER: {
            CLIENT_ID: 'NCaK7wXfy5H89Yf0FFqnUMC3T',
            CLIENT_SECRET: 'HyKLU2xlPRaAcUyWx6ChYbAWpaqJmWGvKN9W476nwP02OE86qj',
            CALLBACK: "http://localhost:8000/api/auth/twitter/callback"
        },
    }
}