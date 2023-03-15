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

        job = None

        for entity in tracker.latest_message['entities']:
            if entity["entity"] == 'job':
                job = entity['value']


        requested_job = job_list.find_one({"job_lower": job.lower()})

        if not requested_job:
            if not job:
                dispatcher.utter_message(text="I'm not well-trained on that topic...")
            else:
                str = ""
                str += job
                dispatcher.utter_message(text=("I'm not well-trained on " + str))
        else:
            dispatcher.utter_message(text=("Here is what I know about careers as a " + job + ": \n" + requested_job["description"]))
            dispatcher.utter_message(text=("You can learn more about it in these classes: " + requested_job["related_courses"]))

        return []
