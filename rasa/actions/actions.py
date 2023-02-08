# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

from pymongo import MongoClient

class ActionHelloWorld(Action):

     def name(self) -> Text:
         return "action_hello_world"

     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

         client = MongoClient('mongo-db',27017)
         db = client.test_database
         counters = db.counters
         
         count = counters.find_one({"topic": "hello"})
         
         if not count:
            count = {"topic": "hello",
                            "count": 0}
        
         count["count"] = count["count"] + 1
        
         counters.replace_one({"topic":"hello"},count, True)
            

         dispatcher.utter_message(text="Hello From The Action Server! You have said 'hello' to the DB " + str(count["count"]) + " time(s)!")

         return []
         
class ActionTestClassSuggest(Action):

     def name(self) -> Text:
         return "action_test_class_suggest"

     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

         client = MongoClient('mongo-db',27017)
         db = client.test_database
         classes = db.test_classes
         
         subject = None
         
         for entity in tracker.latest_message['entities']:
            if entity["entity"] == 'subject':
                subject = entity['value']
         

         suggested_class = classes.find_one({"keyword": subject})
         
         
         if not suggested_class:
            dispatcher.utter_message(text="I can't think of a good class for that")
        
         else:
            dispatcher.utter_message(text="You should take "+suggested_class["name"])

         return []
