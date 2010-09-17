Ext.ns("Ext.ux");

Ext.ux.ListItem = Ext.extend(Ext.Component,{
  tpl: '<div class="x-list x-list-flat"><div class="x-list-parent"><div class="ux-itempanel"><strong>{msg}</strong></div></div></div>',
  itemSelector: 'div.ux-itempanel',

  selectedCls : "x-item-selected",
  pressedCls : "x-item-pressed",

  initComponent: function(){
		this.data = this.data || {msg: ""};
    Ext.apply(this.data, { msg: this.itemtitle || "" });

    this.addEvents('beforeitemselected', 'itemselected');

    Ext.ux.ListItem.superclass.initComponent.call(this);

    this.on({
      afterrender: function(){
        this.mon(this.el, {
          tap: this.onTap,
          tapstart: this.onTapStart,
          tapcancel: this.onTapCancel,
          touchend: this.onTapCancel,
          scope: this
        });  
      },
      scope: this
    });
  },

  reset: function(){
    this.el.select(this.itemSelector).removeClass([this.pressedCls, this.selectedCls]);  
  },

  onDisable: function(){
    this.el.mask();
  },

  onEnable: function(){
    this.el.unmask();  
  },

  onTap: function(e,t){
    if(this.disabled) return;

    var me = this,
    item = this.findTarget(e);

    if(item) {
      Ext.fly(item).removeClass(me.pressedCls).addClass(me.selectedCls);
    }

    if(this.fireEvent('beforeitemselected', this) !== false){
      this.fireEvent('itemselected',this);  
    }else{
      this.reset();
    }
  },

  onTapStart: function(e,t){
    if(this.disabled) return;

    var me = this,
    item = this.findTarget(e);

    if (item) {
     Ext.fly(item).addClass(me.pressedCls);
    }
  },

  onTapCancel: function(e,t){
    if(this.disabled) return;

    var me = this,
    item = this.findTarget(e);

    if (item) {
      Ext.fly(item).removeClass(me.pressedCls);
    }
  },

  findTarget: function(e){
    return e.getTarget(this.itemSelector, this.el);
  }
});

Ext.reg('listitem', Ext.ux.ListItem);
