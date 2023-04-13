# CIS 4914 | Team Voltaic Sparrow | Computer Science Chatbot

A chatbot that is able to answer general questions from those thinking about majoring in Computer Science.

## Project Tracking

<a href="https://trello.com/b/j05rzM21/agile-board" target="_blank">Voltaic Sparrow's Trello Board</a>

## To Run The Chatbot Server
Make sure you have docker desktop downloaded, running and configured to run linux containers

Then you can just go to the root of the project and run "docker-compose up"

It will take a little while to download the containers for the first time, and then a little more time for the node and rasa servers to start up.

Eventually you can visit localhost:3000 to see the basic chatbot widget. Just click on the message icon to open the chat window and say "Hello".

## To Train The Chatbot

If you make changes to the chatbot you will probably need to retrain the NLU so it can recognize whatever new intents you've added. To do this go to the root of the project and run:

docker run -v ${pwd}/rasa:/app rasa/rasa:3.4.1-full train

Why?

docker | To start docker

run | Tell docker that it's going to download something and run a command

-v ${pwd}/rasa:/app | Tell docker that the /rasa folder in your current directory should be connected to the /app folder in the container it sets up

rasa/rasa:3.4.1-full | Tell docker to download and run the rasa container (or use an existing download of the rasa container if it already has one)

train | This is the command that gets passed to rasa. It tells it to train the NLU based on what you have in your rasa folder

## Introduction to RASA Chatbot Development

Full official documentation available at https://rasa.com/docs/rasa/

### Domains and Data

RASA uses machine learning to interpret user input and decide what response to send or action to take next. These responses and actions are not powered by machine learning but are written ahead of time by developers.

This process is controlled mostly by the contents of /rasa/domain and /rasa/data

/rasa/domain contains “domain files” that define the basic capabilities and limits of the chatbot. These files include:

- “intent” lists that declare the categories that the bot uses for categorizing user input
- “action” lists that define the names (but not the contents) of the custom functions the bot has access to 
- “response” lists that include the unique names and text content of simple responses the bot can use

/rasa/data then contains training data files that are used to create a model that can actually do useful things with the contents of the domain files. These data files include:

- “nlu” lists (natural language understanding) that associate each intent with several examples of what kind of user input should be categorized as a member of that intent category

- “story” lists that include sample conversation fragments in the form of a sequence of user intents and bot responses or actions

- “rule” lists that strongly associate a specific action to a specific user intent, bypassing normal conversation flow. When writing rules be careful not to contradict existing stories.


The domain files and the data files are closely related. If you add a new intent to a domain file you should also add training data examples of that intent to a data file. Similarly including an action in a data file story won’t work unless you also declare that action in a domain file.

### Mini Example

Suppose you want the bot to be able to respond to greetings with “Hello World”. To accomplish this we need:
- A “greet” intent we can use for labeling user input
- Examples of what sort of user input counts as a “greet” intent
- A response containing the text “Hello World”
- An example story showing that the “Hello World” response is an appropriate response to the greet intent

Putting that all together that means we would need a domain file that includes something like:
```
intents:
  - greet

responses:
  utter_hello_world:
- text: "Hello World"
```

And we would then need a data file something like:
```
nlu:
- greet
  examples: |
    - Hello
    - Hi
    - Howdy

stories:    
- story: respond to greetings
  steps:
  - intent: greet
  - action:  utter_hello_world
```

Of course, in a real chatbot your nlu entries would have more than three examples and your stories would likely be more complex than just two steps. 

### Other important files include:

/rasa/action is where the actual python code for the custom action functions defined in the domain should go. If your bot needs to query a database, communicate with an API or do anything other than return simple static content you will need to define that behavior here.

/rasa/tests which includes automated tests for checking that your model actually responds to input as expected. Keeping these tests up to date and running them regularly helps ensure you don’t accidentally break existing conversations while working on new conversations.

### Basic RASA Development Cycle

1) Decide what new behavior you would like the bot to be capable of
2) Brainstorm what a conversation involving that behavior might look like
3) Abstract that conversation into a series of intents, responses and actions
4) Create new intents, responses and actions in your domain files as necessary
5) Add nlu examples and story examples to your data files
6) Train a new model based off your updated files
7) Test the model both manually and by writing automated tests
8) Adjust your nlu and story examples as necessary until behavior is acceptably robust
