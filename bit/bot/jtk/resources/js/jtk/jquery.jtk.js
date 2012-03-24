(function ($) {
    "use strict";
    var Element, Macro, Widget, Panel, Frame, Popup, Graph, Image, Title, Canvas, Label, Link, Button, List, ListTerm, ListDescription, ListItem, Form, Menu, Menus, MenuItem, Input, Select, Option, Table, TableRow, TableRowGroup, TableCell, TableBody, TableHeader, jtk_elements, jtk_methods;
    Element = function () {
        this.template = 'jtk-element';
        this.type = 'element';
        var $this = this;
        this.guid = function () {
            return $this.ctx.data('session');
        };
        this.getURL = function () {
            return '/jplates/jtk-elements.html';
        };
        this.frame = function () {
            return this.ctx.data('frame');
        };
        this.init = function (ctx) {
            this.kids = {};
            this.parent = {};
            this.ctx = ctx;
            //this.uid = this.guid()
            this.params = {};
            this.templates = this.templates || {};
            this.model = {};
            return this;
        };
        this.loadTemplates = function (cb) {
            var template, templates, i;
            templates = this.templates || {};
            if (this.getURL) {
                this.template_url = this.getURL();
            }
            if (this.template_url) {
                if (templates[this.template_url] && !(templates[this.template_url][this.template])) {
                    templates[this.template_url].push(this.template);
                } else {
                    templates[this.template_url] = [this.template];
                }
            }
            if (templates) {
                $.jplates(templates, cb, this.debug);
            }
            return this;
        };

        this.added = function () {
            return this.after_add();
        };

        this.add_bindings = function () {
        };

        this.adding = function () {
        };

        this.after_add = function () {
        };

        this.destroy = function (name) {
            // i dont think this is right
            this.element.find('.' + name).remove();
            this.remove(name);
        };

        this.remove = function (name) {
            delete this.kids[name];
        };

        /* add a child object to this element */
        this.add = function (name, jtkel, el, cb, pos) {
            var loaded, $this;
            if (this.debug && this.debug === true) {
                console.log('container');
                console.log(el);
            }
            $this = this;
            if (!jtkel.params) {
                jtkel.params = {};
            }
            if (!el) {
                el = this.$;
            }
            if (jtkel.klass) {
                jtkel.params.class_ = jtkel.klass;
            }
            if (jtkel.kontent) {
                jtkel.params.content_ = jtkel.kontent;
            }
            if (jtkel.src) {
                jtkel.params.src = jtkel.src;
            }
            if (jtkel.href) {
                jtkel.params.href = jtkel.href;
            }
            if (jtkel.alt) {
                jtkel.params.alt = jtkel.alt;
            }
            if (jtkel.colspan) {
                jtkel.params.colspan = jtkel.colspan;
            }
            if (jtkel.subtype && !jtkel.params.type) {
                jtkel.params.type = jtkel.subtype;
            }
            try {
                jtkel.adding();
            } catch (err) {
                console.log('FAILED');
                console.log(jtkel);
                jtkel.adding();
            }
            loaded = function (_jtk) {
                console.log('jtk: loaded ', _jtk);
                _jtk.name = name;
                $this.kids[name] = _jtk;
                _jtk.parent = $this;
                _jtk.add_bindings();
                _jtk.added();
                if (cb) {
                    cb(_jtk);
                }
            };
            jtkel.name = name;
            try {
                if (this.debug && this.debug === true) {
                    console.log('adding ' + name + ' to ' + this.name);
                }
                jtkel.render(el, loaded, pos);
            } catch (e) {
                console.log(e);
            }
            return this;
        };

        this.has_child = function (child) {
            var result;
            if (this.kids[child]) {
                result = true;
            } else {
                result = false;
            }
            return result;
        };

        this.toggle = function (content, class_) {
            this.element.toggleClass(class_);
            return this;
        };

        this.hide = function (content) {
            this.element.toggleClass('hidden', true);
            return this;
        };

        this.waiting = function (start) {
            if (start === true) {
                console.log(this.parent.element);
            }
        };

        this.hidden = function (content) {
            return this.$.hasClass('hidden');
        };

        this.show = function (content) {
            this.$.toggleClass('hidden', false);
            return this;
        };

        this.update_kids = function () {
            var counter, $this, child, update_all, cb, container, i;
            counter = 0;
            $this = this;

            // i think remove this
            if (!this.model) {
                for (child in this.kids) {
                    if (this.kids.hasOwnProperty(child)) {
                        this.kids[child].update();
                    }
                }
                return this;
            }

            update_all = function () {
                var child;
                for (child in $this.kids) {
                    if ($this.kids.hasOwnProperty(child)) {
                        $this.kids[child].update();
                    }
                }
            };

            cb = function () {
                counter -= 1;
                if (counter === 0) {
                    update_all();
                }
            };
            for (child in this.model) {
                if (this.model.hasOwnProperty(child)) {
                    if (!this.has_child(child)) {
                        if (this.model[child].selector) {
                            container = this.model[child].selector();
                        } else {
                            container = this.$;
                        }
                        counter += 1;
                        try {
                            this.add(child,
                                     this.model[child].child.apply(this, this.model[child].args),
                                     container,
                                     cb);
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            }
            if (counter === 0) {
                update_all();
            }
            return this;
        };

        this.update = function () {
            try {
                if (this.update_data) {
                    this.update_data();
                }
                if (this.update_kids) {
                    this.update_kids();
                }
                if (this.update_content) {
                    this.update_content();
                }
            } catch (err) {
                console.log(err);
            }
            return this;
        };

        this.load = function (content, cb) {
            this.render(content, cb);
            return this;
        };

        this.render = function (content, cb, pos) {
            var template, params, $this;
            if (this.debug && this.debug === true) {
                console.log('rendering ' + this.name);
            }
            template = this.template;
            params = this.params || {};
            params.name = params.name || this.name;
            params.id_ = params.id_ || this.id || this.uid;
            $this = this;
            this.loadTemplates(
                function () {
                    var element;
                    element = $.tmpl(template, params);
                    $this.element = element;
                    $this.$ = element;
                    if (pos === 0) {
                        if ($this.debug && $this.debug === true) {
                            console.log('prepending ' + element.html());
                        }
                        element.prependTo(content);
                    } else {
                        if ($this.debug && $this.debug === true) {
                            console.log(element);
                            console.log('appending ' + element.html());
                        }
                        element.appendTo(content);
                    }
                    if ($this.update) {
                        $this.update($this);
                    }
                    if (cb) {
                        cb($this);
                    }
                }
            );
            return this;
        };
        return this;
    };

    Widget = function () {
        this.template = 'jtk-widget';
    };
    Widget.prototype = new Element;

    Macro = function () {
        this.load = function (content, vars, cb) {
            this.render(content, vars, cb);
            return this;
        };

        this.render = function (content, cb) {
            var template, update, params, $this;
            template = this.template;
            update = this.update;
            params = this.params || {};
            params.name = this.name;
            $this = this;
            this.loadTemplates(
                function () {
                    var element = $.tmpl(template, params);
                    element.appendTo(content);
                    $this.element = element;
                    $this.$ = element;
                    if (cb) {
                        cb($this);
                    }
                }
            );
            return this;
        };
        return this;
    };
    Macro.prototype = new Element;

    Panel = function () {
        this.type = 'panel';
        this.template = 'jtk-panel';
    };
    Panel.prototype = new Element;

    Frame = function () {
        var $this;
        this.kids = {};
        this.type = 'frame';
        this.template = 'jtk-frame';
        $this = this;
        this.guid = function () {
            return $this.ctx.data('session');
        };

        /* attach the frame to a jquery object */
        this.attach = function (content, name, cb, pos) {
            var $this, loaded;
            this.parent = content;
            this.ctx = content;
            this.name = name;
            this.ctx.data('frame', this);
            $this = this;
            //console.log('attaching ' + name + ' to ' + content)
            loaded = function (el) {
                //console.log('done: attaching ' + name + ' to ' + content)
                $this.element = el;
                $this.$ = el;
                if (cb) {
                    cb($this);
                }
            };
            this.render(this.ctx, loaded, pos);
            return this;
        };

        /* load the templates associated with this element and attach them to the parent content */
        this.render = function (content, cb, pos) {
            var template, update, update_data, params;
            template = this.template;
            update = this.update;
            update_data = this.update_data;
            params = this.params || {};
            params.name = this.name;
            this.loadTemplates(
                function () {
                    var frame;
                    content.html('');
                    frame = $.tmpl(template, params).appendTo(content);
                    if (update) {
                        update(frame);
                    }
                    if (cb) {
                        cb(frame);
                    }
                }
            );
        };
        return this;
    };
    Frame.prototype = new Element;

    Popup = function () {
        this.kids = {};
        this.parent = {};
        this.template = 'jtk-popup';

        /* attach the popup to a jquery object */
        this.attach = function (ctx, content, name, cb) {
            var $this, loaded;
            this.parent = content;
            this.ctx = ctx;
            this.name = name;
            $this = this;
            loaded = function (el) {
                if (cb) {
                    cb($this);
                }
            };
            this.render(content.element, loaded);
            return this;
        };

        /* load the templates associated with this element and attach them to the parent content */
        this.render = function (content, cb) {
            var template, update, params, $this;
            template = this.template;
            update = this.update;
            params = this.params || {};
            params.name = this.name;
            $this = this;
            this.loadTemplates(function () {
                var element;
                element = $.tmpl(template, params);
                element.appendTo(content);
                $this.element = element;
                $this.$ = element;
                if (cb) {
                    cb($this);
                }
            });
        };
    };
    Popup.prototype = new Element;

    Graph = function () {
    };
    Graph.prototype = new Element;

    Title = function () {
        this.template = 'jtk-title';
    };
    Title.prototype = new Element;

    Image = function () {
        this.template = 'jtk-image';
    };
    Image.prototype = new Element;

    Canvas = function () {
        this.template = 'jtk-canvas';
    };
    Canvas.prototype = new Element;

    Label = function () {
        this.template = 'jtk-label';
    };
    Label.prototype = new Element;

    Link = function () {
        this.template = 'jtk-link';
    };
    Link.prototype = new Element;

    Button = function () {
        this.subtype = 'link';
        this.template = 'jtk-button';
    };
    Button.prototype = new Element;

    List = function () {
        this.subtype = "unordered";
        this.template = 'jtk-list';
    };
    List.prototype = new Element;

    ListTerm = function () {
        this.template = 'jtk-list-term';
    };
    ListTerm.prototype = new Element;

    ListDescription = function () {
        this.template = 'jtk-list-description';
    };
    ListDescription.prototype = new Element;

    ListItem = function () {
        this.template = 'jtk-list-item';
    };
    ListItem.prototype = new Element;

    Form = function () {
        this.template = 'jtk-form';
    };
    Form.prototype = new Element;

    Menus = function () {
        this.subtype = "definition";
        this.template = 'jtk-list';
        this.adding = function () {
            this.params.class_ += ' dropdown-menus';
        };
    };
    Menus.prototype = new List;

    Menu = function () {
        var $this = this;
        this.title = '';
        this.id = '';
        this.items = {};
        this.added = function () {
            var title, title_link, menu_content, menu_list, item, offset_left, i;
            $this.id = $this.title.toLowerCase().replace('-', '');
            title = new ListTerm().init($this.ctx);
            title_link = new Link().init($this.ctx);
            menu_content = new ListDescription().init($this.ctx);
            title_link.kontent = $this.title;
            title_link.href = '#' + $this.id;

            title.model.link = {
                child: function () {
                    return title_link;
                }
            };

            $this.debug = true;
            $this.model.title = {
                child: function () {
                    return title;
                },
                selector: function () {
                    return $this.parent.$;
                }
            };

            $this.model.menu = {
                child: function () {
                    return menu_content;
                },
                selector: function () {
                    return $this.parent.$;
                }
            };

            menu_list = new List().init($this.ctx);
            for (i = 0; i < $this.items.length; i += 1) {
                item = $this.items[i];
                menu_list.model[item] = $this.items[item];
            }

            menu_content.model['menu-list'] = {
                child: function () {
                    return menu_list;
                }
            };

            menu_content.added = function () {
                menu_content.hide();
            };

            $this.ctx.signal('listen', 'toggle-menu-' + $this.title, function () {
                var i, menu;
                if (menu_content.hidden()) {
                    menu_content.show();
                    offset_left = title.$.offset().left;
                    menu_content.$.offset({left: offset_left});
                    for (i = 0; i < $this.parent.kids.length; i += 1) {
                        menu = $this.parent.kids[i];
                        if ($this.parent.kids[menu] !== $this) {
                            $this.parent.kids[menu].kids.menu.hide();
                        }
                    }
                } else {
                    menu_content.hide();
                }
            });
            title_link.add_bindings = function () {
                title_link.$.click(function (evt) {
                    evt.preventDefault();
                    $this.ctx.signal('emit', 'toggle-menu-' + $this.title, '');
                });
            };
            $this.update();
        };
    };
    Menu.prototype = new Element;

    MenuItem = function () {
        var $this, title_link;
        $this = this;
        this.title = '';
        this.id = '';
        this.adding = function () {
            $this.id = $this.title.toLowerCase().replace('-', '');
            title_link = new Link().init($this.ctx);
            title_link.href = '#' + $this.id;
            title_link.kontent = $this.title;
            $this.model.link = {
                child: function () {
                    return title_link;
                }
            };

            $this.add_bindings = function () {
            };
        };
    };
    MenuItem.prototype = new ListItem;

    Input = function () {
        this.template = 'jtk-input';
        var $this = this;
        this.hint = function (ele) {
            ele.focus(function () {
                if (ele.val() === ele.attr('title')) {
                    ele.val('').removeClass('hint');
                }
            }).blur(function () {
                if (ele.val() === '') {
                    ele.val(ele.attr('title')).addClass('hint');
                }
            });
        };
    };
    Input.prototype = new Element;

    Select = function () {
        this.template = 'jtk-select';
    };
    Select.prototype = new Element;

    Option = function () {
        this.template = 'jtk-option';
    };
    Option.prototype = new Element;

    Table = function () {
        this.template = 'jtk-table';
    };
    Table.prototype = new Element;

    TableRow = function () {
        this.template = 'jtk-table-row';
    };
    TableRow.prototype = new Element;

    TableRowGroup = function () {
        this.template = 'jtk-table-row-group';
    };
    TableRowGroup.prototype = new Element;

    TableCell = function () {
        this.template = 'jtk-table-cell';
    };
    TableCell.prototype = new Element;

    TableBody = function () {
        this.template = 'jtk-table-body';
    };
    TableBody.prototype = new Element;

    TableHeader = function () {
        this.template = 'jtk-table-header';
    };

    TableHeader.prototype = new Element;

    jtk_elements = {
        frame: function (options) {
            return new Frame;
        },

        element: function (options) {
            return new Element;
        },

        panel: function (options) {
            return new Panel;
        },

        popup: function (options) {
            return new Popup;
        },

        widget: function (options) {
            return new Widget;
        },

        title: function (options) {
            return new Title;
        },

        label: function (options) {
            return new Label;
        },

        list: function (options) {
            return new List;
        },

        list_item: function (options) {
            return new ListItem;
        },

        list_term: function (options) {
            return new ListTerm;
        },

        list_description: function (options) {
            return new ListDescription;
        },

        link: function (options) {
            return new Link;
        },

        image: function (options) {
            return new Image;
        },

        canvas: function (options) {
            return new Canvas;
        },

        button: function (options) {
            return new Button;
        },

        graph: function (options) {
            return new Graph;
        },

        macro: function (options) {
            return new Macro;
        },

        form: function (options) {
            return new Form;
        },

        input: function (options) {
            return new Input;
        },

        select: function (options) {
            return new Select;
        },

        option: function (options) {
            return new Option;
        },

        table: function (options) {
            return new Table;
        },

        table_row: function (options) {
            return new TableRow;
        },

        table_cell: function (options) {
            return new TableCell;
        },

        table_row_group: function (options) {
            return new TableRowGroup;
        },

        table_header: function (options) {
            return new TableHeader;
        },

        table_body: function (options) {
            return new TableBody;
        },

        menus: function (options) {
            return new Menus;
        },

        menu: function (options) {
            return new Menu;
        },

        menu_item: function (options) {
            return new MenuItem;
        }
    };

    jtk_methods = {
        load: function (cb) {
            var templates, el, element, template_url;
            templates = {};
            for (el in jtk_elements) {
                if (jtk_elements.hasOwnProperty(el)) {
                    element = jtk_elements[el]();
                    template_url = element.getURL();
                    if (!(templates[template_url])) {
                        templates[template_url] = [];
                    }
                    if (element.template && templates[template_url].indexOf(element.template) === -1) {
                        templates[template_url].push(element.template);
                    }
                }
            }

            try {
                $.jplates(templates, cb);
            } catch (err) {
                console.log(err);
            }
        }
    };

    $.extend({
        jtk: function (method) {
            var result;
            if (jtk_methods[method]) {
                result = jtk_methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (jtk_elements[method]) {
                result = jtk_elements[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (typeof method === 'object' || !method) {
                result = jtk_methods.init.apply(this, arguments);
            } else {
                result = $.error('Method ' +  method + ' does not exist on jQuery.jtk');
            }
            return result;
        }
    });
}(jQuery));
