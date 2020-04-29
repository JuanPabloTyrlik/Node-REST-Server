// Port

process.env.PORT = process.env.PORT || 3000;

// Environment

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Token Expiration

process.env.TOKEN_EXPIRATION = '48h';

// Token Seed

process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'desarrollo';

// Google Client ID

process.env.CLIENT_ID = process.env.CLIENT_ID || '74872134323-up75p64jaijpk94ov2c4ts318knvmqh6.apps.googleusercontent.com';

// Databases

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;