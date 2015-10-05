

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
	 					Contests.update({hello: "hello"}, {modified: "modified yo!"} );


		 		Contests.insert({ entry1 : site1, entry2: site2, userId: currentUserId, imageLink: imagesURL} );
		 
	 				}
	 			});
	 				
	 		
	 	}); // close each file

	 }}); //close addcontest.events

	 
 Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
 });
 
 
 }// close server code conditional
 
 
Router.route('/addcontest');
Router.route('/mycontests');

Router.route('/', function () { this.render('contests') ; });



