Ext.ns("Ext.ux");

Ext.ux.BookmarkList = Ext.extend(Ext.List,{
  tpl: '<tpl for="."><div class="bookmarktitle"><strong>{title}</strong></div></tpl>',
  itemSelector: 'div.bookmarktitle',
  singleSelect: true,

  deselectAll: function(){
    var sels = this.getSelectedIndexes();
    for(var i=0,len=sels.length;i<len;i++){
      this.deselect(sels[i]);
    }
  }
});

Ext.reg('bookmarklist', Ext.ux.BookmarkList);
