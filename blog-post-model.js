let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let roberto-blog-post = mongoose.Schema({	
	title : { type : String },
	content : 		{ type : String },
	author : 		{ type : String },
	publishDate : 	{ type : Date },
	id : { 
			type : Number,
			required : true }
});

let Pet = mongoose.model( 'roberto-blog-post', petSchema );


let PetList = {
	get : function(){
		return Pet.find()
				.then( pets => {
					return pets;
				})
				.catch( error => {
					throw Error( error );
				});
	},
	post : function( newPet ){
		return Pet.create( newPet )
				.then( pet => {
					return pet;
				})
				.catch( error => {
					throw Error(error);
				});
	}
};

module.exports = { PetList };


