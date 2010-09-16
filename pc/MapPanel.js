Ext.ns('TwiMap', 'TwiMap.pc');

TwiMap.pc.MapPanel = Ext.extend(Ext.Panel,{
  centerloc: {
    lat: 0.0,
    lng: 0.0,
    zoom: 0
  },

  initComponent: function(){
    this.initLocation();

    Ext.apply(this, {
      layout: 'fit',
      tbar: this.buildTbar(),
      items: [ this.buildMap() ]
    });

    TwiMap.pc.MapPanel.superclass.initComponent.call(this);
  },

  buildTbar: function(){
    return {
      xtype: 'twimappcmappaneltoolbar'
    }
  },

  buildMap: function(){
    return {
      xtype: 'container',
      ref: 'map'
    }
  },

  initLocation: function(){
    var args = {};
    var url = document.location.search;
    if(url && url.length>0){
      if(url.substring(0,1) == '?') url = url.substring(1);
      args = Ext.urlDecode(url);
  
      if(Ext.isDefined(args.lat) && Ext.isDefined(args.lng)){
        var lat = parseFloat(args.lat);
        var lng = parseFloat(args.lng);
  
        if(lat>90 || lat < -90 || lng > 180 || lng < -180){
          delete args.lat;
          delete args.lng;
        }else{
          args.lat = lat;
          args.lng = lng;
        }
      }
  
      if(Ext.isDefined(args.zoom)){
        var zoom = parseInt(args.zoom);  
        if(zoom < 0 && zoom > 18){
          delete args.zoom;
        }else{
          args.zoom = zoom;
        }
      }
    }

    Ext.apply(this.centerloc, args);
  },

  initEvents: function(){
    TwiMap.pc.MapPanel.superclass.initEvents.call(this);

    this.map.on({
      render: function(t){
        var loc = this.centerloc;
        var map = new google.maps.Map(t.el.dom, {
          center: new google.maps.LatLng(loc.lat,loc.lng),
          zoom: loc.zoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        t.map = map;
        this.addCenterMarker();
        this.updateUrlField(this.buildUrl());
      },
      scope: this
    });

    this.getTopToolbar().on({
      geocode: this.onGeocode,
      scope: this
    });
  },

  updateUrlField: function(val){
    this.getTopToolbar().updateUrlField(val);
  },

  getZoom: function(){
    return this.map.map.getZoom();  
  },

  onGeocode: function(f,nv,ov){
    if(!nv || nv.length == 0 || nv == ov) return;
    if(!this.geocoder){ this.geocoder = new google.maps.Geocoder(); }

    var g = this.geocoder;
    var me = this;
    g.geocode({ address: nv },function(res,st){
      if(st == google.maps.GeocoderStatus.OK){
        var map = me.map.map;
        map.fitBounds(res[0].geometry.viewport);

        me.addCenterMarker();
      }else{
        alert(nv + ' not found');
      }
    });
  },

  addCenterMarker: function(){
    var me = this;
    var map = this.map.map;
    if(!this.marker){
      this.marker = new google.maps.Marker({
        clickable: false,
        draggable: false,
        map: map,
        position: map.getCenter()
      });

      var marker = this.marker;
      marker.setDraggable(true);
      marker.setClickable(true);

      google.maps.event.addListener(marker, 'position_changed', function(){
        var url = me.buildUrl.call(me);
        me.updateUrlField(url);  
      });
    }else{
      this.marker.setPosition(map.getCenter());
    }
  },

  buildUrl: function(mrk){
    mrk = mrk || this.marker;
    var map = this.map.map;

    var c = mrk.getPosition();
    var lat = c.lat();
    var lng = c.lng();
    var zoom = map.getZoom();

//    var url = document.location.href;
    var url = "http://twimap.net/"
    url += '?' + Ext.urlEncode({
      lat: lat,
      lng: lng,
      zoom: zoom
    });

    return url;
  }
});

Ext.reg('twimappcmappanel', TwiMap.pc.MapPanel);
