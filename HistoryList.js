Ext.ns("Ext.ux");

Ext.ux.HistoryList = Ext.extend(Ext.List,{
  tpl: '<tpl for="."><div class="address"><strong>{query}</strong></div></tpl>',
  itemSelector: 'div.address',
  singleSelect: true,

  deselectAll: function(){
    var sels = this.getSelectedIndexes();
    for(var i=0,len=sels.length;i<len;i++){
      this.deselect(sels[i]);
    }
  }

});

Ext.reg('historylist', Ext.ux.HistoryList);
