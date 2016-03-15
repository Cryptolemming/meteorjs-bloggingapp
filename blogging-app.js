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

  Template.post.helpers({
    editing: function() {
      return Session.equals('editPostId', this._id);
    }
  });

  Template.post.events({
    'click .edit': function () {
      Session.set('editPostId', this._id);
    },
    'click .delete': function () {
      Meteor.call('deletePost', this._id);
    },
    'click .cancel': function() {
      Session.set('editPostId', null);
    },
    'submit .edit-post': function(e) {

      console.log('editing');
      e.preventDefault();

      var title = e.target.editTitle.value;
      var description = e.target.editDescription.value;

      var updatedPost = {
        title: title,
        description: description,
      }

      Meteor.call('editPost', updatedPost, this._id)

      e.target.editTitle.value = '';
      e.target.editDescription.value = '';
      Session.set('editPostId', null);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });
}

Meteor.methods({
  addPost: function (newPost) {
    Posts.insert({
      title: newPost.title,
      description: newPost.description,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  editPost: function(updatedPost, postId) {
    var post = Posts.findOne(postId);
    if (post.username !== Meteor.user().username) {
      alert('You do not have permission to edit that post');
      throw new Meteor.Error('not-authorized');
    }
    Posts.update(postId, {$set: updatedPost});

  },
  deletePost: function (postId) {
    var post = Posts.findOne(postId);
    if (post.username !== Meteor.user().username) {
      alert('You do not have permission to delete that post');
      throw new Meteor.Error('not-authorized');
    }
    Posts.remove(postId);
  },
});
