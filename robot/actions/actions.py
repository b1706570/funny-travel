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
                        response['link'] = "/rooms/" + str(item[3]) + "?check_in=&check_out=&type=0"
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
                    response['link'] = "/rooms/" + str(item[3]) + "?check_in=&check_out=&type=0"
                    response['image'] = str(item[0])
                    dispatcher.utter_message(json_message=response)
                cursor.close()
            connect.close()
        except Error as e:
            dispatcher.utter_message(e)


class ActionFindLowestPrice(Action):
    def name(self) -> Text:
        return "action_find_room_lowest_price"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain):
        try:
            entities = tracker.latest_message['entities']
            if (len(entities) > 0):
                location = entities[0]['value']
            else:
                location = ''
            connect = mysql.connector.connect(host='127.0.0.1', user='root', password='', database='traveldb')
            if connect.is_connected():
                cursor = connect.cursor()
                cursor.execute("SELECT r.`images_room`, h.`company_name`, h.`address_host`, h.`id_host`, MIN(r.`price_room`) min FROM `rooms` r JOIN `host` h ON r.`id_host` = h.`id_host` WHERE h.`address_host` LIKE '%" + str(location) +"%' GROUP BY r.`id_host` ORDER BY min LIMIT 0,3")
                result = cursor.fetchall()
                if location != '':
                    dispatcher.utter_message("Bạn tham khảo các phòng có giá thấp nhất ở khu vực " + str(location) + " nhé")
                else:
                    dispatcher.utter_message("Bạn tham khảo các phòng có giá thấp nhất nhé")
                for item in result:
                    response = {}
                    response['text'] = str(item[1]) + "|Địa chỉ: " + str(item[2]) + "|Giá phòng: " + "{:,}".format(item[4])
                    response['link'] = "/rooms/" + str(item[3]) + "?check_in=&check_out=&type=0"
                    response['image'] = str(item[0])
                    dispatcher.utter_message(json_message=response)
                cursor.close()
            connect.close()
        except Error as e:
            dispatcher.utter_message(e)



class ActionFindHightestPrice(Action):
    def name(self) -> Text:
        return "action_find_room_hightest_price"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain):
        try:
            entities = tracker.latest_message['entities']
            if (len(entities) > 0):
                location = entities[0]['value']
            else:
                location = ''
            connect = mysql.connector.connect(host='127.0.0.1', user='root', password='', database='traveldb')
            if connect.is_connected():
                cursor = connect.cursor()
                cursor.execute("SELECT r.`images_room`, h.`company_name`, h.`address_host`, h.`id_host`, MAX(r.`price_room`) max FROM `rooms` r JOIN `host` h ON r.`id_host` = h.`id_host` WHERE h.`address_host` LIKE '%" + str(location) +"%' GROUP BY r.`id_host` ORDER BY max DESC LIMIT 0,3")
                result = cursor.fetchall()
                if location != '':
                    dispatcher.utter_message("Bạn tham khảo các phòng có giá cao nhất ở khu vực " + str(location) + " nhé")
                else:
                    dispatcher.utter_message("Bạn tham khảo các phòng có giá cao nhất nhé")
                for item in result:
                    response = {}
                    response['text'] = str(item[1]) + "|Địa chỉ: " + str(item[2]) + "|Giá phòng: " + "{:,}".format(item[4])
                    response['link'] = "/rooms/" + str(item[3]) + "?check_in=&check_out=&type=0"
                    response['image'] = str(item[0])
                    dispatcher.utter_message(json_message=response)
                cursor.close()
            connect.close()
        except Error as e:
            dispatcher.utter_message(e)


