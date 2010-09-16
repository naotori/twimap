Ext.ns('TwiMap', 'TwiMap.pc');

TwiMap.pc.MapPanelToolbar = Ext.extend(Ext.Toolbar,{

  initComponent: function(){
    Ext.apply(this, {
      layout: {
        type: 'hbox'
      },
      items: [{
        xtype: 'textfield',
        width: 200,
        ref: 'searchfield',
        enableKeyEvents: true
      },{
        xtype: 'button',
        text: 'Search',
        handler: this.onSearch,
        scope: this
      },{
        xtype: 'spacer',
        flex: 1
      },{
        xtype: 'textfield',
        width: 400,
        ref: 'urlfield'
      },{
        xtype: 'button',
        text: 'Shorten',
        handler: this.onShorten,
        scope: this
      }]
    });

    this.addEvents('geocode');

    TwiMap.pc.MapPanelToolbar.superclass.initComponent.call(this);

    this.searchfield.on({
      keypress: function(t,e){
        if(e.getKey() == 13) this.onSearch();
      },
      scope: this
    })
  },

  onSearch: function(){
    var val = this.searchfield.getValue();
    if(!val || val.length == 0) return;
    
    this.fireEvent('geocode',this.searchfield,val,"");
  },

  updateUrlField: function(val){
    this.urlfield.setValue(val);
  },

  onShorten: function(){
    var url = this.urlfield.getValue();
    if(!url || url.length == 0) return;

    var field = this.urlfield;

    BitlyCB.shortenResponse = function(data) {
      if(data.errorCode == 0 && data.statusCode == 'OK'){
        var result = data.results[url];
        if(result && result.shortUrl) field.setValue(result.shortUrl);
      }
    }

    BitlyClient.shorten(url, 'BitlyCB.shortenResponse');
  }
});

Ext.reg('twimappcmappaneltoolbar', TwiMap.pc.MapPanelToolbar);
