

(function( $ ) 
 {
     var Element = function() {
	 this.template = 'jtk-element'
	 this.type = 'element'
	 this._guid = null
	 var $this = this;
	 this.guid = function()
	 {
	     return $this.ctx.data('session');
	 }

	 this.getURL = function()
	 {
	     // this should be dyanamic
	     return '/jplates/jtk-elements.html'
	 }


	 this.frame = function()
	 {
	     return this.ctx.data('frame')
	 }

	 this.init = function(ctx)
	 {
    	     this.kids = {};
	     this.parent = {};
	     this.ctx = ctx;	    
	     //this.uid = this.guid()
	     this.params = {}	
	     this.templates = this.templates || {}
	     this.model = {}
	     return this
	 }

	 this.loadTemplates = function(cb)
	 {
	     var templates = this.templates || {}
	     //console.log('loading templates now '+this.template)
	     if ('getURL' in this)
		 this.template_url = this.getURL()	     
	     if (this.template_url)
	     {
		 if (this.template_url in templates && !(this.template in templates[this.template_url]))
		     templates[this.template_url].push(this.template)
		 else templates[this.template_url] = [this.template];
	     }
	     //console.log(templates)
	     //console.log(this.template_url)
	     //console.log('loading frame templates')
	     //console.log(templates)
	     if (this.debug && this.debug == true)		
	     {
		 for (var template in templates){
		     console.log('loading templates for '+this.name+' '+template+' '+templates[template]);		 
		 }
	     }
	     if (templates)
	     {
		 $.jplates(templates,cb,this.debug);
	     }
	     return this;
	 };

	 this.added = function()
	 {
	     return this.after_add()	     
	 }

	 this.add_bindings = function()
	 {

	 }

	 this.adding = function()
	 {

	 }

	 this.after_add = function()
	 {

	 }

	 this.destroy = function(name)
	 {
	     // i dont think this is right
	     this.element.find('.'+name).remove();
	     this.remove(name)
	 }

	 this.remove = function(name)
	 {
	     delete this.kids[name]
	 }

	 /* add a child object to this element */
	 this.add = function(name, jtkel, el, cb, pos)
	 {

	     if (this.debug && this.debug == true)		
	     {
		 console.log('container')
		 console.log(el)
	     }

	     var $this = this;
	     if (!jtkel.params) jtkel.params = {}
	     if (!el) el = this.$


	     if (jtkel.klass)
		 jtkel.params['class_'] = jtkel.klass

	     if (jtkel.kontent)
		 jtkel.params['content_'] = jtkel.kontent

	     if (jtkel.src)
		 jtkel.params['src'] = jtkel.src

	     if (jtkel.href)
		 jtkel.params['href'] = jtkel.href

	     if (jtkel.alt)
		 jtkel.params['alt'] = jtkel.alt

	     if (jtkel.colspan)
		 jtkel.params['colspan'] = jtkel.colspan

	     if (jtkel.subtype && !jtkel.params['type'])
		 jtkel.params['type'] = jtkel.subtype
	     
	     try {
		 jtkel.adding()
	     } catch(err){
		 console.log('FAILED')
		 console.log(jtkel)
		 jtkel.adding()
	     }

	     var loaded = function(_jtk)
	     {
		 if (this.debug && this.debug == true)		
		 {
		     if ($this.debug && $this.debug == true)		
		     {
			 console.log('added '+name+' to '+this.name);
			 console.log(jtkel)
			 console.log(el)			 
		     }
		 }
		 _jtk['name'] = name
		 $this.kids[name] = _jtk; 
		 //console.log('adding '+_jtk.type+':'+name+' to '+$this.name)
		 _jtk['parent'] = $this;
		 //console.log('added')
		 //console.log(_jtk)
		 _jtk.add_bindings()
		 _jtk.added()
		 if (this.debug && this.debug == true)		
		 {
		     if ($this.debug && $this.debug == true)		
		     {
			 console.log('added '+name+' to '+this.name);
			 console.log(jtkel)
			 console.log(el)			 
		     }
		 }
		 if (cb) cb(_jtk)
	     }
	     jtkel.name = name;
	     try 
	     { 
		 if (this.debug && this.debug == true)		
		 {
		     console.log('adding '+name+' to '+this.name);
		 }
		 jtkel.render(el,loaded, pos)
	     }
	     catch(err)
	     { 
		 console.log(err) 
	     }
	     return this;
	 };

	 this.has_child = function(child)
	 {
	     if (child in this.kids)
	     {
		 return true
	     }
	     else return false
	 };

	 this.hide = function(content)
	 {	     
	     this.element.toggleClass('hidden', true);
	     return this;
	 }

	 this.waiting = function(start)
	 {
	     if (start == true)
		 console.log(this.parent.element);
	 }

	 this.hidden = function(content)
	 {	     
	     return this.$.hasClass('hidden');
	 }

	 this.show = function(content)
	 {	     
	     this.$.toggleClass('hidden', false);
	     return this;
	 }

	 this.update_kids = function()
	 {
	     var counter = 0;
	     var $this = this;
	     //console.log('adding kids for' +this.name)	    

	     // i think remove this
	     if (!this.model)
	     {
		 for (var child in this.kids)
		 {
		     this.kids[child].update()
		 }
		 return this
	     }

	     var update_all = function()
	     {
		 for (var child in $this.kids)
		 {
		     $this.kids[child].update()
		 }
	     }
	     
	     var cb = function()
	     {
		 counter--;
		 if (counter == 0)
		 {
		     update_all()
		 }
	     }
	     for (var child in this.model)
	     {
		 if (!this.has_child(child))
		 {
		     //console.log(this.name)
		     if ('selector' in this.model[child])
			 var container = this.model[child].selector();
		     else
			 var container = this.$
		     if(this.debug){
			 console.log('container1')		     
			 console.log(container)
			 this.model[child].selector()
		     }
		     counter ++;
		     try {			 
			 this.add(child
				  ,this.model[child].child.apply(this,this.model[child].args)
				  ,container
				  ,cb
				 )
		     } catch(err) {
			 console.log(err)
		     }
		 }
	     }
	     if (counter == 0) update_all()
	     return this
	 }
	 
	 this.update = function()
	 {	
	     //console.log('updating: '+this.name)
	     try
	     {		 
		 if (this.update_data)
		     this.update_data()
		 if (this.update_kids)		 
		     this.update_kids()
		 if (this.update_content)		 
		     this.update_content()	    
	     } catch(err){ console.log(err) }
	     return this
	 }

	 this.load = function(content,cb)
	 {	  
	     this.render(content,cb)
	     return this;
	 };	

	 this.render = function(content,cb,pos)
	 {
	     
	     if (this.debug && this.debug == true)		
	     {
		 console.log('rendering '+this.name);		 
	     }
	     var template = this.template;
	     var params = this.params || {};
	     params['name'] = params.name || this.name;
	     params['id_'] = params.id_ || this.id || this.uid;
	     var $this = this;
	     //console.log(params)

	     this.loadTemplates(
		 function() 
		 {
		     var element = $.tmpl(template,params)
		     $this.element = element
		     $this.$ = element
		     
		     //console.log('appending')
		     if (pos == 0) {		
			 if ($this.debug && $this.debug == true)		
			 {
			     console.log('prepending '+element.html());		 
			 }
			 element.prependTo(content);
		     } else {
			 if ($this.debug && $this.debug == true)		
			 {
			     console.log(element)
			     console.log('appending '+element.html());		 
			 }
			 element.appendTo(content);
		     }

		     if ($this.update)
			 $this.update($this);

		     if (cb) cb($this)

		 })
	     return this;
	 };
	 return this;
     }     

     var Widget = function()
     {
	 this.template = 'jtk-widget'

     };
     Widget.prototype = new Element;
    
     var Macro = function()
     {
	 this.load = function(content,vars,cb)
	 {	    
	     this.render(content,vars,cb)
	     return this;
	 };	

	 this.render = function(content,cb)
	 {
	     var template = this.template;
	     var update = this.update;
	     var params = this.params || {};
	     params['name'] = this.name;
	     //console.log('rendering '+this.name)
	     var $this = this;

	     this.loadTemplates(
		 function() 
		 {	
		     var element = $.tmpl(template,params)
		     element.appendTo(content);
		     $this.element = element
		     $this.$ = element

		     if (cb) cb($this)
		 })
	     return this;
	 };
	 return this;
     }
     Macro.prototype = new Element;
     
     var Panel = function(){
	 this.type = 'panel';
	 this.template = 'jtk-panel';
	 //this.kids = {};
     };
     Panel.prototype = new Element;

     var Frame = function(){
	 //console.log('calling frame')
	 this.kids = {};
	 this.type = 'frame';
	 this.template = 'jtk-frame';

	 var $this = this;
	 this.guid = function()
	 {
	     return $this.ctx.data('session');
	 }

	 /* attach the frame to a jquery object */
	 this.attach = function(content,name,cb,pos)
	 {
	     this.parent = content;
	     this.ctx = content;
	     this.name = name;
	     this.ctx.data('frame', this)
	     var $this = this;
	     //console.log('attaching '+name+' to '+content)
	     var loaded = function(el)
	     {
		 //console.log('done: attaching '+name+' to '+content)
		 $this.element = el
		 $this.$ = el
		 if (cb) cb($this)
	     }
	     this.render(this.ctx,loaded,pos);
	     return this
	 }

	 /* load the templates associated with this element and attach them to the parent content */
	 this.render = function(content,cb,pos)
	 {
	     var template = this.template;
	     var update = this.update;
	     var update_data = this.update_data
	     var params = this.params || {};
	     params['name'] = this.name;
	     this.loadTemplates(
		 function() 
		 {		
		     //console.log('here 2')	  
		     //console.log('adding frame '+template+' '+name)
		     //console.log(content)
		     content.html('');	
		     var frame = $.tmpl(template,params).appendTo(content)

		     if (update)
			 update(frame)

		     if (cb) cb(frame)
		 })
	 }
	 return this;
     };
     Frame.prototype = new Element;

     var Popup = function()
     {
	 this.kids = {}
	 this.parent = {}
	 this.template = 'jtk-popup';

	 /* attach the popup to a jquery object */
	 this.attach = function(ctx,content,name,cb)
	 {
	     this.parent = content;
	     this.ctx = ctx;
	     this.name = name;
	     var $this = this;
	     var loaded = function(el)
	     {
		 if (cb) cb($this)
	     }
	     this.render(content.element,loaded);
	     return this
	 }

	 /* load the templates associated with this element and attach them to the parent content */
	 this.render = function(content,cb)
	 {
	     var template = this.template;
	     var update = this.update;
	     var params = this.params || {};
	     params['name'] = this.name;
	     var $this = this;
	     this.loadTemplates(
		 function() 
		 {			  
		     //console.log('adding popup '+template+' '+name)

		     var element = $.tmpl(template,params)
		     element.appendTo(content)
		     $this.element = element;		    
		     $this.$ = element
		     //console.log($this)
		     //console.log(element)
		  //   if (update)
		//	 update($this)

		     if (cb) cb($this)
		 })
	 }
     }
     Popup.prototype = new Element;

     var Graph = function()
     {
     }
     Graph.prototype = new Element;

     var Title = function()
     {
	this.template = 'jtk-title'
     }
     Title.prototype = new Element;

     var Image = function()
     {
	this.template = 'jtk-image'
     }
     Image.prototype = new Element;

     var Canvas = function()
     {
	this.template = 'jtk-canvas'
     }
     Canvas.prototype = new Element;

     var Label = function()
     {
	 this.template = 'jtk-label'
     }
     Label.prototype = new Element;

     var Link = function()
     {
	this.template = 'jtk-link'
     }
     Link.prototype = new Element;

     var Button = function()
     {
	 this.subtype = 'link'
	 this.template = 'jtk-button'
     }
     Button.prototype = new Element;

     var List = function()
     {
	 this.subtype = "unordered"
	 this.template = 'jtk-list'
     }
     List.prototype = new Element;

     var ListTerm = function()
     {
	 this.template = 'jtk-list-term'
     }
     ListTerm.prototype = new Element;

     var ListDescription = function()
     {
	 this.template = 'jtk-list-description'
     }
     ListDescription.prototype = new Element;

     var ListItem = function()
     {
	 this.template = 'jtk-list-item'
     }
     ListItem.prototype = new Element;

     var Form = function()
     {
	this.template = 'jtk-form'
     }
     Form.prototype = new Element;

     var Menus = function()
     {
	 this.subtype = "definition"
	 this.template = 'jtk-list'
	 this.adding = function(){
	     this.params['class_'] += ' dropdown-menus'
	 }
     }
     Menus.prototype = new List;

     var Menu = function()
     {
	 var $this = this;
	 this.title = ''
	 this.id = ''
	 this.items = {}
	 this.added = function(){
	     $this.id = $this.title.toLowerCase().replace('-','')
	     var title = new ListTerm().init($this.ctx)
	     var title_link = new Link().init($this.ctx)
	     var menu_content = new ListDescription().init($this.ctx)
	     title_link.kontent = $this.title;
	     title_link.href = '#'+$this.id;
	     title.model['link'] = {child: function(){return title_link}}

	     $this.debug = true;
	     $this.model['title'] = {child: function(){return title}
				     ,selector: function(){return $this.parent.$}}

	     $this.model['menu'] = {child: function(){return menu_content}
				    ,selector: function(){return $this.parent.$}}

	     var menu_list = new List().init($this.ctx)
	     for (var item in $this.items){		 
		 menu_list.model[item] = $this.items[item];
	     }
	     menu_content.model['menu-list'] = {child: function(){return menu_list}}
	     menu_content.added = function(){menu_content.hide()}
	     $this.ctx.signal('listen', 'toggle-menu-'+$this.title, function(){
		 if (menu_content.hidden()){
		     menu_content.show()
		     var offset_left = title.$.offset().left
		     menu_content.$.offset({left: offset_left})
		     for (var menu in $this.parent.kids){
			 if ($this.parent.kids[menu] != $this) {
			     $this.parent.kids[menu].kids['menu'].hide()
			 }
		     }
		 } else {
		     menu_content.hide()		
		 }
	     })
	     title_link.add_bindings = function(){	     
		 title_link.$.click(function(evt){
		     evt.preventDefault()
		     $this.ctx.signal('emit', 'toggle-menu-'+$this.title,'')
		 })
	     }
	     $this.update()
	 }
     }
     Menu.prototype = new Element;

     var MenuItem = function()
     {
	 var $this = this;
	 this.title = ''
	 this.id = ''
	 this.adding = function(){
	     $this.id = $this.title.toLowerCase().replace('-','')
	     var title_link = new Link().init($this.ctx)
	     title_link.href = '#'+$this.id;
	     title_link.kontent = $this.title
	     $this.model['link'] = {child: function(){return title_link}}	     
	     $this.add_bindings = function(){	     

	     }
	 }
     }
     MenuItem.prototype = new ListItem;

     var Input = function()
     {
	 this.template = 'jtk-input'
	 var $this = this;
	 this.hint = function(ele)
	 {
	     ele.focus(function() {
		 if (ele.val() == ele.attr('title'))
		     ele.val('')
                     .removeClass('hint');
	     }).blur(function() {
		 if (ele.val() == '')
		     ele.val(ele.attr('title'))
                     .addClass('hint');
	     });
	 }
     }
     Input.prototype = new Element;

     var Select = function()
     {
	this.template = 'jtk-select'
     }
     Select.prototype = new Element;

     var Option = function()
     {
	this.template = 'jtk-option'
     }
     Option.prototype = new Element;

     var Table = function()
     {
	this.template = 'jtk-table'
     }
     Table.prototype = new Element;

     var TableRow = function()
     {
	this.template = 'jtk-table-row'
     }
     TableRow.prototype = new Element;

     var TableRowGroup = function()
     {
	this.template = 'jtk-table-row-group'
     }
     TableRowGroup.prototype = new Element;

     var TableCell = function()
     {
	this.template = 'jtk-table-cell'
     }
     TableCell.prototype = new Element;

     var TableBody = function()
     {
	this.template = 'jtk-table-body'
     }
     TableBody.prototype = new Element;

     var TableHeader = function()
     {
	this.template = 'jtk-table-header'
     }
     TableHeader.prototype = new Element;

     var jtk_elements =
	 {
	     frame: function(options) 
	     {
		 return new Frame;
	     },

	     element: function(options) 
	     {
		 return new Element;
	     },

	     panel: function(options) 
	     {
		 return new Panel;
	     },

	     popup: function(options) 
	     {
		 return new Popup;
	     },

	     widget: function(options) 
	     {
		 return new Widget;
	     },

	     title: function(options) 
	     {
		 return new Title;
	     },

	     label: function(options) 
	     {
		 return new Label;
	     },

	     list: function(options) 
	     {
		 return new List;
	     },

	     list_item: function(options) 
	     {
		 return new ListItem;
	     },

	     list_term: function(options) 
	     {
		 return new ListTerm;
	     },

	     list_description: function(options) 
	     {
		 return new ListDescription;
	     },

	     link: function(options) 
	     {
		 return new Link;
	     },

	     image: function(options) 
	     {
		 return new Image;
	     },

	     canvas: function(options) 
	     {
		 return new Canvas;
	     },

	     button: function(options) 
	     {
		 return new Button;
	     },

	     graph: function(options) 
	     {
		 return new Graph;
	     },

	     macro: function(options) 
	     {
		 return new Macro;
	     },

	     form: function(options) 
	     {
		 return new Form;
	     },

	     input: function(options) 
	     {
		 return new Input;
	     },

	     select: function(options) 
	     {
		 return new Select;
	     },

	     option: function(options) 
	     {
		 return new Option;
	     },

	     table: function(options) 
	     {
		 return new Table;
	     },

	     table_row: function(options) 
	     {
		 return new TableRow;
	     },

	     table_cell: function(options) 
	     {
		 return new TableCell;
	     },

	     table_row_group: function(options) 
	     {
		 return new TableRowGroup;
	     },
	     table_header: function(options) 
	     {
		 return new TableHeader;
	     },
	     table_body: function(options) 
	     {
		 return new TableBody;
	     },
	     menus: function(options) 
	     {
		 return new Menus;
	     },
	     menu: function(options) 
	     {
		 return new Menu;
	     },
	     menu_item: function(options) 
	     {
		 return new MenuItem;
	     },
	 }
     var jtk_methods = 
	 {
	     load: function(cb)
	     {
		 var templates = {}
		 for (var el in jtk_elements)
		 {
		     var element = jtk_elements[el]();
		     var template_url = element.getURL()
		     if (!(template_url in templates))
			 templates[template_url] = []
		     if (element.template && templates[template_url].indexOf(element.template) == -1)
			 templates[template_url].push(element.template)
		 }	

		 try{
		     $.jplates(templates,cb);		     
		 } catch (err) { console.log(err) }
	     }
	 }
	 
     $.extend(
	 {
	     jtk: function(method)
	     { 
		 if ( jtk_methods[method] ) {
		     return jtk_methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		 } else if ( jtk_elements[method] ) {
		     return jtk_elements[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		 } else if ( typeof method === 'object' || ! method ) {
		     return jtk_methods.init.apply( this, arguments );
		 } else {
		     $.error( 'Method ' +  method + ' does not exist on jQuery.jtk' );
		 }    	
	     },
	 });
 })( jQuery );


