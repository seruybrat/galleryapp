(function() {

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDNWT7JhPXEMha3uCG7C7OPtUfDOdOTODY",
    authDomain: "photogallery-c5f4c.firebaseapp.com",
    databaseURL: "https://photogallery-c5f4c.firebaseio.com",
    projectId: "photogallery-c5f4c",
    storageBucket: "photogallery-c5f4c.appspot.com",
    messagingSenderId: "52787665772"
};

firebase.initializeApp(config);

var app = angular.module('app', ['ngRoute', 'ngFileUpload', 'firebase']);

app.config(function ($routeProvider) {
    $routeProvider
    .when('/', {templateUrl: 'partials/slider.html'})
    .when('/manage', {templateUrl: 'partials/manage.html'})
    .when('/gallery', {templateUrl: 'partials/gallery.html', controller: 'GalleryCtrl'})
});

app.controller('MainCtrl', ['$scope', '$firebaseStorage', '$firebaseArray', function($scope, $firebaseStorage, $firebaseArray){

    var uploader = document.getElementById('uploader');
    $scope.tags = {};
    $scope.displayMsg = true;
    $scope.msg = "No File selected. PLease select a file to upload.";

    $scope.selectFile = function(file) {
        $scope.fileList = file;
        $scope.displayMsg = false;
    };

    //remove file from fileList
    $scope.removeFile = function(file) {
        var index = $scope.fileList.indexOf(file);
        $scope.fileList.splice(index, 1);
        if($scope.fileList.length < 1) {
            $scope.displayMsg = true;
        }
    }

    $scope.uploadFile = function(file) {
        var file = file;
        var tags = $scope.tags.name;
        if(tags == undefined) {
            tags = null;
        }

        //create a firebase storage reference
        var storageRef = firebase.storage().ref('Photos/' + file.name);
        var storage = $firebaseStorage(storageRef);

        //Upload file
        var uploadTask = storage.$put(file);

        //update Progress bar
        uploadTask.$progress(function(snapshot) {
            var percentageUpload = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            $scope.percentage = percentageUpload.toFixed(0);
            console.log($scope.percentage)
            uploader.style.width = $scope.percentage + '%';
        })

        // Upload Completion
        uploadTask.$complete(function(snapshot){
            //remove fileList when uploading complete
            $scope.removeFile(file);
            $scope.msg = "Photo uploaded Successdully. Select another image to upload"

            var imageUrl = snapshot.downloadURL;
            var imageName = snapshot.metadata.name;

            //store image URL and details into firebase database
            var ref = firebase.database().ref("Images");
            var urls = $firebaseArray(ref);
            //add data to firebase
            urls.$add({
                imageUrl: imageUrl,
                imageName: imageName,
                tags: tags
            }).then(function(ref) {
                var id = ref.key;
                console.log("imadd"+ id);
                urls.$indexFor(id);
            });

            //Error while uploading
            uploadTask.$error(function(error){
                console.log(error);
            });
        });
    };

}]);

app.controller('GalleryCtrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray){
    //create firebase database ref
    var ref = firebase.database().ref('Images');
    var urls = $firebaseArray(ref);
    $scope.urls = urls;
}]);

app.controller('ManageCtrl', ['$scope', '$firebaseArray', '$firebaseStorage', function($scope, $firebaseArray, $firebaseStorage){
    //create firebase database ref
    var ref = firebase.database().ref('Images');
    var urls = $firebaseArray(ref);
    $scope.urls = urls;

    $scope.deleteFile = function(url) {
        //get storage reference
        console.log(url)
        var storageRef = firebase.storage().ref('Photos/' + url.imageName);
        var storage = $firebaseStorage(storageRef);
        //del file
        storage.$delete().then(function() {
            $scope.urls.$remove(url);//remove data from database
            console.log("deleted");
        }).catch(function(error){
            console.log(error.message);
        });
    };
}]);


// (function() {

// var Upload = function (file) {
//     this.file = file;
// };

// Upload.prototype.getType = function() {
//     return this.file.type;
// };
// Upload.prototype.getSize = function() {
//     return this.file.size;
// };
// Upload.prototype.getName = function() {
//     return this.file.name;
// };
// Upload.prototype.doUpload = function () {
//     var that = this;
//     var formData = new FormData();

//     // add assoc key values, this will be posts values
//     formData.append("file", this.file, this.getName());
//     formData.append("upload_file", true);

//     $.ajax({
//         type: "POST",
//         url: "script",
//         xhr: function () {
//             var myXhr = $.ajaxSettings.xhr();
//             if (myXhr.upload) {
//                 myXhr.upload.addEventListener('progress', that.progressHandling, false);
//             }
//             return myXhr;
//         },
//         success: function (data) {
//             // your callback here
//         },
//         error: function (error) {
//             // handle error
//         },
//         async: true,
//         data: formData,
//         cache: false,
//         contentType: false,
//         processData: false,
//         timeout: 60000
//     });
// };

// Upload.prototype.progressHandling = function (event) {
//     var percent = 0;
//     var position = event.loaded || event.position;
//     var total = event.total;
//     var progress_bar_id = "#progress-wrp";
//     if (event.lengthComputable) {
//         percent = Math.ceil(position / total * 100);
//     }
//     // update progressbars classes so it fits your code
//     $(progress_bar_id + " .progress-bar").css("width", +percent + "%");
//     $(progress_bar_id + " .status").text(percent + "%");
// };

// //Change id to your id
// $("#ingredient_file").on("change", function (e) {
//     var file = $(this)[0].files[0];
//     var upload = new Upload(file);

//     // maby check size or type here with upload.getSize() and upload.getType()

//     // execute upload
//     upload.doUpload();
// });

})();