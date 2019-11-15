let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let blogSchema = mongoose.Schema({	
	title : { type : String },
	content : { type : String },
	author : { type : String },
	publishDate : { type : Date },
	id : { 
			type : String,
			required : true }
});

let blogPost = mongoose.model( 'blogPost', blogSchema );


let PostList = {
	get : function(){
		return blogPost.find()
				.then( posts => {
					return posts;
				})
				.catch( error => {
					throw Error( error );
				});
	},
	post : function( newPost ){
		return blogPost.create( newPost )
				.then( post => {
					return post;
				})
				.catch( error => {
					throw Error(error);
				});
	}
};

module.exports = { PostList };
