

Contests = new Mongo.Collection("Contests");
UserAccounts = new Mongo.Collection('Users');
UserVoted = new Mongo.Collection('UserVoted');

ImageStore = new FS.Store.FileSystem("images", {


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



 
 

 
 //This function incrememnts our users 'total vote' count
var clickedUser = function() {
	var currentUserId = Meteor.userId();
	console.log("user id on click! " + currentUserId);

	UserVoted.update({_id: currentUserId}, {$inc: {votedCount: 1}}, {upsert: true});



};

//event to handle clicks when a user votes on a contest
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
	

	 		}//end else

			} //end click .vote func
		});
	


//The func is called on addContest Submit, determines if user has voted enough times to be able to create contest
var userCanCreateContest = function() {
	
	var currentUserId = Meteor.userId();
	var numOfVotesRow = UserVoted.find({_id: currentUserId}).fetch();
	console.log("num votes row returned" + numOfVotesRow);
	console.log(JSON.stringify(numOfVotesRow, null, 2));
	
	var votesParsed = JSON.parse(JSON.stringify(numOfVotesRow));
	console.log(votesParsed);

	
	try {
	var votes = votesParsed[0].votedCount;
}
catch (err) //If user has not voted yet, will throw exception, so just set that user's # of voted contests to 0
{ console.log(err);
	var votes = 0;
	
}

	console.log("votes value: " + votes);
	if (votes >= 5)
	{
		return true;
	}
	//else return false;   this will always return true for now, just for testing purposes
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
	 		
	 		
	 	

	 		var subContestName = event.target.contestName.value;
	 		var subContestDescrip = event.target.descrip.value;

	 		

	 		var currentUserId = Meteor.user().username;

	 		

	 		 var file = template.findAll('input:file');


			var errorOccurred = false; 


			//Loop through each submitted file and try to upload it

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
	 					

	 				if(firstImage)
	 				{
	 					var event1 = event.target.event1.value;
						
						var imagesURL = fileObj._id;
						console.log("updating image1");

						Contests.update(contestId, {$set: { entry1: imagesURL, contestId: contestId, contestName: subContestName, contestDescription: subContestDescrip, userId: curUser, isActive: true, userName: currentUserId}}, {upsert: true}  );
	 					firstImage = false;
	 				}

	 				else
	 				{
	 					console.log("in else clause so second image");
	 					var event2 = event.target.event1.value;
						
						var imagesURL = fileObj._id;
	 					Contests.update(contestId, {$set:  { entry2: imagesURL, contestId: contestId, userId: curUser, isActive: true, userName: currentUserId} }, {upsert: true});

	

	 				} //end else block
	 			// end for loop		

		 	
		 
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






	 
 Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
 });
 
 
 }// close server code conditional
 
 
Router.route('/addcontest');
Router.route('/mycontests');

Router.route('/', function () { this.render('contests') ; });



