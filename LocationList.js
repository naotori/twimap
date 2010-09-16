Ext.ns("Ext.ux");

Ext.ux.LocationList = Ext.extend(Ext.List,{
	msgTitle: '',
	msgBody: '',

	itemIds: {
		historypaneltb: 'historypaneltb',
		deletebtn: 'deletebtn'
	},

	tpl: '<tpl for="."><div class="address"><strong>{query}</strong></div></tpl>',
	itemSelector: 'div.address',
	singleSelect: true,

	initComponent: function(){
		Ext.ux.LocationList.superclass.initComponent.call(this);
	}
});

Ext.reg('locationlist', Ext.ux.LocationList);