class ActionFindCustomPrice(Action):
    def name(self) -> Text:
        return "action_find_room_with_price_custom"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain):
        try:
            entities = tracker.latest_message['entities']
            low_price = -1
            hight_price = -1
            location = ''
            for i in range (0, len(entities)):
                if entities[i]['entity'] == 'low_price' or entities[i]['entity'] == 'hight_price':
                    if int(entities[i]['value']) > int(hight_price):
                        low_price = hight_price
                        hight_price = entities[i]['value']
                    else:
                        low_price = entities[i]['value']
                else:
                    location = entities[i]['value']
            connect = mysql.connector.connect(host='127.0.0.1', user='root', password='', database='traveldb')
            if connect.is_connected():
                cursor = connect.cursor()
                cursor.execute("SELECT r.`images_room`, h.`company_name`, h.`address_host`, h.`id_host`, MIN(r.`price_room`) min FROM `rooms` r JOIN `host` h ON r.`id_host` = h.`id_host` WHERE h.`address_host` LIKE '%" + str(location) + "%' AND r.`price_room` >= " + str(low_price) + " AND r.`price_room` <= "+ str(hight_price) + " GROUP BY r.`id_host` ORDER BY min LIMIT 0,3")
                result = cursor.fetchall()
                if len(result) == 0:
                    dispatcher.utter_message("Tôi không tìm thấy khách sạn trùng khớp với ý của bạn cả.")
                else:
                    dispatcher.utter_message("Tôi gửi bạn danh sách các khách sạn có giá từ {:,} đến {:,} ở khu vực {} nhé".format(int(low_price), int(hight_price), str(location)))
                for item in result:
                    response = {}
                    response['text'] = str(item[1]) + "|Địa chỉ: " + str(item[2]) + "|Giá phòng: " + "{:,}".format(item[4])
                    response['link'] = "/rooms/" + str(item[3]) + "?check_in=&check_out=&type=0"
                    response['image'] = str(item[0])
                    dispatcher.utter_message(json_message=response)
                cursor.close()
            connect.close()
        except Error as e:
            dispatcher.utter_message(e)


class ActionFindLowerThanPrice(Action):
    def name(self) -> Text:
        return "action_find_room_with_price_lower_than"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain):
        try:
            entities = tracker.latest_message['entities']
            print(entities)
            type = ['','đơn', 'đôi', 'tậpthể', 'giađình', 'minihouse', 'homestay']
            type_room = -1
            type_room_text = ''
            for i in range(0, len(entities)):
                if entities[i]['entity'] == 'price_lower':
                    price_lower = entities[i]['value']
                elif entities[i]['entity'] == 'type_room':
                    type_room = type.index(str(entities[i]['value']).replace(" ",""))
                    type_room_text = entities[i]['value']
                else:
                    location = entities[i]['value']
            connect = mysql.connector.connect(host='127.0.0.1', user='root', password='', database='traveldb')
            if connect.is_connected():
                if type_room == -1:
                    cursor = connect.cursor()
                    cursor.execute("SELECT r.`images_room`, h.`company_name`, h.`address_host`, h.`id_host`, MIN(r.`price_room`) min FROM `rooms` r JOIN `host` h ON r.`id_host` = h.`id_host` WHERE h.`address_host` LIKE '%" + str(location) + "%' AND r.`price_room` <= "+ str(price_lower) + " GROUP BY r.`id_host` ORDER BY min LIMIT 0,3")
                    result = cursor.fetchall()
                    if len(result) == 0:
                        dispatcher.utter_message("Tôi không tìm thấy khách sạn trùng khớp với ý của bạn cả.")
                    else:
                        dispatcher.utter_message("Tôi gửi bạn danh sách các khách sạn có thấp hơn {:,} ở khu vực {} nhé".format(int(price_lower), str(location)))
                    for item in result:
                        response = {}
                        response['text'] = str(item[1]) + "|Địa chỉ: " + str(item[2]) + "|Giá phòng: " + "{:,}".format(item[4])
                        response['link'] = "/rooms/" + str(item[3]) + "?check_in=&check_out=&type=0"
                        response['image'] = str(item[0])
                        dispatcher.utter_message(json_message=response)
                    cursor.close()
                else:
                    cursor = connect.cursor()
                    cursor.execute("SELECT r.`images_room`, h.`company_name`, h.`address_host`, h.`id_host`, MIN(r.`price_room`) min FROM `rooms` r JOIN `host` h ON r.`id_host` = h.`id_host` WHERE h.`address_host` LIKE '%" + str(location) + "%' AND r.`price_room` <= "+ str(price_lower) + " AND r.`type_room`=" + str(type_room) + " GROUP BY r.`id_host` ORDER BY min LIMIT 0,3")
                    result = cursor.fetchall()
                    if len(result) == 0:
                        dispatcher.utter_message("Tôi không tìm thấy khách sạn trùng khớp với ý của bạn cả.")
                    else:
                        dispatcher.utter_message("Tôi gửi bạn danh sách các khách sạn có phòng {} và giá thấp hơn {:,} ở khu vực {} nhé".format(str(type_room_text) ,int(price_lower), str(location)))
                    for item in result:
                        response = {}
                        response['text'] = str(item[1]) + "|Địa chỉ: " + str(item[2]) + "|Loại phòng: phòng" + str(type_room_text) + "|Giá phòng: " + "{:,}".format(item[4])
                        response['link'] = "/rooms/" + str(item[3]) + "?check_in=&check_out=&type=" + str(type_room)
                        response['image'] = str(item[0])
                        dispatcher.utter_message(json_message=response)
                    cursor.close()
            connect.close()
        except Error as e:
            dispatcher.utter_message(e)


