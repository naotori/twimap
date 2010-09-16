Ext.ns('TwiMap', 'TwiMap.pc');

TwiMap.pc.Viewport = Ext.extend(Ext.Viewport,{
  initComponent: function(){
    Ext.apply(this, {
      layout: 'border',
      items: [{
        region: 'north',
        xtype: 'container',
        style: 'padding:10px',
        html: '<img height=75 src="resources/img/TwimapLogo.png" />',
        height: 90
      },{
        region: 'center',
        xtype: 'twimappcmappanel'
      }]
    });

    TwiMap.pc.Viewport.superclass.initComponent.call(this);
  }
});

TwiMap.pc.Viewport.init = function(){
  return new TwiMap.pc.Viewport();  
};

Ext.reg('twimappcviewport', TwiMap.pc.Viewport);
