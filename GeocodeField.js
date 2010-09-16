Ext.ns('Ext.ns');

Ext.ux.GeocodeField = Ext.extend(Ext.form.SearchField,{
	initComponent: function(){
		Ext.apply(this,{
			placeHolder : 'address, location, etc.',
			inputCls: 'x-mappanel-searchfield'
		});
		
		Ext.ux.GeocodeField.superclass.initComponent.call(this);
	},

	initEvents: function(){
    var me = this;
        
    Ext.ux.GeocodeField.superclass.initEvents.call(me);
        
    if (me.fieldEl) {
      me.mon(me.fieldEl, {
				change: me.onChange,
        scope: me
      });
		}
	},

	// Hide keyboard by bluring from the field
	onChange: function(e,t){
		this.fieldEl.dom.blur();
	}
});

Ext.reg('geocodefield', Ext.ux.GeocodeField);
