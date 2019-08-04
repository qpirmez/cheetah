'use strict';

{


   // UI

    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const defaultEnts = ['person', 'org', 'gpe', 'loc', 'product', 'date', 'time' ];
    const defaultModel = 'en_core_web_sm';

    const loading = () => document.body.classList.toggle('loading');
    const onError = (err) => $('#error').style.display = 'block';
    

    const displacy = new displaCyENT(
    	'http://127.0.0.1:8000/test', 
    	{container: '#displacy',
        onStart: loading,
        onSuccess: loading,
        onError: onError}
    );


    // Run Demo

    const run = (
        text = $('#input').value /*|| defaultText*/,
        ents = defaultEnts /*[...$$('[name="ents"]:checked')].map(ent => ent.value)*/,
        model = /*$('[name="model"]:checked').value ||*/ defaultModel ) => {
            displacy.parse(text, model, ents);
            updateView(text, model, ents);
            updateURL(text, model, ents);
    }


    // UI Event Listeners

    $('#submit').addEventListener('click', ev => run());
    $('#input').addEventListener('keydown', ev => (event.keyCode == 13) && run());


    // Update View

    const updateView = (text, model, ents) => {
        $('#input').value = text;
        //ents.forEach(ent => $(`[value="${ent}"]`).checked = true);
        //$(`[value="${model}"]`).checked = true;
    }


    // Update URL

    const updateURL = (text, model, ents) => {
        const params = { text, ents, model };
        const url = Object.keys(params).map(param => `${param}=${encodeURIComponent(params[param])}`);
        history.pushState(params, null, '?' + url.join('&'));
    }

}
