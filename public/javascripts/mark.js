var sampleText;
var markedText;

window.onload = function() {
	sampleText = document.getElementById("sampleText");
	txt = sampleText.innerText;
	buildLabelMenu();

};




// Simple selection function
function snapSelectionToWord() {
    var sel;

    // Check for existence of window.getSelection() and that it has a
    // modify() method. IE 9 has both selection APIs but no modify() method.
    if (window.getSelection && (sel = window.getSelection()).modify) {
        sel = window.getSelection();
        if (!sel.isCollapsed) {

            // Detect if selection is backwards
            var range = document.createRange();
            range.setStart(sel.anchorNode, sel.anchorOffset);
            range.setEnd(sel.focusNode, sel.focusOffset);
            var backwards = range.collapsed;
            range.detach();

            // modify() works on the focus of the selection
            var endNode = sel.focusNode, endOffset = sel.focusOffset;
            sel.collapse(sel.anchorNode, sel.anchorOffset);
            
            var direction = [];
            if (backwards) {
                direction = ['backward', 'forward'];
            } else {
                direction = ['forward', 'backward'];
            }

            sel.modify("move", direction[0], "character");
            sel.modify("move", direction[1], "word");
            sel.extend(endNode, endOffset);
            sel.modify("extend", direction[1], "character");
            sel.modify("extend", direction[0], "word");
        }
        return sel;
    } else if ( (sel = document.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        if (textRange.text) {
            textRange.expand("word");
            // Move the end back to not include the word's trailing space(s),
            // if necessary
            while (/\s$/.test(textRange.text)) {
                textRange.moveEnd("character", -1);
            }
            return textRange.select();
        }
    }
}

function addLabel(label){
	
	var inputElement = document.createElement("input");
    inputElement.setAttribute("type", "radio");
    inputElement.setAttribute("id", label);
    inputElement.setAttribute("name", "radios");
    inputElement.setAttribute("value", label);
    
    var labelElement = document.createElement("label");
    var labelName = document.createTextNode(label);
    labelElement.setAttribute("for", label);
    labelElement.appendChild(labelName);

    document.getElementById("tagger-radio-toolbar").appendChild(inputElement);
    document.getElementById("tagger-radio-toolbar").appendChild(labelElement);


}

function buildLabelMenu(){
    var labels = ['person', 'org', 'gpe', 'loc', 'product', 'date', 'time' ];
	labels.forEach(addLabel);
}

function getLabel(){

	var label;

	var list= document.getElementById("tagger-radio-toolbar").getElementsByTagName("input");
	for (var i = 0; i < list.length; i++) {	    
	    if(list[i].checked == true){
	    	label = list[i].value;
	    	return label;
	    }
	}
		
	//if (document.getElementById('radio1').checked) {
	//	label = document.getElementById('radio1').value;
	//} else if (document.getElementById('radio2').checked) {
	//	label = document.getElementById('radio2').value;
	//} else if (document.getElementById('radio3').checked) {
	//	label = document.getElementById('radio3').value;
	//} else if (document.getElementById('radio4').checked) {
	//	label = document.getElementById('radio4').value;
	//} else if (document.getElementById('radio5').checked) {
	//	label = document.getElementById('radio5').value;
	//}
	
	//return label;

}


function wrap(){
    var selection = snapSelectionToWord();
    var startIndex; 
    var endIndex;     
    var selection_text = selection.toString();
    var tag;
    var mark;
    var p;
    var text;
    var node;
    var spanTag;
    
	
	if (selection_text != ""){
		startIndex = txt.indexOf(selection_text);
		endIndex = txt.indexOf(selection_text)+selection_text.length;
		
		//console.log("%cText: %c"+txt, "font-weight: bold","font-weight: normal; color: blue");
		//console.log("%cIdx Str: %c"+startIndex, "font-weight: bold","font-weight: normal; color: blue");
		//console.log("%cIdx End: %c"+endIndex, "font-weight: bold","font-weight: normal; color: blue");

	}

    
    if(selection){
       if(selection.anchorNode.parentNode.tagName == "MARK"){mark = selection.anchorNode.parentNode;} 
       else if(selection.anchorNode.nextSibling && selection.anchorNode.nextSibling.tagName == "MARK" ) {mark = selection.anchorNode.nextSibling;}
       else if(selection.focusNode.parentNode.tagName == "MARK"){mark = selection.focusNode.parentNode;}
       else if(selection.focusNode.nextSibling && selection.focusNode.nextSibling.tagName == "MARK"){mark = selection.focusNode.nextSibling;} 
    }  
        

    if(mark){
    	text = mark.firstChild.data; 
    	node = document.createTextNode(text)
    	mark.parentNode.replaceChild(node, mark); 

    } else {
    	//Add a span around the selected text?
    	if (selection_text.length > 0){
    		mark = document.createElement('mark');
    		spanTag = document.createElement("span"); 
  		
  		    mark.textContent = selection_text;
    		mark.classList.add("c0137");
    		mark.setAttribute('start',startIndex);
    		mark.setAttribute('end',endIndex);    		
    			
    		spanTag.textContent = getLabel();
    		spanTag.classList.add("c0141");
    		mark.appendChild(spanTag);
    		
    		var range = selection.getRangeAt(0);
    		range.deleteContents();
    		range.insertNode(mark);
    		
    	}
    }
    

}


function accept(){
	var p = document.getElementById("sampleText");
	var marks = p.getElementsByTagName("MARK");
	var startIndex;
	var endIndex;
	var label;
	
	//("I like London and Berlin.", {"entities": [(7, 13, "LOC"), (18, 24, "LOC")]}),
	
	markedText = '("'+txt+'", {"entities": [';
    		
	for (var i = 0; i < marks.length; i++) {
		startIndex = marks[i].attributes.getNamedItem("start").value;
		endIndex = marks[i].attributes.getNamedItem("end").value;
		label = marks[i].childNodes[1].innerText;		
		markedText = markedText + '('+startIndex+', '+endIndex+', "'+label+'"),';
	}
	
	markedText = markedText.slice(0, -1);
	
	markedText = markedText + ']})';	
	console.log(markedText);
	
}