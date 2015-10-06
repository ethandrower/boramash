Template.addcontest.helpers({
  callBack: function() {
    return {
      finished: function(index, fileInfo, context) {
        console.log(fileInfo.url);
      }
    }
  }
});