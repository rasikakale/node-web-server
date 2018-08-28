const express = require('express');
const hbs = require('hbs');

const fs = require('fs');

var app = express();

//takes dir to use for hbs partial files, and specifying dir as first and only one arg
// partial - something to reuse in websites
hbs.registerPartials(__dirname + '/views/partials');

/*
.set() - sets various express related configurations
- takes key, value pair
*/
app.set('view engine', 'hbs');



/*
(express) middleware - configures how express app works 
    - use middleware to respond to request
    - executed in the order u cann app.use()
.use() - takes middleware function to use (off of express object) (also registers middleware)
*/
//app.use(express.static(__dirname + '/public'));  // takes absolute path to folder to serve up

//next exists to tell when middleware function is done
// handlers never fire if next isn't called at end
app.use((req, res, next) => {
    var now = new Date().toString(); //creates formatted date
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);

    //add on to a file, takes three args: file name to make, thing to add, and callback funtion
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to append to server.log.');
        }
    }); 
    next();
});

//sets up middleware to stop everything after this code to not be executed
/*
app.use((req, res, next) => {
    res.render('maintenance.hbs');
});
*/
//moved here because when placed first, maintenance.hbs middleware doesn't get chance to execute
app.use(express.static(__dirname + '/public'));


//takes name of helper, and function to run
hbs.registerHelper('getCurrentYear', () => {
    return 'test';
    //return new Date().getFullYear()
});


hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();  //makes text uppercase
})

/*
set up handler for HTTP get request
two args in .get(): /url, function to run (what to send back to person who made request)
    - '/' by itself is the main root
*/
app.get('/', (req, res) => {

    /*
    - (request)req has info about request coming in
    - (response)res has lots of methods available to user to respond to HTTP request
    - res.send('<h1>Hello Express!</h1>'); //.send() responds to request sending some data back
    */
   res.send( {
       name: 'Rasika',
       likes: [
           'BTS',
           'Traveling'
       ]
   });

});

app.get('/home', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Welcome Page',
        welcomeMessage: 'Welcome to this page!'
       // currentYear: new Date().getFullYear()
    });
});

app.get('/about', (req, res) => {
    //res.send('About page');

    /*
     - .render() lets user render any temples set up
     - adds extra arg for what to render in hbs file
    */
    res.render('about.hbs', {
        pageTitle: 'About page'
        // currentYear: new Date().getFullYear()
    
    });    
});

// Sending JSON to localhost:3000
app.get('/bad', (req, res) => {
    res.send( {
        errorMessage: 'Unable to handle request'
    });
});



//.listen() binds application to port on machine (shows up on web server)
// takes opt second argument to do something if server takes a while
app.listen(3000, () => {
    console.log('Server is up on port 3000.');
});