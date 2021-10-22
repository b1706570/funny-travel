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
            entities = tracker.latest_message['entities']
            keyword = entities[0]['value']
            connect = mysql.connector.connect(host='127.0.0.1', user='root', password='', database='traveldb')
            if connect.is_connected():
                cursor = connect.cursor()
                #cursor.execute("SELECT r.`images_room`, h.`company_name`, h.`address_host`, h.`id_host`, ROUND(AVG(e.`point`), 1) point FROM `rooms` r JOIN `host` h ON r.`id_host` = h.`id_host` JOIN `evaluate` e ON e.`id_host` = h.`id_host` WHERE h.`address_host` LIKE '%" + keyword + "%' GROUP BY r.`id_host` ORDER BY point DESC LIMIT 0,3")
                cursor.execute("SELECT r.`images_room`, h.`company_name`, h.`address_host`, h.`id_host`, ROUND(AVG(e.`point`), 1) point FROM `rooms` r JOIN `host` h ON r.`id_host` = h.`id_host` JOIN `evaluate` e ON e.`id_host` = h.`id_host` WHERE h.`address_host` LIKE '%" + keyword + "%' GROUP BY r.`id_host` LIMIT 0,3")
                result = cursor.fetchall()
                if len(result) == 0:
                    dispatcher.utter_message("Rất tiếc hệ thống không có khách sạn ở địa chỉ bạn vừa tìm")
                else:
                    dispatcher.utter_message("Bạn tham khảo các khách sạn ở " + str(keyword) + " nhé")
                    for item in result:
                        response = {}
                        response['text'] = str(item[1]) + "|Địa chỉ: " + str(item[2]) + "|Đánh giá: " + str(item[4])
                        response['link'] = "rooms/" + str(item[3]) + "?check_in=&check_out=&type=0"
                        response['image'] = str(item[0])
                        dispatcher.utter_message(json_message=response)
                cursor.close()
            connect.close()
        except Error as e:
            dispatcher.utter_message(e)


class ActionFindHightRate(Action):
    def name(self) -> Text:
        return "action_find_room_hightest_rate"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain):
        try:
            connect = mysql.connector.connect(host='127.0.0.1', user='root', password='', database='traveldb')
            if connect.is_connected():
                cursor = connect.cursor()
                cursor.execute("SELECT r.`images_room`, h.`company_name`, h.`address_host`, h.`id_host`, ROUND(AVG(e.`point`), 1) point FROM `rooms` r JOIN `host` h ON r.`id_host` = h.`id_host` JOIN `evaluate` e ON e.`id_host` = h.`id_host` GROUP BY r.`id_host` ORDER BY point DESC LIMIT 0,3")
                result = cursor.fetchall()
                dispatcher.utter_message("Tôi gửi bạn danh sách các khách sạn có lượt đánh giá cao. Bạn tham khảo nhé")
                for item in result:
                    response = {}
                    response['text'] = str(item[1]) + "|Địa chỉ: " + str(item[2]) + "|Đánh giá: " + str(item[4])
                    response['link'] = "rooms/" + str(item[3]) + "?check_in=&check_out=&type=0"
                    response['image'] = str(item[0])
                    dispatcher.utter_message(json_message=response)
                cursor.close()
            connect.close()
        except Error as e:
            dispatcher.utter_message(e)