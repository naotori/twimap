Ext.ns("Ext.ux");

Ext.ux.MapPanelBookmarkStore = Ext.extend(Ext.ux.MapPanelLocalStore,{
  defaultAppId: 'mappanelbookmarkstorage',

  getModel: function(){
    var model = 'Ext.ux.MapPanelBookmarkStore.Model';
    Ext.regModel(model, {
      fields: [
        {name: 'id', type: 'int'},
        {name: 'lat', type: 'float'},
        {name: 'lng', type: 'float'},
        {name: 'zoom', type: 'int'},
        {name: 'title', type: 'string' }
      ]
    });

    return model;
  }
});

Ext.reg('mappanelbookmarkstore', Ext.ux.MapPanelBookmarkStore);
