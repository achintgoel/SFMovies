var map = null;
var infowindow;
var geocoder;
var SF_LOCATION;
var SF_BOUNDS;
var FILMS_DATA;
var markers = [];

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    crossDomain: false, // obviates need for sameOrigin test
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

function mapInit() {
	  geocoder = new google.maps.Geocoder();
	  map = new google.maps.Map(document.getElementById('map-canvas'), {
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	  });
	  //Get location (lat, lng) of San Francisco, CA so as to center the Map on it
	  var address = 'San Francisco, CA'
	  geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            SF_LOCATION = results[0].geometry.location;
            SF_BOUNDS = results[0].geometry.bounds;
            map.fitBounds(SF_BOUNDS);
            map.setCenter(SF_LOCATION);

          } else {
            alert("Geocode was not successful for the following reason: " + status);
          }
      });

}
function onPlaceOnMap(place) {
    var contentHtml = '<div id="film_name">' +
					    '<p><strong>'+place.name+'</strong></p>' +
						'</div>';
	infowindow = new google.maps.InfoWindow({content:"holding..."});
    var marker = new google.maps.Marker({
	        map: map,
	        title: place.name,
	        position: place.geometry.location,
	        html: contentHtml
	      });

        //Event listener for when marker on map is clicked
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(this.html);
	  		infowindow.open(map,this);
		});

	markers.push(marker);

}

//Callback for when Search button is clicked
function onSearchFilm() {
    var film_title = jQuery("#film_title").val();
    var film_data = FILMS_DATA[film_title];

    service = new google.maps.places.PlacesService(map);

    //reposition the map in case user zoomed out
    map.fitBounds(SF_BOUNDS);
    map.setCenter(SF_LOCATION);

    //Delete all previous markers
    for (var i = 0, marker; marker = markers[i]; i++) {
	      marker.setMap(null);
	    }

	markers = [];



    for(var i = 0, data; data = film_data[i]; i++) {
        if(data.locations) {
            jQuery("#search_results_description").html('<p class="text-muted">Showing Results for <strong>'+film_title+'</strong></p>')
            var request = { bounds: SF_BOUNDS,
                            query: data.locations
                            };
            //Since location isnt an exact lat lng coordinates, call google services
            service.textSearch(request, function(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                  //Get the top result
                  var place = results[0];
                  onPlaceOnMap(place);
                }

            });
	    } else {
	        jQuery("#search_results_description").html('<p class="text-muted">No Location Data Exists for <strong>'+film_title+'</strong></p>')
	    }
    }
}

function searchInit() {
    // make request, process response
    var query = {};
	jQuery.get("/datasf/get_datasf_movies/", query,
		function(response){
		    //Cache Films Data received from Data SF
		    FILMS_DATA = response.films_data;
		    for (var i = 0, film_title; film_title = response.film_titles_list[i]; i++) {
		        //Add all film titles as options to datalist for autocompletion functionality
		    	jQuery("#film_titles").append('<option value="'+film_title+'">');
		    }
		}, "json");

		jQuery("#search").click(onSearchFilm);
}

function prepareDocument() {
    mapInit();
    searchInit();

}

$(window).resize(function () {
    var h = $(window).height(),
        offsetTop = 60; // Calculate the top offset

    jQuery("#map-canvas").css('height', (h));
    jQuery("#map-canvas").css('width', "100%");
}).resize();

jQuery(document).ready(prepareDocument);