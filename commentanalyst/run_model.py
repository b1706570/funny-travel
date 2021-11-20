from flask import Flask
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS, cross_origin
import pickle

app = Flask(__name__)
api = Api(app)
CORS(app)

parser = reqparse.RequestParser()
parser.add_argument("text", type=str)

class CommentAnalyst(Resource):
    def post(self):
        try:
            model = pickle.load(open("model.pickle", "rb"))
            cv = pickle.load(open("countvector.pickle", "rb"))
            args = parser.parse_args()
            text = args['text']
            text = cv.transform([text])
            predict = model.predict(text)
            print(predict)
            return {
                'predict': predict[0]
            }
        except:
            return {
                'statusCode': 500,
                'message': 'INTERNAL SERVER ERROR!'
            }, 500



api.add_resource(CommentAnalyst, '/api/commentanalyst')

if __name__ == '__main__':
    app.run()