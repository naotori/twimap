Ext.ns('TwiMap');

TwiMap = Ext.extend(Ext.Panel, {
  appid: 'twimap-0.0.1',

  itemIds : {
    mappanel: 'mappanel',
    historypanel: 'historypanel',
    bookmarkform: 'bookmarkform',
    settingpanel: 'settingpanel',
    mappaneltb: 'mappaneltb'
  },

  fullscreen: true,

  initComponent: function(){
    this.initStores();

    Ext.apply(this,{
      layout: 'card',
      items: [
        this.buildMapPanel(),
        this.buildHistoryPanel(),
        this.buildBookmarkForm()
//        this.buildSettingPanel()
      ]
    });

    TwiMap.superclass.initComponent.call(this);

    this.mappanel = this.getMapPanel();
    this.historypanel = this.getHistoryPanel();
    this.bookmarkform = this.getBookmarkForm();
    this.settingpanel = this.getSettingPanel();
  },

  initEvents: function(){
    TwiMap.superclass.initEvents.call(this);

    this.historypanel.on({
      itemselected: this.onHistoryItemSelected,
      itemselectedforedit: this.onBookmarkSelectedForEdit,
      close: this.onHistoryPanelClose,
      scope: this
    });

    this.bookmarkform.on({
      close: this.onBookmarkFormClose,
      scope: this
    });
  },

  buildMapPanel: function(){
    return {
      xtype: 'mappanel',
      itemId: this.itemIds.mappanel,
      statusStore: this.statusStore,
      historyStore: this.historyStore,
      mapConfig: this.mapConfig || {},
      dockedItems: [
        Ext.apply(this.buildMapPanelToolbar(),{
          dock: 'bottom'
        })  
      ] 
    };
  },

  buildHistoryPanel: function(){
    return {
      xtype: 'historypanel',
      itemId: this.itemIds.historypanel,
      historyStore: this.historyStore,
      bookmarkStore: this.bookmarkStore
    };
  },

  buildBookmarkForm: function(){
    return {
      xtype: 'bookmarkform',
      itemId: this.itemIds.bookmarkform,
      store: this.bookmarkStore
    };
  },

  buildSettingPanel: function(){
    return {
      xtype: 'panel',
      itemId: this.itemIds.settingpanel,
      html: '<div><span id="twitter_login"></span></div>',
      listeners: {
        afterrender: function(){
          if(Ext.isDefined(window.twttr)){
            twttr.anywhere(function (T) { T("#twitter_login").connectButton(); });
          }
        }
      }
    };
  },

  buildMapPanelToolbar: function(){
    return {
      xtype: 'toolbar',
      itemId: this.itemIds.mappaneltb,
      defaults: { ui: 'mask' },
      layout: {
        pack: 'center'  
      },
      items: [{
        iconCls: 'bookmarks',
        handler: this.onBookmarksClick,
        scope: this
      },{
        iconCls: 'add',
        handler: this.onAddLocationClick,
        scope: this
/*
      },{
        iconCls: 'settings',
        handler: this.onSettingsClick,
        scope: this
*/
      }]
    };
  },

  getMapPanel: function(){
    return this.getComponent(this.itemIds.mappanel);
  },

  getHistoryPanel: function(){
    return this.getComponent(this.itemIds.historypanel);
  },

  getBookmarkForm: function(){
    return this.getComponent(this.itemIds.bookmarkform);
  },

  getSettingPanel: function(){
    return this.getComponent(this.itemIds.settingpanel);
  },

  getMapPanelToolbar: function(){
    return this.getMapPanel().getDockedComponent(this.itemIds.mappaneltb);
  },

  onSettingsClick: function(){
    this.setCard(this.settingpanel,{
      type: 'slide',
      direction: 'up'
    });
  },

  onBookmarksClick: function(){
    this.setCard(this.historypanel,{
      type: 'slide',
      direction: 'up'
    });
  },

  onAddLocationClick: function(){
    this.bookmarkform.setLocationData(this.mappanel.getCenterZoom());
    this.setCard(this.bookmarkform, {
      type: 'slide',
      direction: 'up'
    });  
  },

  onBookmarkFormClose: function(frm, mode){
    if(mode == 'new'){
      this.onHome();
    }else{
      this.setCard(this.historypanel,{
        type: 'slide',
        direction: 'right'
      });
    }
  },

  onHistoryPanelClose: function(){
    this.onHome();
  },

  onHome: function(){
    this.setCard(this.mappanel,{
      type: 'slide',
      direction: 'down'
    });
  },

  onHistoryItemSelected: function(pnl, list,idx,item,e){
    pnl.reset();
    var rec = list.getRecord(item).data;
    this.onHistoryPanelClose();
    this.mappanel.setCenter(rec.lat,rec.lng).setZoom(rec.zoom);
  },

  onBookmarkSelectedForEdit: function(pnl, list,idx,item,e){
    pnl.reset();
    var rec = list.getRecord(item).data;
    this.bookmarkform.setLocationData(rec);
    this.setCard(this.bookmarkform,{
      type: 'slide',
      direction: 'left'
    });
  },

  initStores: function(){
    var appid = this.appid;

    var statusStore = new Ext.ux.MapPanelStatusStore({ appid: appid+'_status' });
    statusStore.load();

    var historyStore = new Ext.ux.MapPanelSearchHistoryStore({ appid: appid+'_history' });
    historyStore.load();

    var bookmarkStore = new Ext.ux.MapPanelBookmarkStore({ appid: appid+'_bookmark' });
    bookmarkStore.load();

    this.statusStore = statusStore;
    this.historyStore = historyStore;
    this.bookmarkStore = bookmarkStore;
  }
});
