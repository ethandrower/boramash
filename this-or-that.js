

Contests = new Mongo.Collection("Contests");
UserAccounts = new Mongo.Collection('Users');
UserVoted = new Mongo.Collection('UserVoted');
//ImageStore = new FS.Store.GridFS("images");
ImageStore = new FS.Store.FileSystem("images", {

// don't work **  ImageStore = new FS.Store.FileSystem("../../../public/images", {
	
//	ImageStore = new FS.Store.FileSystem("/User/user/testImages", {
});


Images = new FS.Collection("images", {

	filter: {
		maxSize: 1048576,
		allow: {
			contentTypes: ['image/*'],
			extensions: ['png', 'jpg']
		}
	},

	stores: [ImageStore]
	//stores: [new FS.Store.FileSystem("images2", {path: "~/public/images"})]


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


	FlashMessages.configure({
    autoHide: false,
    hideDelay: 5000,
    autoScroll: true
  });



 //Template.contests.helpers({ 
Template.contests.helpers({
	contests: function () { 
		console.log("in contests");
		return Contests.find({isActive: true}) ;
	}
	
});
  
 Template.mycontests.helpers({
	 myContests: function () {
		 var currentUserId = Meteor.userId();
		 console.log(currentUserId);
		 
		return Contests.find({userId: currentUserId}) ; 
		
	 }
	 
 });
 

Template.mycontests.events({
"click .userContestControlButton_Pause": function () {

	// logic for pausing here
	var doc = Contests.findOne({contestId: this.contestId});
	
	Contests.update(this.contestId, {$set: {isActive: !doc.isActive}}, {upsert: true});

},
"click .userContestControlButton_Delete": function () {

	// find ID of contest.
	//delete contest.

	Contests.remove(this.contestId);
	console.log("in remove clause");

}

});



 
 /* Template.allImages.helpers({

 	images: function() {
 		return Images.find();
 	}
 });  */

  
/*   Don't need
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
 
 //This function incrememnts our users 'total vote' count
var clickedUser = function() {
	var currentUserId = Meteor.userId();
	console.log("user id on click! " + currentUserId);

	UserVoted.update({_id: currentUserId}, {$inc: {votedCount: 1}}, {upsert: true});



};

	 Template.contest.events({ 
	 "click .vote1": function () {
	 	
	 	if (Session.get(this._id)  == 'voted')
	 	{
	 		FlashMessages.sendWarning("You already voted on this contest!");
	 	}
	 	else {
	 	clickedUser();

	 	Session.set(this._id, 'voted')

		 
	 Contests.update(this._id, {
		 $inc: {vote1_count: 1}   
		});
	}
	 
	 },
		"click .vote2": function () {

			if (Session.get(this._id) == 'voted')
			{
				FlashMessages.sendWarning("You already voted on this contest!");
			}
			else {
		 	clickedUser();
		 	Session.set(this._id, 'voted')
			Contests.update(this._id, {
			$inc: {vote2_count: 1}   
			});
	//		Users.update( Meteor.userId {
	//			$push {votedOn: this._id} );

	 		}//end else

			} //end click .vote func
		});
	

/////Test method  ////////////

var userCanCreateContest = function() {
	
	var currentUserId = Meteor.userId();
	var numOfVotesRow = UserVoted.find({_id: currentUserId}).fetch();
	console.log("num votes row returned" + numOfVotesRow);
	console.log(JSON.stringify(numOfVotesRow, null, 2));
	//var votes = numOfVotesRow["votedCount"]; nope
	//var votes = numOfVotesRow.votedCount; nope

	var votesParsed = JSON.parse(JSON.stringify(numOfVotesRow));
	console.log(votesParsed);

	//var vots = votesParsed.votedCount;
	try {
	var votes = votesParsed[0].votedCount;
}
catch (err)
{ console.log(err);
	var votes = 0;
	
}

	console.log("votes value: " + votes);
	if (votes >= 5)
	{
		return true;
	}
	//else return false;
	return true;


};
 Template.addcontest.events({
	 	"submit form" : function(event, template){
	 	if (!userCanCreateContest())
	 	{
	 		FlashMessages.sendWarning("Contest Could not be added, you must vote in 5 contests before creating your own!", {autoHide: false});
	 		return false;
	 	}



	 		 event.preventDefault(); 
	 		var firstImage = true;
	 		var contestId = Random.id(5);
	 		
	 		var curUser = Meteor.userId();
	 		console.log("in func");
	 		
	 		console.log(event);

	 		var subContestName = event.target.contestName.value;
	 		var subContestDescrip = event.target.descrip.value;

	 		console.log("contestdescrip  is : " + subContestDescrip );

	 		var currentUserId = Meteor.user().username;

	 		//console.log(userId);


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


			var errorOccurred = false; 

				for (x=0; x < file.length; x++)
			{
				console.log("x = " + x);

	 			Images.insert(file[x].files[0], function (err, fileObj) {
	 				if (err){
	 					console.log("error on file upload! " + err);
	 					FlashMessages.sendError("Error on upload: Image #"+ (x+1));
	 					errorOccurred = true;

	 					//handle file upload error here
	 				}
	 				else {
	 					//file upload was a success!!
	 					console.log("upload successful? ");

	 				if(firstImage)
	 				{
	 					var event1 = event.target.event1.value;
						//var imagesURL = { "sotredimage": "/cfs/files/images/" + fileObj._id};
						var imagesURL = fileObj._id;
						console.log("updating image1");

						Contests.update(contestId, {$set: { entry1: imagesURL, contestId: contestId, contestName: subContestName, contestDescription: subContestDescrip, userId: curUser, isActive: true, userName: currentUserId}}, {upsert: true}  );
	 					firstImage = false;
	 				}

	 				else
	 				{
	 					console.log("in else clause so second image");
	 					var event2 = event.target.event1.value;
						// old cfs var imagesURL = { "sotredimage": "/cfs/files/images/" + fileObj._id};
						//var imagesURL = { "sotredimage": "public/images" + fileObj._id};
						var imagesURL = fileObj._id;
	 					Contests.update(contestId, {$set:  { entry2: imagesURL, contestId: contestId, userId: curUser, isActive: true, userName: currentUserId} }, {upsert: true});

	

	 				} //end else block
	 			// end for loop		

		 		//Contests.insert({ entry1 : site1, entry2: site2, userId: currentUserId, imageLink: imagesURL} );
		 
	 				}
	 			});// end insert function
			}//end for loop
	 				
	 		
	 	 //});
		if(!errorOccurred)
		{
	 	FlashMessages.sendWarning("Contest Added!");
	 }
	 else { FlashMessages.sendWarning("An error has occured uploading one or both images, please double check your files or your contest may not display properly.")}

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



