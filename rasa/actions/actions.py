# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions

from typing import Any, Text, Dict, List

import random

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
            
        if topic is None:
            dispatcher.utter_message(text="Sorry, I don't quite understand your question... Try rephrasing.")
        else:
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

        requested_job = None

        if job:
            requested_job = job_list.find_one({"job_lower": job.lower()})

        if not requested_job:
            if not job:
                dispatcher.utter_message(text="I'm not well-trained on that topic...")
            else:
                response = ""
                response += job
                dispatcher.utter_message(text=("I'm not well-trained on " + response))
        else:
            courseArray = requested_job["related_courses"].split(';')

            buttonList = []
            for course in courseArray:
                buttonList.append({"payload": "/request_class_by_code{\"class_code\": \"" + course.strip() + "\"}", "title": course})

            dispatcher.utter_message(text=("Here is what I know about careers as a " + job + ": \n" + requested_job["description"]))
            dispatcher.utter_message(text=("You can learn more about it in these classes: " + requested_job["related_courses"]))

            dispatcher.utter_message(text=("Click the buttons below to learn more about each class:"), buttons=buttonList)

        return []

class ActionRequestClassByTopic(Action):

    def name(self) -> Text:
        return "action_request_class_by_topic"
            
    def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]: 
        
        client = MongoClient('mongo-db', 27017)

        db = client.chompsci
        topics = db.topics

        topic_request = None

        for entity in tracker.latest_message['entities']:
            if entity["entity"] == 'topic':
                topic_request = entity['value']

        requested_job = None

        topic_result = topics.find_one({"lower_topic": topic_request.lower()})

        if not topic_result:
            if not topic_request:
                dispatcher.utter_message(text="Sorry, I don't understand")
            else:
                dispatcher.utter_message(text=("I don't know of any classes related to " + topic_request.lower() + "."))
        else:
            if not topic_result["related_courses"]:
                dispatcher.utter_message(text=("It doesn't seem like there are any careers related to this..."))
            else:
                courseArray = topic_result["related_courses"].split(';')

                dispatcher.utter_message(text=("You can learn more about "+topic_request.lower()+" in these classes: " + topic_result["related_courses"]))
                
                buttonList = []
                for course in courseArray:
                    buttonList.append({"payload": "/request_class_by_code{\"class_code\": \"" + course.strip() + "\"}", "title": course})


                dispatcher.utter_message(text=("Click the buttons below to learn more about each class:"), buttons=buttonList)
                

        return []
     
    
class ActionRequestClassByCode(Action):

    def name(self) -> Text:
        return "action_request_class_by_code"
            
    def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]: 
        
        client = MongoClient('mongo-db', 27017)

        db = client.chompsci
        courses = db.courses

        class_request = None

        for entity in tracker.latest_message['entities']:
            if entity["entity"] == 'class_code':
                class_request = entity['value'].upper()


        class_result = courses.find_one({"code": class_request})

        if not class_result:
            if not class_request:
                dispatcher.utter_message(text="Sorry, I don't understand")
            else:
                dispatcher.utter_message(text=("I don't know of any classes with the code " + class_request + "."))
        else:
            dispatcher.utter_message(text=(class_request+ " is "+class_result["name"]+": " + class_result["description"]))
                

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
            
        requested_topic = None

        if topic:
            requested_topic = topics.find_one({"lower_topic": topic.lower()})
            #https://stackoverflow.com/questions/6266555/querying-mongodb-via-pymongo-in-case-insensitive-efficiently

        if not requested_topic:
            if not topic:
                dispatcher.utter_message(text="I'm not well-trained on that topic...")
            else:
                response = ""
                response += topic
                dispatcher.utter_message(text=("I'm not well-trained on " + response))
        else:
            if not requested_topic["related_careers"]:
                dispatcher.utter_message(text=("It doesn't seem like there are any careers related to this..."))
            else:
                jobArray = requested_topic["related_careers"].split(';')
                dispatcher.utter_message(text=("Here are careers related to " + topic.lower() + ": " + requested_topic["related_careers"]))

                buttonList = []
                for job in jobArray:
                    buttonList.append({"payload": "/request_jobs{\"job\": \"" + job.strip() + "\"}", "title": job})
                
                dispatcher.utter_message(text=("Click the buttons below to learn more about each career:"), buttons=buttonList)


        return []

class ActionExampleTopics(Action):

    def name(self) -> Text:
        return "action_example_topics"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        client = MongoClient('mongo-db', 27017)

        db = client["chompsci"]
        topics = db.topics

        # topic = None

        # for entity in tracker.latest_message['entities']:
        #     if entity["entity"] == 'topic':
        #         topic = entity['value']
            
        buttonList = []
        randTopics = random.sample(topics.distinct("topic"), 3)
        for topic in randTopics:
            buttonList.append({"payload": "/request_topics{\"topic\": \"" + topic + "\"}", "title": topic})
        
        dispatcher.utter_message(text=("Here are some example topics I know about: "), buttons=buttonList)
                    

        return []