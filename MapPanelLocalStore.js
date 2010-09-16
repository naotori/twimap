Ext.ns("Ext.ux");

Ext.ux.MapPanelLocalStore = Ext.extend(Ext.data.JsonStore,{
  constructor: function(config){
    config = config || {};
    var model = this.getModel();

    Ext.applyIf(config, {
      proxy: {
        type: 'localstorage',
        id: config.appid || this.defaultAppId || 'mappanellocalstore'
      },
      sorters: [new Ext.util.Sorter({
        property: 'id',
        direction: 'DESC'
      })],
      autoSave: true,
      model: model
    });

    Ext.ux.MapPanelLocalStore.superclass.constructor.call(this, config);

    this.on('datachanged', this.onDataChange, this);
  },

  getModel: Ext.emptyFn,

  onDataChange: function(t){
    this.sync();
  }
});

Ext.reg('mappanellolcalstore', Ext.ux.MapPanelLocalStore);
