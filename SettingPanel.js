Ext.ns('Ext.ux');

Ext.ux.SettingPanel = Ext.extend(Ext.Panel,{
	closebtn: true,
	msgBody: "Clear all data?",
	stores: [],

	itemIds: {
		storeclearpanel: 'storeclearpanel',
		clearallpanel: 'clearallpanel',
		toolbar: 'toolbar'
	},

	initComponent: function(){
		Ext.apply(this,{
			layout: {
				type: 'fit'	
			},
			items: [
				this.buildStoreClearPanel()
			],
			dockedItems: [
				Ext.apply(this.buildToolbar(), {
					dock: 'top'
				})
			]
		});

		this.addEvents('beforeclose', 'close');

		Ext.ux.SettingPanel.superclass.initComponent.call(this);

		this.clearallpanel = this.getClearAllPanel();
	},

	initEvents: function(){
		Ext.ux.SettingPanel.superclass.initEvents.call(this);

		this.clearallpanel.on({
			itemselected: this.onClearAll,
			scope: this
		});
	},

	buildStoreClearPanel: function(){
		return {
			xtype: 'container',
			itemId: this.itemIds.storeclearpanel,
			layout: {
				type: 'vbox',
				pack: 'start',
				align: 'stretch'
			},
			items: [{
				xtype: 'listitem',
				itemId: this.itemIds.clearallpanel,
				itemtitle: 'Clear all data'
			}]
		}
	},

	buildToolbar: function(){
		var items = [];
		if(this.closebtn){
			items.push({
				xtype: 'button',
				text: 'Close',
				handler: this.onCloseBtn,
				scope: this
			});
		}

		return {
			xtype: 'toolbar',
			title: this.tbtitle || '',
			itemId: this.itemIds.toolbar,
			items: items
		};
	},

	getStoreClearPanel: function(){
		return this.getComponent(this.itemIds.storeclearpanel);	
	},

	getClearAllPanel: function(){
		return this.getStoreClearPanel().getComponent(this.itemIds.clearallpanel);	
	},

	onCloseBtn: function(){
		if(this.fireEvent('beforeclose', this) !== false){
			this.fireEvent('close', this);
		}
	},

	onClearAll: function(){
    if(!this.actionsheet){
      this.actionsheet = new Ext.ActionSheet({
        items: [{
          text: this.msgBody,
          ui: 'decline',
          handler: function(){
            this.actionsheet.hide();
						var stores = this.stores;
						for(var i=0, len=stores.length; i<len; i++){
							stores[i].remove(stores[i].getRange()); 
							stores[i].sync();
						}
						window.localStore.clear();
						delete this.stores;
          },
          scope: this
        },{
          text: 'Cancel',
          handler: function(){
            this.actionsheet.hide();
          },
          scope: this
        }]
      });
    }
    this.actionsheet.show();
	}
});

Ext.reg('settingpanel', Ext.ux.SettingPanel);
