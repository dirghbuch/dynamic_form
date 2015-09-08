

	function makeDraggable() {
		$(".selectorField").draggable({ helper: "clone",stack: "div",cursor: "move", cancel: null });
	}

	var _ctrl_index = 1001;
	function docReady() {
		compileTemplates();
		
		makeDraggable();
		
		$( ".droppedFields" ).droppable({
			  activeClass: "activeDroppable",
			  hoverClass: "hoverDroppable",
			  accept: ":not(.ui-sortable-helper)",
			  handle: "label",
			  drop: function( event, ui ) {
				var draggable = ui.draggable;				
				draggable = draggable.clone();
				draggable.removeClass("selectorField");
				draggable.addClass("droppedField");
				$("<a href='#' class='label btn-primary modify'>modify</a>").appendTo(draggable);
				draggable[0].id = "CTRL-DIV-"+(_ctrl_index++); 
				draggable.appendTo(this);				
				draggable.find('.modify').click(function () {
						var me = $(this).parent();
						var ctrl = me.find("[class*=ctrl]")[0];
						var ctrl_type = $.trim(ctrl.className.match("ctrl-.*")[0].split(" ")[0].split("-")[1]);
						customize_ctrl(ctrl_type, $(this).parent().attr('id'));
				});
				makeDraggable();
				draggable.find('.modify').trigger('click');
			}
		});		
	}
	

	function submit() {
		var data = {} ;

		$("div[id^='CTRL-DIV-']").each(function(div) {
			var selectedInput = $(this).find("[class^='ctrl-']");
			var name = selectedInput.attr("name");
			var selectedValue = "";
			if(selectedInput.find('input').is(":checkbox") || selectedInput.find('input').is(":radio")){
				selectedInput = selectedInput.find('input');
				name = selectedInput.attr("name");
				selectedInput.each(function () {
				        selectedValue = selectedValue + (this.checked ? $(this).val()+"," : "");
				  });
			} else {
				selectedValue = selectedInput.val();
			}
			data[name] = { label : $(this).find('.control-label').text(), value : selectedValue };
		});
		$.ajax({
			method: "POST",
			url: "save.php",
			data: $.param(data),
			dataType: "json",
		})
		.done(function( data ) {
			var val = "<p>";
			$.each(data,function(field, value){
				val += value.label + " : " + value.value + "<br/>";
			})
			val += "</p> <hr/>";
			$(".output").append(val);
		});
	}
		
	if(typeof(console)=='undefined' || console==null) { console={}; console.log=function(){}}
	
	function delete_ctrl() {
		if(window.confirm("Are you sure about this?")) {
			var ctrl_id = $("#theForm").find("[name=forCtrl]").val()
			$("#"+ctrl_id).remove();
		}
	}
	
	function compileTemplates() {
		window.templates = {};
		window.templates.common = Handlebars.compile($("#control-customize-template").html());
		
		
		
		window.templates.textbox = Handlebars.compile($("#textbox-template").html());
		window.templates.passwordbox = Handlebars.compile($("#textbox-template").html());
		window.templates.combobox = Handlebars.compile($("#combobox-template").html());
		window.templates.selectmultiplelist = Handlebars.compile($("#combobox-template").html());
		window.templates.radiogroup = Handlebars.compile($("#combobox-template").html());
		window.templates.checkboxgroup = Handlebars.compile($("#combobox-template").html());
		
	}
	
	save_changes = {};
	
	load_values = {};
	
	
	load_values.common = function(ctrl_type, ctrl_id) {
		var form = $("#theForm");
		var div_ctrl = $("#"+ctrl_id);
		
		form.find("[name=label]").val(div_ctrl.find('.control-label').text())
		var specific_load_method = load_values[ctrl_type];
		if(typeof(specific_load_method)!='undefined') {
			specific_load_method(ctrl_type, ctrl_id);		
		}
	}
	
	
	
	load_values.textbox = function(ctrl_type, ctrl_id) {
		var form = $("#theForm");
		var div_ctrl = $("#"+ctrl_id);
		var ctrl = div_ctrl.find("input")[0];
		form.find("[name=name]").val(ctrl.name)		
		form.find("[name=placeholder]").val(ctrl.placeholder)		
	}
	
	load_values.passwordbox = load_values.textbox;

	
	load_values.combobox = function(ctrl_type, ctrl_id) {
		var form = $("#theForm");
		var div_ctrl = $("#"+ctrl_id);
		var ctrl = div_ctrl.find("select")[0];
		form.find("[name=name]").val(ctrl.name)
		var options= '';
		$(ctrl).find('option').each(function(i,o) { options+=o.text+'\n'; });
		form.find("[name=options]").val($.trim(options));
	}

	load_values.selectmultiplelist = load_values.combobox;
	
	
	load_values.radiogroup = function(ctrl_type, ctrl_id) {
		var form = $("#theForm");
		var div_ctrl = $("#"+ctrl_id);
		var options= '';
		var ctrls = div_ctrl.find("div").find("label");
		var radios = div_ctrl.find("div").find("input");
		
		ctrls.each(function(i,o) { options+=$(o).text()+'\n'; });
		form.find("[name=name]").val(radios[0].name)
		form.find("[name=options]").val($.trim(options));
	}
	
	load_values.checkboxgroup = load_values.radiogroup;
	
	load_values.btn = function(ctrl_type, ctrl_id) {
		var form = $("#theForm");
		var div_ctrl = $("#"+ctrl_id);
		var ctrl = div_ctrl.find("button")[0];
		form.find("[name=name]").val(ctrl.name)		
		form.find("[name=label]").val($(ctrl).text().trim())		
	}
		
	save_changes.common = function(values) {
		var div_ctrl = $("#"+values.forCtrl);
		div_ctrl.find('.control-label').text(values.label);
		var specific_save_method = save_changes[values.type];
		if(typeof(specific_save_method)!='undefined') {
			specific_save_method(values);		
		}
	}
	
	save_changes.textbox = function(values) {
		var div_ctrl = $("#"+values.forCtrl);
		var ctrl = div_ctrl.find("input")[0];
		ctrl.placeholder = values.placeholder;
		ctrl.name = values.name;
	}

	save_changes.passwordbox= save_changes.textbox;

	save_changes.combobox = function(values) {
		var div_ctrl = $("#"+values.forCtrl);
		var ctrl = div_ctrl.find("select")[0];
		ctrl.name = values.name;
		$(ctrl).empty();
		$(values.options.split('\n')).each(function(i,o) {
			$(ctrl).append("<option value='"+$.trim(o)+"'>"+$.trim(o)+"</option>");
		});
	}
	
	save_changes.radiogroup = function(values) {
		var div_ctrl = $("#"+values.forCtrl);
		
		var label_template = $(".selectorField .ctrl-radiogroup label")[0];
		var radio_template = $(".selectorField .ctrl-radiogroup input")[0];
		
		var ctrl = div_ctrl.find(".ctrl-radiogroup");
		ctrl.empty();
		$(values.options.split('\n')).each(function(i,o) {
			var label = $(label_template).clone().text($.trim(o));
			var radio = $(radio_template).clone();
			radio[0].name = values.name;
			radio[0].value = o;
			label.append(radio);
			$(ctrl).append(label);
		});
	}
	
	save_changes.checkboxgroup = function(values) {
		var div_ctrl = $("#"+values.forCtrl);
		
		var label_template = $(".selectorField .ctrl-checkboxgroup label")[0];
		var checkbox_template = $(".selectorField .ctrl-checkboxgroup input")[0];
		
		var ctrl = div_ctrl.find(".ctrl-checkboxgroup");
		ctrl.empty();
		$(values.options.split('\n')).each(function(i,o) {
			var label = $(label_template).clone().text($.trim(o));
			var checkbox = $(checkbox_template).clone();
			checkbox[0].name = values.name;
			checkbox[0].value = o;
			label.append(checkbox);
			$(ctrl).append(label);
		});
	}
	
	save_changes.selectmultiplelist = save_changes.combobox;
	
	save_changes.btn = function(values) {
		var div_ctrl = $("#"+values.forCtrl);
		var ctrl = div_ctrl.find("button")[0];
		$(ctrl).html($(ctrl).html().replace($(ctrl).text()," "+$.trim(values.label)));
		ctrl.name = values.name;
	}

	
	function save_customize_changes(e, obj) {
		var formValues = {};
		var val=null;
		$("#theForm").find("input, textarea").each(function(i,o) {
			if(o.type=="checkbox"){
				val = o.checked;
			} else {
				val = o.value;
			}
			formValues[o.name] = val;
		});
		save_changes.common(formValues);
	}
	
	function customize_ctrl(ctrl_type, ctrl_id) {
		var ctrl_params = {};
		var specific_template = templates[ctrl_type];
		if(typeof(specific_template)=='undefined') {
			specific_template = function(){return ''; };
		}
		var modal_header = $("#"+ctrl_id).find('.control-label').text();
		
		var template_params = {
			header:modal_header, 
			content: specific_template(ctrl_params), 
			type: ctrl_type,
			forCtrl: ctrl_id
		}
		
		var s = templates.common(template_params)+"";
		
		
		$("[name=customization_modal]").remove(); 
		$('<div id="customization_modal" name="customization_modal" class="modal hide fade" />').append(s).modal('show');
		setTimeout(function() {
			load_values.common(ctrl_type, ctrl_id);
		},300);
	}
