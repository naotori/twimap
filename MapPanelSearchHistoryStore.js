Ext.ns("Ext.ux");

Ext.ux.MapPanelSearchHistoryStore = Ext.extend(Ext.ux.MapPanelLocalStore,{
  defaultAppId: 'mappanelsearchhistorystorage',

  getModel: function(){
    var model = 'Ext.ux.MapPanelSearchHistoryStore.Model';
    Ext.regModel(model, {
      fields: [
        {name: 'id', type: 'int'},
        {name: 'lat', type: 'float'},
        {name: 'lng', type: 'float'},
        {name: 'zoom', type: 'int'},
        {name: 'query', type: 'string' }
      ]
    });

    return model;
  }
});

Ext.reg('mappanelsearchhistorystore', Ext.ux.MapPanelSearchHistoryStore);
