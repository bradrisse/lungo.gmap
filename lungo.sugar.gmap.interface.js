/**
 * GMap Manager
 *
 * @namespace Lungo.Sugar.Gmap
 * @class Interface
 * @version 1.0
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */

Lungo.Sugar.GMap.Interface = (function(lng, undefined) {

	var bounds = new google.maps.LatLngBounds();
	 
    var MAP_TYPES = {
        ROADMAP: 'roadmap',
        SATELLITE: 'satellite',
        HYBRID: 'hybrid',
        TERRAIN: 'terrain'
    };

	var OPTIONS = {
        zoom: 16,
        disableDefaultUI: true,
        mapTypeId: MAP_TYPES.ROADMAP
    };

	var Map = function(element, options) {
        if (options.type) options.mapTypeId = MAP_TYPES[options.type];
        if (options.center) options.center = new google.maps.LatLng(options.center.latitude, options.center.longitude);
        //return new google.maps.Map(element, lng.Core.mix(OPTIONS, options));
        return new google.maps.Map(element, {
        zoom: OPTIONS.zoom, center: options.center, mapTypeId: 'roadmap'
      });
        
    };

	var LatLng = function(position) {
		var thisplace = new google.maps.LatLng(position.latitude, position.longitude);
		if (thisplace !== 'undefined') {
		bounds.extend(thisplace);
		}
        return thisplace;
    };

    var MarkerIcon = function(icon) {
        if (icon) {
            var marker_icon = new google.maps.MarkerImage(
                icon.url,
                new google.maps.Size( icon.size.x, icon.size.y ),
                new google.maps.Point( 0, 0 ),
                new google.maps.Point( icon.anchor.x, icon.anchor.y )
            );
        }

        return marker_icon || null;
    };

    return {
    	bounds: bounds,
    	Map: Map,
    	LatLng: LatLng,
    	MarkerIcon: MarkerIcon
    }

})(Lungo);
