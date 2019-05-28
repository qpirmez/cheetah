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

function getLabel(){
	
	var label;
	
	if (document.getElementById('radio1').checked) {
		label = document.getElementById('radio1').value;
	} else if (document.getElementById('radio2').checked) {
		label = document.getElementById('radio2').value;
	} else if (document.getElementById('radio3').checked) {
		label = document.getElementById('radio3').value;
	} else if (document.getElementById('radio4').checked) {
		label = document.getElementById('radio4').value;
	} else if (document.getElementById('radio5').checked) {
		label = document.getElementById('radio5').value;
	}
	
	return label;

}

function wrap(){
    var selection = snapSelectionToWord();
    var selection_text = selection.toString();
    var tag;
    var mark;
    var p;
    var text;
    var node;
    var spanText;
    var spanTag;
    
    
    if(selection){
       if(selection.anchorNode.parentNode.tagName == "MARK"){mark = selection.anchorNode.parentNode;} 
       else if(selection.anchorNode.nextSibling && selection.anchorNode.nextSibling.tagName == "MARK" ) {mark = selection.anchorNode.nextSibling;}
       else if(selection.focusNode.parentNode.tagName == "MARK"){mark = selection.focusNode.parentNode;}
       else if(selection.focusNode.nextSibling && selection.focusNode.nextSibling.tagName == "MARK"){mark = selection.focusNode.nextSibling;} 
    }  
    
    if(mark){
    	p = mark.parentNode;
    	text = mark.firstChild.data; 
    	node = document.createTextNode(text)
    	mark.parentNode.replaceChild(node, mark);   	
    } else {
    	//Add a span around the selected text?
    	if (selection_text.length > 0){
    		mark = document.createElement('mark');
    		spanText = document.createElement('span');
    		spanTag = document.createElement("span"); 
  		
  		    mark.textContent = selection_text;
    		mark.classList.add("c0137");
    			
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
	var sampleText = "";
	if (p.childElementCount > 0){
		for (let node of p.childNodes) {
		  if(node.nodeType == 3){
		  	sampleText = sampleText+""+node.textContent; 
		  } else if (node.nodeType == 1){
		  	sampleText = sampleText+""+node.childNodes[0].textContent; 
		  }		  
		}
		console.log(sampleText);		
	} else {
		console.log(p.textContent);
	}
}