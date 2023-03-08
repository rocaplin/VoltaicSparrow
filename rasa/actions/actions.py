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
     
class ActionRequestJobs(Action):

    def name(self) -> Text:
        return "action_request_jobs"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        client = MongoClient('mongo-db', 27017)

        db = client.chompsci
        job_list = db.job_list

        job_name = None

        for entity in tracker.latest_message['entities']:
            if entity["entity"] == 'job':
                job_name = entity['value']
                dispatcher.utter_message(text=requested_job["description"])


        requested_job = job_list.find_one({"job": job_name})


        if not requested_job:
            if not job_name:
                dispatcher.utter_message(text="I'm not well-trained on that topic...")
            else:
                str = ""
                str += job_name
                dispatcher.utter_message(text=("I'm not well-trained on " + str))
        else:
            dispatcher.utter_message(text=requested_job["description"])

        return []
