# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []

from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import mysql.connector
from mysql.connector import Error

config = {
    'user': 'root',
    'password': 'mysql',
    'host': '127.0.0.1',
    'database': 'traveldb',
}

class ActionFindLocation(Action):
    def name(self) -> Text:
        return "action_find_room_in_location"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain):
        try:
            connect = mysql.connector.connect(host='127.0.0.1', user='root', password='', database='traveldb')
            if connect.is_connected():
                cursor = connect.cursor()
                cursor.execute("select database();")
                record = cursor.fetchall()
                dispatcher.utter_message(record[0][0])
                cursor.close()
            connect.close()
        except Error as e:
            dispatcher.utter_message(e)