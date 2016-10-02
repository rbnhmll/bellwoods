var InvitesController = Paloma.controller('Invites');

// geofence polygon array
var geofenceCoords = {
  paths: [
    {lat: 43.649849, lng: -79.418321},
    {lat: 43.650074, lng: -79.417209},
    {lat: 43.650088, lng: -79.417095},
    {lat: 43.650318, lng: -79.415974},
    {lat: 43.650154, lng: -79.415897},
    {lat: 43.650043, lng: -79.41586},
    {lat: 43.64988, lng: -79.415794},
    {lat: 43.649801, lng: -79.415735},
    {lat: 43.650139, lng: -79.413911},
    {lat: 43.649912, lng: -79.413827},
    {lat: 43.649967, lng: -79.413541},
    {lat: 43.650026, lng: -79.413261},
    {lat: 43.65004, lng: -79.413195},
    {lat: 43.64567, lng: -79.411446},
    {lat: 43.645109, lng: -79.414183},
    {lat: 43.645537, lng: -79.414391},
    {lat: 43.645345, lng: -79.415215},
    {lat: 43.647288, lng: -79.415982},
    {lat: 43.647389, lng: -79.415507},
    {lat: 43.648967, lng: -79.416147},
    {lat: 43.649005, lng: -79.416239},
    {lat: 43.64901, lng: -79.416293},
    {lat: 43.648944, lng: -79.416647},
    {lat: 43.649025, lng: -79.416683},
    {lat: 43.649123, lng: -79.417055},
    {lat: 43.649143, lng: -79.417167},
    {lat: 43.648994, lng: -79.417893},
    {lat: 43.649482, lng: -79.418095},
    {lat: 43.649536, lng: -79.418178}
  ]
};

var polygons_options = {
      strokeColor: '#000000',
      strokeOpacity: 0.5,
      strokeWeight: 3,
      fillColor: '#43A54F',
      fillOpacity: 0.35
    }

InvitesController.prototype.new = function(){
   var handler = Gmaps.build('Google', { builders: { Marker: CustomMarkerBuilder} }); 
   var avatar_url = this.params.avatar;

   handler.buildMap({ 
     provider: { 
       zoom: 18, 
       disableDefaultUI: false, 
       scrollwheel: false,
       draggable: false
     }, 
     internal: {
       id: 'map'
     } 
   }, function(){
     if(navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(displayOnMap);
     }
   });

   // Geofence Experiment START
   // ================
      var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.647720, lng: -79.414208},
        zoom: 16,
      });

      var bermudaTriangle = new google.maps.Polygon(geofenceCoords);

      google.maps.event.addListener(map, 'click', function(e) {
        var resultColor =
            google.maps.geometry.poly.containsLocation(e.latLng, bermudaTriangle) ?
            'red' :
            'green';

        new google.maps.Marker({
          position: e.latLng,
          map: map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: resultColor,
            fillOpacity: .2,
            strokeColor: 'white',
            strokeWeight: .5,
            scale: 10
          }
        });
      });
   // Experiment END
   // ================

   // Build polygon
   handler.addPolygons(geofenceCoords, polygons_options);


   function displayOnMap(position){

     var marker = handler.addMarker({
       lat: position.coords.latitude,
       lng: position.coords.longitude,
       custom_marker: "<img class='marker_img' src='" + avatar_url + "'>"
     });

     // Pass location to hidden fields
     var set_location = function() {
       $('.user_latitude').val(position.coords.latitude);
       $('.user_longitude').val(position.coords.longitude);
     };

     handler.map.centerOn(marker);
     set_location();
   };
  };

InvitesController.prototype.show = function(){
	var user_invite_data = $('.location_information').data('invite');
	var sender_lat = user_invite_data.latitude;
	var sender_lng = user_invite_data.longitude;
	var avatar_url = this.params.avatar;

	var handler = Gmaps.build('Google', { builders: { Marker: CustomMarkerBuilder} }); 

	handler.buildMap({ 
	 provider: { 
	   zoom: 18, 
	   disableDefaultUI: true, 
	   scrollwheel: false,
	   draggable: false
	 }, 
	 internal: {
	   id: 'map'
	 } 
	}, function(){

	 var marker = handler.addMarker({
	   lat: sender_lat,
	   lng: sender_lng,
	   custom_marker: "<img class='marker_img' src='" + avatar_url + "'>"
	 });

	 handler.map.centerOn(marker);
	});

  // Build polygon
  handler.addPolygons(geofenceCoords, polygons_options);
};