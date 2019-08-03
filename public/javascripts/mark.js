var sampleText;
var markedText;

window.onload = function() {
	sampleText = document.getElementById("sampleText");
	txt = sampleText.innerText;
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

/*function getStartEndSelection(selection){
    var offset = 0;
    var range = selection.getRangeAt(0);
    var start = range.startOffset;
    var end = range.endOffset;
    
    if ( selection.baseNode.parentNode.hasChildNodes() ) { 
        for ( var i = 0 ; selection.baseNode.parentNode.childNodes.length > i ; i++ ) { 
            var cnode = selection.baseNode.parentNode.childNodes[i];
            if (cnode.nodeType == document.TEXT_NODE) {
                if ( (offset + cnode.length) > start) {
                    break;
                }   
                offset = offset + cnode.length;
            }   
            if (cnode.nodeType == document.ELEMENT_NODE) {
                if ( (offset + cnode.textContent.length) > start) {
                    break;
                }   
                offset = offset + cnode.textContent.length;
            }   
        }   
    }   

    start = start + offset;
    end = end + offset;
    
    return [start,end];
}*/


function wrap(){
    var selection = snapSelectionToWord();
    var startIndex; //= getStartEndSelection(selection)[0];
    var endIndex; //= getStartEndSelection(selection)[1];    
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
		
		console.log("%cText: %c"+txt, "font-weight: bold","font-weight: normal; color: blue");
		console.log("%cIdx Str: %c"+startIndex, "font-weight: bold","font-weight: normal; color: blue");
		console.log("%cIdx End: %c"+endIndex, "font-weight: bold","font-weight: normal; color: blue");

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
	/*var sampleText = "";
	
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
	}*/
	
	//("I like London and Berlin.", {"entities": [(7, 13, "LOC"), (18, 24, "LOC")]}),
	
	markedText = '("'+txt+'", {"entities": [';

    console.log(markedText);			
	for (var i = 0; i < marks.length; i++) {
    	console.log(marks[i].childNodes[0].textContent); 
    	console.log(marks[i].childNodes[1].innerText); 
	}
	
}