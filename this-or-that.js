

Contests = new Mongo.Collection("Contests");
UserAccounts = new Mongo.Collection('Users');

//ImageStore = new FS.Store.GridFS("images");
ImageStore = new FS.Store.FileSystem("images", {
	
});


Images = new FS.Collection("images", {

	stores: [ImageStore]


});
if (Meteor.isServer)
{

	Images.allow({
	 insert: function(){
	 return true;
	 },
	 update: function(){
	 return true;
	 },
	 remove: function(){
	 return true;
	 },
	 download: function(){
	 return true;
	 }
	});

}

if (Meteor.isClient) {

  
Template.contests.helpers({
	contests: function () { 
		return Contests.find({}) ;
	}
	
});
  
 Template.mycontests.helpers({
	 myContests: function () {
		 var currentUserId = Meteor.userId();
		 console.log(currentUserId);
		 
		return Contests.find({userId: currentUserId}) ; 
		
	 }
	 
 });
 
 Template.allImages.helpers({

 	images: function() {
 		return Images.find();
 	}
 });
  
/*
 Template.addcontest.events({
	 "submit" : function(event) {
		 event.preventDefault();
		 
		 
		 var currentUserId = Meteor.userId();
		 
		 var site1 = event.target.site1.value;
		 var site2 = event.target.site2.value;
		 
		 Contests.insert({ entry1 : site1, entry2: site2, userId: currentUserId} );
		 
		Router.go('/');
		
	 }
	 
 });
*/
 
	 Template.contest.events({ 
	 "click .vote1": function () {
		 
	 Contests.update(this._id, {
		 $inc: {vote1_count: 1}   
		});
	 
	 },
		"click .vote2": function () {
		 
			Contests.update(this._id, {
			$inc: {vote2_count: 1}   
			});
	//		Users.update( Meteor.userId {
	//			$push {votedOn: this._id} );

			}
		});
	

/////Test method  ////////////

 Template.addcontest.events({
	 	"submit form" : function(event, template){
	 		 event.preventDefault(); 
	 		var firstImage = true;
	 		//var contestId = Random.id(5);
	 		var contestId = '123';

	 		var curUser = Meteor.userId();
	 		console.log("in func");
	 		
	 		console.log(event);

	 		//var file = event.target.event1.file;  noo
	 		// var file = event.target.event1.data; no
	 		//var file = event.target.event1.value; no
	 		 var file = template.findAll('input:file');

	 		console.log(file);
	 		console.dir(file);

	 		//var fileObj = Images.insert(file);
	 		//console.log("file OBJ is " + fileObj);
	 		console.log("file is " + file);
	 		//var files = $('input[type=file]')[0].files;
	 		//var files = event.target.event1.files;


	 		//FS.Utility.eachFile(formFile.files, function(file) {

// working ///   	Images.insert(file.files[0], function (err, fileObj) {


				for (x=0; x < file.length; x++)
			{
				console.log("x = " + x);

	 			Images.insert(file[x].files[0], function (err, fileObj) {
	 				if (err){
	 					console.log("error on file upload! " + err);
	 					//handle file upload error here
	 				}
	 				else {
	 					//file upload was a success!!
	 					console.log("upload successful? ");

	 				if(firstImage)
	 				{
	 					var event1 = event.target.event1.value;
						var imagesURL = { "sotredimage": "/cfs/files/images/" + fileObj._id};
						console.log("updating image1");

						Contests.update(contestId, {$set: { entry1: imagesURL, contestId: contestId, userId: curUser}}, {upsert: true}  );
	 					firstImage = false;
	 				}

	 				else
	 				{
	 					console.log("in else clause so second image");
	 					var event2 = event.target.event1.value;
						var imagesURL = { "sotredimage": "/cfs/files/images/" + fileObj._id};
	 					Contests.update(contestId, {$set:  { entry2: imagesURL, contestId: contestId, userId: curUser} }, {upsert: true});
	 					
	 					
	 					var imagesURL = { "sotredimage": "/cfs/files/images/" + fileObj._id};
	 					//Contests.update({uploadedImage : imagesURL});
	 					//Cant do this, need to grab ids for the record we want.
	 					//Contests.update({hello: "hello"}, {modified: "modified yo!"} );
	 					//var event1 = event.target.event1.value;
	 					//var event2 = event.target.event2.value;
	 					//  insert worksContests.insert({myImage: imagesURL, userId: curUser});


	 				} //end else block
	 			// end for loop		
	 					
		 		//Contests.insert({ entry1 : site1, entry2: site2, userId: currentUserId, imageLink: imagesURL} );
		 
	 				}
	 			});// end insert function
			}//end for loop
	 				
	 		
	 	 //});
	 	console.log("out"); // close each file

	 }}); //close addcontest.events


//******* End of test method 

	/*	
	 Template.addcontest.events({
	 	'change .myFileInput': function(event, template){
	 		FS.Utility.eachFile(event, function(file) {
	 			Images.insert(file, function (err, fileObj) {
	 				if (err){
	 					console.log("error on file upload! "+ err);
	 					//handle file upload error here
	 				}
	 				else {
	 					//file upload was a success!!
	 				//	console.log("upload successful? ");
	 					var curUser = Meteor.userId();
	 					var imagesURL = { "sotredimage": "/cfs/files/images/" + fileObj._id};
	 					//Contests.update({uploadedImage : imagesURL});
	 					//Cant do this, need to grab ids for the record we want.
	 					//Contests.update({hello: "hello"}, {modified: "modified yo!"} );

	 					Contests.insert({myImage: imagesURL, userId: curUser});

		 		//Contests.insert({ entry1 : site1, entry2: site2, userId: currentUserId, imageLink: imagesURL} );
		 
	 				}
	 			});
	 				
	 		
	 	}); // close each file

	 }}); //close addcontest.events

		
	 Template.addcontest.events({
	 	'change .myFileInput2': function(event, template){
	 		FS.Utility.eachFile(event, function(file) {
	 			Images.insert(file, function (err, fileObj) {
	 				if (err){
	 					console.log("error on file upload! "+ err);
	 					//handle file upload error here
	 				}
	 				else {
	 					//file upload was a success!!
	 				//	console.log("upload successful? ");
	 					var curUser = Meteor.userId();
	 					var imagesURL = { "sotredimage": "/cfs/files/images/" + fileObj._id};
	 					//Contests.update({uploadedImage : imagesURL});
	 					//Cant do this, need to grab ids for the record we want.
	 					//Contests.update({hello: "hello"}, {modified: "modified yo!"} );


	 					Contests.insert({myImage: imagesURL, userId: curUser});

		 		//Contests.insert({ entry1 : site1, entry2: site2, userId: currentUserId, imageLink: imagesURL} );
	 				}
	 			});
	 				
	 		
	 	}); // close each file

	 }}); //close addcontest.events


*/


	 
 Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
 });
 
 
 }// close server code conditional
 
 
Router.route('/addcontest');
Router.route('/mycontests');

Router.route('/', function () { this.render('contests') ; });



