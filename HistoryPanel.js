Ext.ns("Ext.ux");

Ext.ux.HistoryPanel = Ext.extend(Ext.Panel,{
	msgTitle: 'Delete History',
	msgBody: 'Delete search history?',
	closebutton: false,
	editing: false,

	itemIds: {
		bookmarkpanel: 'bookmarkpanel',
		bookmarklist: 'bookmarklist',
		historylist: 'historylist',
		historypaneltb: 'historypaneltb',
		listitem: 'listitem',
		deletebtn: 'deletebtn',
		editbtn: 'editbtn',
		backbtn: 'backbtn',
		closebtn: 'closebtn'
	},

	initComponent: function(){

		Ext.apply(this,{
			layout: 'card',
			items: [
				this.buildBookmarkPanel(),
				this.buildHistoryPanel()
			],
			dockedItems: [
				Ext.apply(this.buildToolbar(), {dock: 'top'})
			]
		});

		this.addEvents('beforeclose','close', 'beforeitemselected', 'itemselected', 'beforeitemselectedforedit', 'itemselectedforedit');

		Ext.ux.HistoryPanel.superclass.initComponent.call(this);

		this.bookmarkpanel = this.getBookmarkPanel();
		this.listitem = this.getListItem();
		this.bookmarklist = this.getBookmarkList();
		this.historylist = this.getHistoryList();
		this.backbtn = this.getButton(this.itemIds.backbtn);
		this.deletebtn = this.getButton(this.itemIds.deletebtn);
		this.editbtn = this.getButton(this.itemIds.editbtn);
		this.closebtn = this.getButton(this.itemIds.closebtn);
		this.toolbar = this.getToolbar();
	},

	initEvents: function(){
		Ext.ux.HistoryPanel.superclass.initEvents.call(this);

		var li = this.listitem;
		li.on({
			itemselected: this.onSwitchToHistoryPanel,
			scope: this
		});

		var hs = this.historylist;
		var bm = this.bookmarklist;

		hs.on({
			itemtap: this.onItemSelected,
			scope: this
		});

		bm.on({
			itemtap: this.onItemSelected,
			scope: this
		});

		var historyStore = this.historyStore;
		var deleteBtn = this.deletebtn;

		if(historyStore.getCount() !== 0) deleteBtn.enable();

		historyStore.on({
		/*
			clear: function(t){
				btn.disable();
			},
		*/
			datachanged: function(t){
				var count = t.getCount();
				if(count === 0){
					deleteBtn.disable();
				}else if(deleteBtn.disabled){
					deleteBtn.enable();	
				}
			},
			scope: this
		});
	},

	buildBookmarkPanel: function(){
		return {
			xtype: 'panel',
			layout: {
				type: 'vbox',
				pack: 'start',
				align: 'stretch'
			},
			itemId: this.itemIds.bookmarkpanel,
			items: [{
				xtype: 'listitem',
				itemId: this.itemIds.listitem,
				itemtitle: 'Search history'
			},{
				xtype: 'bookmarklist',
				itemId: this.itemIds.bookmarklist,
				store: this.bookmarkStore,
				flex: 1
			}]
		};
	},

	buildHistoryPanel: function(){
		return {
			xtype: 'historylist',
			itemId: this.itemIds.historylist,
			store: this.historyStore
		};
	},

	buildToolbar: function(){
		var items = [{
			text: 'Close',
			itemId: this.itemIds.closebtn,
			handler: this.onCloseBtnClick,
		},{
			text: 'Back',
			ui: 'back',
			hidden: true,
			itemId: this.itemIds.backbtn,
			handler: this.onBackBtnClick
		},{
			xtype: 'spacer'
		},{
			text: 'Edit',
			itemId: this.itemIds.editbtn,
			handler: this.onEditBtnClick
		},{
			text: 'Delete',
			hidden: true,
			disabled: true,
			itemId: this.itemIds.deletebtn,
			handler: this.onDeleteBtnClick
		}];

		return {
			xtype: 'toolbar',
			title: 'Bookmark',
			itemId: this.itemIds.historypaneltb,
			defaults: {
				xtype: 'button',
				scope: this
			},
			items: items 
		};
	},

	getBookmarkPanel: function(){
		return this.getComponent(this.itemIds.bookmarkpanel);	
	},

	getListItem: function(){
		return this.getBookmarkPanel().getComponent(this.itemIds.listitem);	
	},

	getBookmarkList: function(){
		return this.getBookmarkPanel().getComponent(this.itemIds.bookmarklist);	
	},

	getHistoryList: function(){
		return this.getComponent(this.itemIds.historylist);	
	},

	getToolbar: function(){
		return this.getDockedComponent(this.itemIds.historypaneltb);	
	},

	getButton: function(id){
		var tb = this.getToolbar();
		return tb.getComponent(id);
	},

	onCloseBtnClick: function(){
		if(this.fireEvent('beforeclose', this) !== false){
			this.fireEvent('close', this);
		}
	},

	onBackBtnClick: function(){
		this.onSwitchToBookmarkPanel();
	},

	onEditBtnClick: function(){
		if(this.editing === true){
			this.editing = false;
			this.editbtn.setText('Edit');
			this.listitem.enable();
		}else{
			this.editing = true;
			this.editbtn.setText('Done');	
			this.listitem.disable();
		}
	},

	onDeleteBtnClick: function(){
		if(!this.actionsheet){
			this.actionsheet = new Ext.ActionSheet({
				items: [{
					text: this.msgBody,
					ui: 'drastic',
					handler: function(){
						this.actionsheet.hide();
						var store = this.historyStore;
//						store.removeAll();
						store.remove(store.getRange()); // workaround due to removeAll bug
						store.sync();
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
	},

	onItemSelected: function(list, i, itm, e){
		if(this.editing){
			if(this.fireEvent('beforeitemselectedforedit',this,list,i,itm,e) !== false){
				this.fireEvent('itemselectedforedit', this, list, i, itm, e);
			}
		}else{
			if(this.fireEvent('beforeitemselected',this,list,i,itm,e) !== false){
				this.fireEvent('itemselected', this, list, i, itm, e);
				list.deselectAll();
			}
		}
	},

	onSwitchToHistoryPanel: function(itm){
		itm.reset();

		this.setCard(this.historylist,{
			type: 'slide',
			direction: 'left'
		});

		this.closebtn.hide();
		this.editbtn.hide();
		this.backbtn.show();
		this.deletebtn.show();

		this.toolbar.setTitle('History');
	},

	onSwitchToBookmarkPanel: function(){
		this.setCard(this.bookmarkpanel,{
			type: 'slide',
			direction: 'right'
		});

		this.closebtn.show();
		this.editbtn.show();
		this.backbtn.hide();
		this.deletebtn.hide();

		this.toolbar.setTitle('Bookmark');
	},

	reset: function(){
		this.onSwitchToBookmarkPanel();
	}
});

Ext.reg('historypanel', Ext.ux.HistoryPanel);
