Ext.ns("Ext.ux");

Ext.ux.MapPanel = Ext.extend(Ext.Panel,{
  itemIds: {
    geocodeform: 'geocodeform',
    map: 'map'
  },

  initComponent: function(){

    var rec = this.statusStore.getStatus();
    var opts = rec ? rec : { lat: 0, lng: 0, zoom: 0 };

    if(this.mapConfig) Ext.apply(opts, this.mapConfig);

    this.items = [this.buildMap(opts)];

    this.dockedItems = this.dockedItems || [];
    this.dockedItems.push(Ext.apply(this.buildGeocodeform(), {dock: 'top'}));

    Ext.ux.MapPanel.superclass.initComponent.call(this);

    this.map = this.getMap();
    this.tbar = this.getGeocodeform();

    this.trackMapStatus();

    // Set map to current location if available
    if(!rec) this.tbar.getCurrentLocation({
      zoom: 10
    });
  },

  initEvents: function(){
    Ext.ux.MapPanel.superclass.initEvents.call(this);

    this.tbar.on({
      geocode: this.onGeocode,
      beforecurrentlocation: this.maskAll,
      currentlocation: this.setCurrentLocation,
      scope: this
    });
  },

  buildMap: function(opts){
    return {
      xtype: 'map',
      itemId: this.itemIds.map,
      getLocation: false, 
      mapOptions: {
        mapTypeControl: false,
        center: new google.maps.LatLng(opts.lat, opts.lng),
        zoom: opts.zoom
      }
    }
  },

  buildGeocodeform: function(){
    return {
      xtype: 'geocodeform',
      itemId: this.itemIds.geocodeform
    }
  },

  getMap: function(){
    return this.getComponent(this.itemIds.map);
  },

  getGeocodeform: function(){
    return this.getDockedComponent(this.itemIds.geocodeform);
  },

  trackMapStatus: function(){
    var me = this;
    var map = this.map.map;

    if(!map){
      setTimeout(function(){
        me.trackMapStatus();
      },10);
      return;
    }

    google.maps.event.addListener(map, 'center_changed', saveStatus);
    google.maps.event.addListener(map, 'zoom_changed', saveStatus);

    me.addCenterMarker();

    function saveStatus(){
      var c = map.getCenter();
      var zoom = map.getZoom();
      me.statusStore.saveStatus({
        lat: c.lat(),
        lng: c.lng(),
        zoom: zoom
      });
    }
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
        me.historyStore.add(Ext.apply({
          query: nv
        },me.getCenterZoom()));
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
        clickable: true,
        draggable: true,
        map: map,
        position: map.getCenter()
      });

      this.infowindow = new Ext.ux.UrlPanel(); 

      var iw = this.infowindow;

      // code to avoid weired error in iOS
      iw.show();
      iw.hide();

      var marker = this.marker;

      google.maps.event.addListener(marker,'click',function(){
        var c = marker.getPosition();
        var lat = c.lat();
        var lng = c.lng();
        var zoom = map.getZoom();

//        var url = document.location.href;
        var url = "http://twimap.net/";
        url += '?' + Ext.urlEncode({
          lat: lat,
          lng: lng,
          zoom: zoom
        });
        iw.setUrl(url);
        iw.show();
      });
    }else{
      this.marker.setPosition(map.getCenter());
    }
  },

  setCurrentLocation: function(lat,lng, opt){
    if(lat !== false && lng !== false){
      this.setCenter(lat,lng);
      if(opt && opt.zoom) this.setZoom(opt.zoom);
    }else{
      alert("Current location not found");  
    }
    this.unmaskAll();
    return this;
  },

  setCenter: function(lat,lng){
    if(!this.map || !this.map.map) return;
    var map = this.map.map;
    map.setCenter(new google.maps.LatLng(lat,lng));
    this.addCenterMarker();
    return this;
  },

  setZoom: function(zoom){
    if(!this.map || !this.map.map) return;
    var map = this.map.map;
    map.setZoom(zoom);
    return this;
  },

  getCenterZoom: function(){
    var map = this.map.map;
    var c = map.getCenter();
    var z = map.getZoom();
    return {
      zoom: z,
      lat: c.lat(),
      lng: c.lng()
    };
  },

  maskAll: function(){
    this.el.mask(false,'<div class="x-mappanel-loading">SEARCHING...</div>');

    var me = this;
    setTimeout(function(){
      me.unmaskAll();
    },3000);
  },

  unmaskAll: function(){
    this.el.unmask();
  }
});

Ext.reg('mappanel', Ext.ux.MapPanel);
