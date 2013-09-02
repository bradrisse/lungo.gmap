/**
 * GMap Manager
 *
 * @namespace Lungo.Sugar
 * @class GMap
 * @version 1.0
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */

Lungo.Sugar.GMap = (function(lng, undefined) {

    var DEFAULT_OPTIONS_GMAPS_STATIC = {
        sensor: false,
        mobile: true
    };
    var GMAPS_STATIC_URL = 'http://maps.google.com/maps/api/staticmap?';
    var GMAPS_API_KEY = '&key=ENTER KEY HERE';
    var _instance = null;
    var _instance_markers = [];
    var _instance_infoWindows = [];

    /**
     *
     */
    var init = function(options) {
        var element = lng.dom(options.el);

        if (element.length > 0) {
            _instance = this.Interface.Map(element[0], options);
        } else {
            console.error('Imposible');
        }
    };

    /**
     *
     */
    var instance = function() {
        return _instance;
    };

    /**
     *
     */
     var clean = function() {
        _cleanMarkers();
        if(this.Route !== undefined) this.Route.clean();
    };

    /**
     *
     */
    var center = function(position) {
        _instance.setCenter(this.Interface.LatLng(position));
    };

    /**
     *
     */
    var zoom = function(level) {
        _instance.setZoom(level);
    };

    /**
     *
     */
    var addMarker = function(position, icon, animate, content) {
     var infobox;
        if (position) {
            var marker = new google.maps.Marker({
                map: _instance,
                icon: this.Interface.MarkerIcon(icon),
                animation: google.maps.Animation.DROP,
                position: this.Interface.LatLng(position)
            });
            
            if (animate) {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
            
            _instance_markers.push(marker);
            
            //option to use info window instead of info-box
            //var infowindow = new google.maps.InfoWindow({maxWidth: 280});
            
            infobox = new InfoBox({
				content: content,
				disableAutoPan: false,
				maxWidth: 280,
				pixelOffset: new google.maps.Size(-140, 0),
				zIndex: null,
				boxClass: 'infoBox',
				boxStyle: {background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat"},
				closeBoxMargin: "12px 4px 2px 2px",
				closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
				infoBoxClearance: new google.maps.Size(1, 1)
			});
    
			if(content) {	
				google.maps.event.addListener(marker, 'click', function() {
				
					//option to use info window instead of info-box
					//resetInfoWindow()
					//infowindow.setContent(content);
					//infowindow.open(_instance,marker);
					
					$('.infoBox').css('visibility', 'hidden');
					infobox.open(_instance, this);
				});
				 _instance_infoWindows.push(infowindow);
			}
            
        }

        return marker;
    };
    
    /**
     *
     */
    var getMarkers = function() {
		return _instance_markers;
	};
    
     /**
     *
     */
	var mapfit = function() {

		var map = _instance;
		
		var center = map.getCenter();
		map.fitBounds(lng.Sugar.GMap.Interface.bounds);
		map.panToBounds(lng.Sugar.GMap.Interface.bounds);
			
		zoomChangeBoundsListener = 
			google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
				if (this.getZoom()){
					this.setCenter(new google.maps.LatLng(center.coords.latitude, center.coords.longitude));
					this.setZoom(13);
					
				}
			});
				
		setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 2000);
	};

    /**
     *
     */
    var image = function(options) {
        var element = lng.dom(options.el);

        if (element.length > 0) {
            var options = lng.Core.mix(DEFAULT_OPTIONS_GMAPS_STATIC, options);

            var environment = $$.environment();
            options.size = environment.screen.width + 'x' + environment.screen.height;

            options.center = options.center.latitude + ',' + options.center.longitude;
            options.markers = options.center;
            delete options.el;
			
			//TODO add if statement for KEY
            var url = GMAPS_STATIC_URL + $$.serializeParameters(options) + GMAPS_API_KEY;
            element.html('<img src="' + url + '"/>');
        }
    };

    var _cleanMarkers = function() {
        for (var i = 0, len = _instance_markers.length; i < len; i++) {
            _instance_markers[i].setMap(null);
        }
        _instance_markers = [];
    };
    
    var resetInfoWindow = function(){
    if( _instance_infoWindows){
        for(i in _instance_infoWindows){
            _instance_infoWindows[i].close();
        }
    }
	};

    return {
        init: init,
    	mapfit: mapfit,
        image: image,
        instance: instance,
        clean: clean,
        center: center,
        zoom: zoom,
        getMarkers : getMarkers,
        addMarker: addMarker
    }

})(Lungo);
