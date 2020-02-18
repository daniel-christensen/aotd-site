const app = require('./app');

const serverHTTPS = app.listen(443, () => {
    console.log(`Express is running on port ${serverHTTPS.address().port}`);
});

const serverHTTP = app.listen(80, () => {
    console.log(`Express is running on port ${serverHTTP.address().port}`);
});