class ActionFindWithName(Action):
    def name(self) -> Text:
        return "action_find_room_with_name"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain):
        try:
            entities = tracker.latest_message['entities']
            host_name = entities[0]['value']
            connect = mysql.connector.connect(host='127.0.0.1', user='root', password='', database='traveldb')
            if connect.is_connected():
                cursor = connect.cursor()
                cursor.execute("SELECT r.`images_room`, h.`company_name`, h.`address_host`, h.`id_host`, ROUND(AVG(e.`point`), 1) point FROM `rooms` r JOIN `host` h ON r.`id_host` = h.`id_host` JOIN `evaluate` e ON e.`id_host` = h.`id_host` WHERE h.`company_name` LIKE '%" + host_name + "%' GROUP BY r.`id_host` ORDER BY point DESC LIMIT 0,3")
                result = cursor.fetchall()
                if len(result) == 0:
                    dispatcher.utter_message("Tôi không tìm thấy khách sạn có tên tương tự bạn vừa tìm")
                else:
                    dispatcher.utter_message("Bạn tham khảo các khách sạn sau đây nhé:")
                    for item in result:
                        response = {}
                        response['text'] = str(item[1]) + "|Địa chỉ: " + str(item[2]) + "|Đánh giá: " + str(item[4])
                        response['link'] = "/rooms/" + str(item[3]) + "?check_in=&check_out=&type=0"
                        response['image'] = str(item[0])
                        dispatcher.utter_message(json_message=response)
                cursor.close()
            connect.close()
        except Error as e:
            dispatcher.utter_message(e)


class ActionFindWithConvenient(Action):
    def name(self) -> Text:
        return "action_find_room_with_convenient"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain):
        try:
            conv = ''
            location = ''
            entities = tracker.latest_message['entities']
            for i in range(0, len(entities)):
                if entities[i]['entity'] == 'convenient':
                    conv = entities[i]['value']
                elif entities[i]['entity'] == 'location':
                    location = entities[i]['value']
            connect = mysql.connector.connect(host='127.0.0.1', user='root', password='', database='traveldb')
            if connect.is_connected():
                cursor = connect.cursor()
                cursor.execute("SELECT `id_conv` FROM `convenient` WHERE `name_conv` LIKE '%" + str(conv) + "%'")
                result1 = cursor.fetchall()
                id_conv = result1[0][0]
                cursor.execute("SELECT r.`images_room`, h.`company_name`, h.`address_host`, h.`id_host`, ROUND(AVG(e.`point`), 1) point FROM `rooms` r JOIN `host` h ON r.`id_host` = h.`id_host` JOIN `evaluate` e ON e.`id_host` = h.`id_host` WHERE r.`convenients_room` LIKE '%" + str(id_conv) + "%' AND h.`address_host` LIKE '%" + str(location) + "%' GROUP BY r.`id_host` ORDER BY point DESC LIMIT 0,3")
                result = cursor.fetchall()
                if len(result) == 0:
                    dispatcher.utter_message("Tôi không tìm thấy khách sạn có tiện ích bạn vừa tìm")
                else:
                    dispatcher.utter_message("Bạn tham khảo các khách sạn sau đây nhé:")
                    for item in result:
                        response = {}
                        response['text'] = str(item[1]) + "|Địa chỉ: " + str(item[2]) + "|Đánh giá: " + str(item[4])
                        response['link'] = "/rooms/" + str(item[3]) + "?check_in=&check_out=&type=0"
                        response['image'] = str(item[0])
                        dispatcher.utter_message(json_message=response)
                cursor.close()
            connect.close()
        except Error as e:
            dispatcher.utter_message(e)