// Simple selection function
function getSelectedText() {
  t = (document.all) ? document.selection.createRange().text : document.getSelection();

  return t;
}

// More evolved selection function (
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
            return sel;
        }
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
    
    return '';
}


$('#sampleText').mouseup(function(){
    var selection = snapSelectionToWord();
    var selection_text = selection.toString();
    var tag = selection ? selection.baseNode.parentNode.tagName : null;
    
    console.log(tag);
            
    if(tag == "MARK"){
    	var mark = selection.baseNode.parentNode;
    	var text = selection.baseNode.textContent;    	
    	var node = document.createTextNode(text)
    	mark.parentNode.replaceChild(node, mark);   	
    } else {
    	//Add a span around the selected text?
    	if ($.trim(selection_text).length > 0){
    		var mark = document.createElement('mark');
    		var spanText = document.createElement('span');
    		var spanTag = document.createElement("span"); 
  		
  		    mark.textContent = selection_text;
    		//spanText.textContent = selection_text;
    		mark.classList.add("c0137");
    		//mark.appendChild(spanText);
    			
    		spanTag.textContent = "AAA";
    		spanTag.classList.add("c0141");
    		mark.appendChild(spanTag);
    		
    		var range = selection.getRangeAt(0);
    		range.deleteContents();
    		range.insertNode(mark);
    	}
    }
    

});
