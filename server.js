let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let uuid = require('uuid');

let app = express();
let jsonParser = bodyParser.json();

app.use(express.static("public"));
app.use(morgan("dev"));

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

app.get( '/blog-posts', (req, res, next) =>{
	return res.status(200).json(list);
	console.log(list);
});


//http://localhost:8080/blog-post?author=val
app.get( '/blog-post', (req, res, next) =>{
	let author = req.query.author;	
	let postsA = [];
	console.log("Req auth", author);
	if(!author){
		return res.status(406).json({
			code : 406,
			message : "Missing Author param"
		});
	}
	for(let i = 0; i<list.length; i++){
		if (author == list[i].author){			
			postsA.push(list[i])
		}
	}
	if(postsA.length == 0){
		return res.status(404).json({
			code : 404,
			message : "Author not found"
		});
	}
	return res.status(200).json(postsA);
});


app.post("/blog-posts", jsonParser,(req, res) => {
    let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    let date = req.body.publishDate;

    if(!title || !content || !author || !date) {        
        return res.status(406).json({
        	code: 406,
        	message: "Missing field in body"
        });
    } else {
        let newPost = {
            id : uuid.v4(),
            title : title,
            content : content,
            author : author,
            publishDate : date
        };
        list.push(newPost);
        return res.status(201).json(newPost);
    }
});


app.delete( "/blog-posts/:id", (req,res) => {
	let id = req.params.id;
	let found = false;
	let index = -1;	
	for(let i = 0; i<list.length; i++){
		if (id == list[i].id){			
			found = true;
			index = i;
		}
	}
	if(!found){
		return res.status(404).json({
			code : 404,
			message : "Post Id not found"
		});
	}
	list.splice(index,1);
	return res.status(200).json({
		code : 200,
		message : "Post deleted"
	});
});

app.put("/blog-posts/:id", jsonParser,(req,res) =>{
	
    let paramId = req.params.id;
	let bodyId = req.body.id;
    let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    let date = req.body.publishDate;

    if(!req.body) {
        return res.status(406).json({
        	code: 406,
        	message: "Missing field in body"
        });
    }

    if(paramId != bodyId){
    	return res.status(409).json({
    		code: 409,
    		message: "Body and params Id do not match"    	
    	});
    }

    for(let i = 0; i<list.length; i++){
		if (paramId == list[i].id){			
			list[i].title 		= title ? title : list[i].title;
    		list[i].content 	= content ? content : list[i].content;
    		list[i].author 		= author ? author : list[i].author;
    		list[i].publishDate = date ? date : list[i].publishDate;

    		let updPost = list[i];
    		return res.status(202).json(updPost);
		}
	}
});

app.listen ('8080', () => {
	console.log("App running on localhost:8080");
});