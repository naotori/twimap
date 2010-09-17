Ext.ns('Ext.ux');

Ext.ux.BookmarkForm = Ext.extend(Ext.form.FormPanel, {
  itemIds: {
    fieldset: 'fieldset',
    titlefield: 'titlefield',
    bookmarkformtb: 'bookmarkformtb',
    savebtn: 'savebtn',
    deletebtn: 'deletebtn',
    cancelbtn: 'cancelbtn'
  },

  msgBody: 'Delete this item?',
  coords : { lat : 0, lng: 0, zoom: 0, title: ''},
  editmode: 'new',

  initComponent: function(){
    Ext.apply(this,{
      scroll: 'vertical',
      items: [
        this.buildFieldset()
      ],
      dockedItems: [
        Ext.apply(this.buildToolbar(), { dock: 'top' })
      ]
    });

    this.addEvents('beforeclose', 'close', 'beforebookmarksaved', 'bookmarksaved');
    Ext.ux.BookmarkForm.superclass.initComponent.call(this);

    this.titlefield = this.getTitleField();
    this.savebtn = this.getButton(this.itemIds.savebtn);
    this.deletebtn = this.getButton(this.itemIds.deletebtn);
    this.cancelbtn = this.getButton(this.itemIds.cancelbtn);
  },

  initEvents: function(){
    Ext.ux.BookmarkForm.superclass.initEvents.call(this);

    this.titlefield.on('change',function(){
      this.doLayout();
    },this);
  },

  buildFieldset: function(){
    return {
      xtype: 'fieldset',
      itemId: this.itemIds.fieldset,
      title: 'Title',
      items: [{
        xtype: 'textfield',
        itemId: this.itemIds.titlefield 
      }]
    };
  },

  buildToolbar: function(){
    return {
      xtype: 'toolbar',
      itemId: this.itemIds.bookmarkformtb,
      title: 'Bookmark',
      items: [{
        xtype: 'button',
        text: 'Cancel',
        itemId: this.itemIds.cancelbtn,
        handler: this.onCancelBtnClick,
        scope: this
      },{
        xtype: 'spacer'
      },{
        xtype: 'button',
        text: 'Delete',
        itemId: this.itemIds.deletebtn,
        ui: 'drastic',
        hidden: true,
        handler: this.onDeleteBtnClick,
        scope: this
      },{
        xtype: 'button',
        text: 'Save',
        itemId: this.itemIds.savebtn,
        ui: 'action',
        handler: this.onSaveBtnClick,
        scope: this
      }]
    };
  },

  getTitleField: function(){
    return this.getComponent(this.itemIds.fieldset).getComponent(this.itemIds.titlefield);
  },

  getButton: function(id){
    return this.getDockedComponent(this.itemIds.bookmarkformtb).getComponent(id);
  },

  getStore: function(){
    return this.store;  
  },

  setLocationData: function(data){
    data = data || {};
    Ext.apply(this.coords, data);
    if(data.title && data.id){
      this.editmode = 'update';
      this.deletebtn.show();
      this.titlefield.setValue(data.title);
    }else{
      this.deletebtn.hide();
      this.editmode = 'new';
    }
  },

  onCancelBtnClick: function(){
    if(this.fireEvent('beforeclose', this, this.editmode) !== false){
      this.reset();
      this.fireEvent('close', this, this.editmode);
    }
  },

  onSaveBtnClick: function(){
    var data = this.coords;
    var title = this.titlefield.getValue();
    if(!title || title.length == 0) return;

    Ext.apply(data, {title: title});

    if(this.fireEvent('beforebookmarksaved', this, data, this.editmode) !== false){
      if(this.editmode == 'new'){
        this.getStore().add(data);
      }else{
        var store = this.getStore();
        var rec = store.getById(data.id);
        var fields = rec.fields.items;
        for(var i=0, len=fields.length; i<len; i++){
          var field = fields[i].name;
          if(field!='id' && Ext.isDefined(data[field])) rec.set(field, data[field]);
        }

        store.sync();
      }

      this.fireEvent('bookmarksaved', this, data, this.editmode);

      this.titlefield.reset();
      this.fireEvent('close', this, this.editmode);
    }
  },

  onDeleteBtnClick: function(){
    if(!this.actionsheet){
      this.actionsheet = new Ext.ActionSheet({
        items: [{
          text: this.msgBody,
          ui: 'decline',
          handler: function(){
            this.actionsheet.hide();
            var store = this.getStore();
            store.remove(store.getById(this.coords.id));
            store.sync();

            this.reset();
            this.fireEvent('close', this, this.editmode);
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

  reset: function(){
    this.titlefield.reset();
    delete this.coords;
  }
});

Ext.reg('bookmarkform', Ext.ux.BookmarkForm);
