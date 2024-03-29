let express = require('express');
let morgan = require('morgan');
let bp = require('body-parser');
let jsonParser = bp.json();
let uuid = require("uuid");

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let {PostList} = require('./blog-post-model');

let {DATABASE_URL, PORT} = require('./config');

let app = express();

app.use(express.static('public'));
app.use(morgan('dev'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

let list = [
    {
        id: uuid.v4(),
        title: "How to stop a train",
        content: "Steps to stop a train. To stop a train in time, two possibilities exist: a manual stop by the driver, and an automatic stop. The driver will estimate the moment to start braking, using track signals and his own knowledge of the train and the line. During an automatic stop, measuring instruments, placed on the trains and on the tracks (wheel sensors, radars, odometer, beacon system, shock absorbers), record the speed, position and mass (degree of compression) of the train. Based on this data, the train can automatically evaluate when to begin braking.",
        author: "Train",
        publishDate: new Date ("October 21, 2000 13:13:13")
    },
    {
        id: uuid.v4(),
        title: "Title for blog post",
        content: "Content of blog post. The content of your new blog will be the bait that attracts your readers. In this guide, we will cover what content you need to write when you start a blog and the best practices you should follow.",
        author: "Blogger",
        publishDate: new Date ("January 11, 1999 23:44:00")
    },
    {
        id: uuid.v4(),
        title: "Best books of 2019",
        content: "These are my favorite books of this year. According to Goodreads handy stats, I read 16,747 pages across those 60 books, putting my average page count around 279 per book. The shortest book I read was Animal Farm— believe it or not, not a re-read! And the longest book I read was Americanah, which I think might have been my first book of 2018. I know I got it for Christmas and I think I read most of it on New Years Day.",
        author: "Reviewer",
        publishDate: new Date ("December 31, 2019 23:59:00")
    },
    {
        id: uuid.v4(),
        title: "Best movies of 1900's",
        content: "These are my favorite movies of this century: e are now approximately one-sixth of the way through the 21st century, and thousands of movies have already been released. Which means that it’s high time for the sorting – and the fighting – to start. As the chief film critics of The Times, we decided to rank, with some help from cinema savants on Facebook, the top 25 movies that are destined to be the classics of the future. While we’re sure almost everyone will agree with our choices, we’re equally sure that those of you who don’t will let us know.",
        author: "Reviewer",
        publishDate: new Date ("December 25, 1999 22:55:00")
    }
];

app.get( "/blog-posts", ( req, res, next ) => {
    PostList.get()
        .then( posts => {
            return res.status( 200 ).json( posts );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrong with the DB. Try again later."
            })
        });
});

app.post("/blog-posts", jsonParser, (req, res, next) => {
    let newPost = {
        title: "", 
        content: "", 
        id: "", 
        publishDate: "", 
        author: ""
    };
    newPost.author = req.body.author;
    newPost.title = req.body.title;
    newPost.publishDate = req.body.publishDate;
    newPost.content = req.body.content;
    newPost.id = uuid.v4();

    if (!newPost.id || !newPost.title || !newPost.content || !newPost.publishDate || !newPost.author) {
        res.statusMessage = "Missing field in the body";
        return res.status(406).json( {
            message: "Missing field in the body",
            status: 406
        });
    }
  
    PostList.post(newPost)
        .then(post => {
            return res.status(201).json(post);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        });
});

app.delete("/blog-posts/:id", jsonParser, (req, res, next) => {
    PostList.delete(req.params.id)
        .then(post => {
            return res.status(201).json(post);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        });
});

app.put("/blog-posts/:id", jsonParser, (req, res, next) => {
    if (req.body.id) {
        if (req.body.id == req.params.id) {
            PostList.update(req.body)
                .then(post => {
                    return res.status(201).json(post);
                })
                .catch(err => {
                    res.statusMessage = "Something went wrong with the DB";
                    return res.status(500).json({
                        message: "Something went wrong with the DB",
                        status: 500
                    })
                });
        } else {
            res.statusMessage = "ID in param does not match with ID in body";
            return res.status(409).json({
                code: 409,
                message: res.statusMessage
            });
        }
    } else {
        res.statusMessage = "Missing ID in body";
        return res.status(406).json({
            code: 406,
            message: res.statusMessage
        });
    }

});

let server;


function runServer(port, databaseUrl){
    return new Promise( (resolve, reject ) => {
        mongoose.connect(databaseUrl, response => {
            if ( response ){
                return reject(response);
            }
            else{
                server = app.listen(port, () => {
                    console.log( "App is running on port " + port );
                    resolve();
                })
                .on( 'error', err => {
                    mongoose.disconnect();
                    return reject(err);
                })
            }
        });
    });
}

function closeServer(){
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log('Closing the server');
                server.close( err => {
                    if (err){
                        return reject(err);
                    }
                    else{
                        resolve();
                    }
                });
            });
        });
}

runServer( PORT, DATABASE_URL )
    .catch( err => {
        console.log( err );
    });

module.exports = { app, runServer, closeServer };