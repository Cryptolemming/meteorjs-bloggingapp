Posts = new Mongo.Collection('posts');

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    // Retrieve all the posts
    posts: function() {
      return Posts.find({}, {sort: {createdAt: -1}});
    }
  });

  // Handle the post events
  Template.body.events({
    'submit .new-post': function (e) {

      e.preventDefault();

      var title = e.target.title.value;
      var description = e.target.description.value;

      var newPost = {
        title: title,
        description: description,
      }
 
      // Insert a task into the collection
      Meteor.call('addPost', newPost)
 
      // Clear form
      e.target.title.value = '';
      e.target.description.value = '';
    }
  });

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });
}

Meteor.methods({
  addPost: function (newPost) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Posts.insert({
      title: newPost.title,
      description: newPost.description,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  }
});
