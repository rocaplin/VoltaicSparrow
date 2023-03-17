# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions

#from pathlib import Path

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

class ActionRequestTopics(Action):
    #data = Path("rasa/data/topics.txt").read_text().split("\n")
    def name(self) -> Text:
        return "action_request_topics"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        client = MongoClient('mongo-db', 27017)

        db = client["chompsci"]
        topics = db.topics

        topic = None

        for entity in tracker.latest_message['entities']:
            if entity["entity"] == 'topic':
                topic = entity['value']
        

        # requested_topic = None
        # if topic in self.data:
            
        requested_topic = topics.find_one({"lower_topic": topic.lower()})
            #https://stackoverflow.com/questions/6266555/querying-mongodb-via-pymongo-in-case-insensitive-efficiently

        if not requested_topic:
            if not topic:
                dispatcher.utter_message(text="I'm not well-trained on that topic...")
            else:
                str = ""
                str += topic.lower()
                dispatcher.utter_message(text=("I'm not well-trained on " + str))
        else:
            dispatcher.utter_message(text=("Here is what I know about " + topic.lower() + ": " + requested_topic["description"]))
            dispatcher.utter_message(text=("What would you like to know about this topic?"), buttons=[
                {"payload": "/request_class_by_topic{\"topic\": \"" + topic.lower() + "\"}", "title": "Classes?"},
                {"payload": "/request_job_by_topic{\"topic\": \"" + topic.lower() + "\"}", "title": "Careers?"},
                ])
                

        return []
    

class ActionRequestClassByTopic(Action):

    def name(self) -> Text:
        return "action_request_class_by_topic"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        client = MongoClient('mongo-db',27017)

        db = client["chompsci"]
        topics = db.topics

        topic = None

        for entity in tracker.latest_message['entities']:
            if entity["entity"] == 'topic':
                topic = entity['value']
        

        # requested_topic = None
        # if topic in self.data:
            
        requested_topic = topics.find_one({"lower_topic": topic.lower()})
            #https://stackoverflow.com/questions/6266555/querying-mongodb-via-pymongo-in-case-insensitive-efficiently

        if not requested_topic:
            if not topic:
                dispatcher.utter_message(text="I'm not well-trained on that topic...")
            else:
                str = ""
                str += topic
                dispatcher.utter_message(text=("I'm not well-trained on " + str))
        else:
            if not requested_topic["related_courses"]:
                dispatcher.utter_message(text=("It doesn't seem like there are any classes on this..."))
            else:
                dispatcher.utter_message(text=("You can learn more about " + topic.lower() + " in these classes: " + requested_topic["related_courses"]))

        return []
    
class ActionRequestJobByTopic(Action):

    def name(self) -> Text:
        return "action_request_job_by_topic"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        client = MongoClient('mongo-db',27017)

        db = client["chompsci"]
        topics = db.topics

        topic = None

        for entity in tracker.latest_message['entities']:
            if entity["entity"] == 'topic':
                topic = entity['value']
        

        # requested_topic = None
        # if topic in self.data:
            
        requested_topic = topics.find_one({"lower_topic": topic.lower()})
            #https://stackoverflow.com/questions/6266555/querying-mongodb-via-pymongo-in-case-insensitive-efficiently

        if not requested_topic:
            if not topic:
                dispatcher.utter_message(text="I'm not well-trained on that topic...")
            else:
                str = ""
                str += topic
                dispatcher.utter_message(text=("I'm not well-trained on " + str))
        else:
            if not requested_topic["related_careers"]:
                dispatcher.utter_message(text=("It doesn't seem like there are any careers related to this..."))
            else:
                dispatcher.utter_message(text=("Here is a career related to " + topic.lower() + ": " + requested_topic["related_careers"]))

        return []