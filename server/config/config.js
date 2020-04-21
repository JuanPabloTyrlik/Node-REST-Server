// Port

process.env.PORT = process.env.PORT || 3000;

// Environment

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Databases

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://JP:10PHzG3E3bPBbwx2@cluster0-kemco.mongodb.net/cafe';
}

process.env.URLDB = urlDB;