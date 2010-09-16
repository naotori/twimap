Ext.ns('Ext.ns');

Ext.ux.GeocodeForm = Ext.extend(Ext.form.FormPanel,{
	initComponent: function(){
		Ext.apply(this,{
			baseCls: 'x-toolbar',
			layout: 'hbox',
			layoutConfig: {
				align: 'middle',
				pack: 'center'
			},
			items: [{
				xtype: 'geocodefield',
				flex: 10,
				itemId: 'geofield'
			},{
				xtype: 'button',
				iconCls: 'locate',
				ui: 'mask',
				itemsId: 'locbutton',
				handler: this.getCurrentLocation,
				scope: this
			}]
		});

		Ext.ux.GeocodeForm.superclass.initComponent.call(this);

		this.addEvents('geocode', 'currentlocation', 'beforecurrentlocation');

		this.on('afterlayout', function(){
			var geofield = this.getComponent('geofield');

			geofield.on('change', function(f,nv,ov){
				this.fireEvent('geocode', f, nv, ov);
			}, this);
		},this,{ single: true });
	},

	getCurrentLocation: function(opt){
		if(!this.geo) this.geo = new Ext.util.GeoLocation(); 

		if(this.fireEvent('beforecurrentlocation') !== false){
			this.geo.getLocation(function(coord){
				var lat, lng;
				if(coord){
					lat = coord.latitude;
					lng = coord.longitude;
				}else{
					lat = lng = false;
				}

				this.fireEvent('currentlocation', lat, lng, opt);
			},this);
		}
	}
});

Ext.reg('geocodeform', Ext.ux.GeocodeForm);
