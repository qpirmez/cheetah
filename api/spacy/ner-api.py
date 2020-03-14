import json, falcon
import spacy
from spacy import displacy
from waitress import serve

nlp = spacy.load('en_core_web_sm')

class HandleCORS(object):
    def process_request(self, req, resp):
        resp.set_header('Access-Control-Allow-Origin', '*')
        resp.set_header('Access-Control-Allow-Methods', '*')
        resp.set_header('Access-Control-Allow-Headers', '*')
        resp.set_header('Access-Control-Max-Age', 1728000)  # 20 days
        if req.method == 'OPTIONS':
            raise HTTPStatus(falcon.HTTP_200, body='\n')

class getEntities:
	def on_post(self,req,resp):
		if req.content_length:
		    data = json.load(req.stream)
		doc = nlp(data['text'])
		annotations = [{'start': ent.start_char, 'end': ent.end_char, 'type': ent.label_} for ent in doc.ents]
		resp.body = json.dumps(annotations)
				
class trainModel:
	def on_post(self,req,resp):
		if req.content_length:
		    data = json.load(req.stream)
		resp.body = json.dumps(data['dataToTrain'])
				
api = falcon.API(middleware=[HandleCORS() ])
api.add_route('/getEntities', getEntities())
api.add_route('/trainModel', trainModel())

serve(api,host='127.0.0.1',port=8000)