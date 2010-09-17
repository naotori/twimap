Ext.ns('Ext.ux');

Ext.ux.UrlPanel = Ext.extend(Ext.form.FormPanel, {
  itemIds: {
    fieldset: 'fieldset',
    url: 'url'
  },

  initComponent: function(){
    Ext.apply(this,{
      floating: true,
      modal: true,
      centered: true,
      width: Ext.Element.getViewportWidth() - 50,
      height: Math.min(Ext.Element.getViewportHeight()-100,300),
      scroll: 'vertical',
      items: [
        this.buildFieldset()
      ],
      dockedItems: [
        Ext.apply(this.buildToolbar(), {dock: 'top'})
      ]
    });

    Ext.ux.UrlPanel.superclass.initComponent.call(this);

    this.urlfield = this.getUrlField();
  },

  buildFieldset: function(){
    return {
      xtype: 'fieldset',
      itemId: this.itemIds.fieldset,
      title: 'Map URL',
      items: [{
        xtype: 'textfield',
        readOnly: true,
        itemId: this.itemIds.url 
      }]
    };
  },

  buildToolbar: function(){
    return {
      xtype: 'toolbar',
      itemId: this.itemIds.toolbar,
      defaults: {
        xtype: 'button',
        ui: 'plain',
				iconMask: true
      },
      items: [{
        iconCls: 'attachment',
        handler: this.onShorten,
        scope: this
      }]
    }
  },

  getUrlField: function(){
    return this.getComponent(this.itemIds.fieldset).getComponent(this.itemIds.url);
  },

  setUrl: function(url){
    if(this.urlfield){
      this.urlfield.setValue(url);  
    }else{
      var me = this;
      setTimeout(function(){
        me.setUrl(url);  
      },10);
    }
  },

  onOrientationChange: function(){
    Ext.ux.UrlPanel.superclass.onOrientationChange.apply(this, arguments);

    this.setSize(
      Ext.Element.getViewportWidth() - 100,
      Math.min(Ext.Element.getViewportHeight() - 100, 200)
    );  
  },

  onShorten: function(){
    var url = this.urlfield.getValue();
    if(!url || url.length == 0) return;
    if(!BitlyClient) return;

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

Ext.reg('urlpanel', Ext.ux.UrlPanel);
