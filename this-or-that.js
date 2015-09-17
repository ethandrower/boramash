

Contests = new Mongo.Collection("Contests");
UserAccounts = new Mongo.Collection('Users');


if (Meteor.isClient) {

  
Template.contests.helpers({
	contests: function () { 
		return Contests.find({}) ;}
	
});
  
 Template.mycontests.helpers({
	 myContests: function () {
		 var currentUserId = Meteor.userId();
		 console.log(currentUserId);
		 
		 return Contests.find({userId: currentUserId}) ; 
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
		}
	});
		
	 
 Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
 });
 
 
 }// close server code conditional
 
 
Router.route('/addcontest');
Router.route('/mycontests');

Router.route('/', function () { this.render('contests') ; });



