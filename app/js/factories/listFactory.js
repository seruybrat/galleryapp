angular.module('app').factory('listFactory', function() {
	var service = {};

	var lists = [
		{
			id: 1,
			listName: 'slide1'
		},
		{
			id: 2,
			listName: 'slide2'
		},
		{
			id: 3,
			listName: 'slide3'
		}
	];

	service.getLists = function() {
		return lists;
	};

	service.addList = function(listName) {
		// lists.push({
		// 	id: _.uniqueId('list'), //lodash func
		// 	listName: listName
		// });
		var fd = new FormData();
	    //Take the first selected file
	    fd.append("file", files[0]);
	    console.log(fd);
	};



	return service;
})