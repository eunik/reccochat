const express = require('express');
const expressSession = require('express-session');
const passport = require('./middlewares/authentication');

const PORT = process.env.PORT || 3000;

const app = express();

// Access Body Data
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}


// Enable sessions & passport
app.use(expressSession(({ secret: 'keyboard cat', resave: false, saveUninitialized: true })));
app.use(passport.initialize());
app.use(passport.session());

// Load Views
// const handlebars = require('express-handlebars');
// app.engine('handlebars', handlebars({
//   layoutsDir: './views/layouts',
//   defaultLayout: 'main',
// }));
// app.set('view engine', 'handlebars');
// app.set('views', `${__dirname}/views/`);

// Load Controller
const controllers = require('./controllers');
app.use(controllers);

// Load Models
const models = require('./models');
models.sequelize.sync({force: false})
  .then(() => {
    app.listen(PORT);
  });
