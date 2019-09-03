var textToMark = [
"Uber blew through 1 million a week",
"Android Pay expands to Canada",
"Who is Shaka Khan?",
"Facebook, Inc. is an American online social media and social networking service company",
"I like London and Berlin"
];
var txt;
var markedText;
var dataToTrain = [];	


window.onload = function() {
	sampleText = document.getElementById("sampleText");
	txt = textToMark.pop();
	sampleText.innerHTML = txt;
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

    		mark.setAttribute('data-entity',getLabel());
    		mark.setAttribute('start',startIndex);
    		mark.setAttribute('end',endIndex);    		
    			    		
    		var range = selection.getRangeAt(0);
    		range.deleteContents();
    		range.insertNode(mark);
    		
    	}
    }
    

}

function getMarkedText(){
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
		label = marks[i].attributes.getNamedItem("data-entity").value;
		markedText = markedText + '('+startIndex+', '+endIndex+', "'+label+'"),';
	}
	
	markedText = markedText.slice(0, -1);	
	markedText = markedText + ']})';
		
	return markedText;	
}

function send(dataToTrain) {
        if(typeof this.onStart === 'function') this.onStart();

        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://127.0.0.1:8000/number', true);
        xhr.setRequestHeader('Content-type', 'text/plain');

        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200) {
                if(typeof this.onSuccess === 'function') this.onSuccess();
                console.log(JSON.parse(xhr.responseText));
            }

            else if(xhr.status !== 200) {
                if(typeof this.onError === 'function') this.onError(xhr.statusText);
            }
        }

        xhr.onerror = () => {
            xhr.abort();
            if(typeof this.onError === 'function') this.onError();
        }

        xhr.send(JSON.stringify({ dataToTrain }));
}

function step2(){
	var step1 = document.getElementById("step1-uploading");
	var step2 = document.getElementById("step2-tagging");
	var completedStep = document.getElementById("step1");
	var activeStep = document.getElementById("step2");
	step1.style.display = "none";
	step2.style.display = "block";
	completedStep.classList.add("completed");
	activeStep.classList.add("active");

	
}

function step3(){
	var step2 = document.getElementById("step2-tagging");
	var step3 = document.getElementById("step3-confirm");
	var completedStep = document.getElementById("step2");
	var activeStep = document.getElementById("step3");
	var p;
	step2.style.display = "none";
	step3.style.display = "block";
	completedStep.classList.add("completed");
	activeStep.classList.add("active");

	dataToTrain.forEach(function(element) {
		p = document.createElement('p');
		p.textContent = element;
		step3.appendChild(p);	
	}); 

	send(dataToTrain);
}

function validateTagging(){	
	var sampleText = document.getElementById("sampleText");
	dataToTrain.push(getMarkedText());
	txt = textToMark.pop();
	sampleText.innerHTML = txt;
}

	
	
	
	
	
	