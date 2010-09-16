Ext.ns("Ext.ux");

Ext.ux.MapPanelStatusStore = Ext.extend(Ext.ux.MapPanelLocalStore,{
  defaultAppId: 'mappanelstatusstorage',

  getModel: function(){
    var model = 'Ext.ux.MapPanelStatusStore.Model';
    Ext.regModel(model, {
      fields: [
        {name: 'id', type: 'int'},
        {name: 'lat', type: 'float'},
        {name: 'lng', type: 'float'},
        {name: 'zoom', type: 'int'}
      ]
    });

    return model;
  },

  saveStatus: function(data){
    data = data || {};
    var rec = this.getAt(0);

    // If no rec, create one
    if(!rec){
      rec = Ext.ModelMgr.create({},this.model);
      rec.set('id',Ext.id());
      this.insert(0,[rec]);
    }

    var fields = rec.fields.items;
    for(var i=0, len=fields.length; i<len; i++){
      var field = fields[i].name;
      if(Ext.isDefined(data[field])) rec.set(field, data[field]);
    }

    // Sync to localStorage (autoSave doesn't work somehow)
    // rec.commit() dosen't work either
    this.sync();
  },

  getStatus: function(){
    var ret = null;

    var rec = this.getAt(0);
    if(rec){
      ret = {};
      var fields = rec.fields.items;
      var data = rec.data;
      for(var i=0, len=fields.length; i<len; i++){
        var field = fields[i].name;
        ret[field] = rec.get(field); 
      }
    }
    return ret;
  },

  clearStatus: function(){
    var rec = this.getAt(0);
    this.remove(rec);
  }
});

Ext.reg('mappanelstatusstore', Ext.ux.MapPanelStatusStore);
