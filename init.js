
Ext.override(Ext.data.WebStorageProxy,{
    getNextId: function() {
        var obj  = this.getStorageObject(),
            key  = this.getRecordCounterKey(),
            last = obj[key],
            ids, id;
        
        if (last == undefined) {
            ids = this.getIds();
            last = parseInt(ids[ids.length - 1], 10) || 0;
        }
        
        id = parseInt(last, 10) + 1;
        obj.setItem(key, id);
        
        return id;
    },

    destroy: function(operation, callback, scope) {
        var records = operation.records,
            length  = records.length,
            ids     = this.getIds(),

            //newIds is a copy of ids, from which we remove the destroyed records
            newIds  = [].concat(ids),
            i;

        for (i = 0; i < length; i++) {
            newIds.remove(""+records[i].getId());
            this.removeRecord(records[i], false);
        }

        this.setIds(newIds);

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    }
});

Ext.setup({
  phoneStartupScreen: 'resources/img/twimap_phone_splash.png',
  tabletStartupScreen: 'resources/img/twimap_tablet_splash.png',
  icon: 'resources/img/twimap_icon.png',
  statusBarStyle: 'default',
  fullscreen: true,
//  hideAddressBar: false,
  onReady: function(){
    Ext.fly('downloading').hide();
    Ext.getBody().mask(false,'<div class="loading">LOADING...</div>');

    var element = document.createElement('script');
    element.src = 'http://maps.google.com/maps/api/js?sensor=true&v=3.1&callback=mapReady';
    element.type = 'text/javascript';
    var scripts = document.getElementsByTagName('script')[0];
    scripts.parentNode.insertBefore(element, scripts);
  }
});

function mapReady(){

  // Decode URL input
  var url = document.location.search;
  if(url && url.length>0){
    if(url[0] == '?') url = url.slice(1);
    var args = Ext.urlDecode(url);

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

  new TwiMap({ mapConfig: args  });

  Ext.getBody().unmask();
}
