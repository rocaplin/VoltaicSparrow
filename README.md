# CIS 4914 | Team Voltaic Sparrow | Computer Science Chatbot

A chatbot that is able to answer general questions from those thinking about majoring in Computer Science.

## Project Tracking

<a href="https://trello.com/b/j05rzM21/agile-board" target="_blank">Voltaic Sparrow's Trello Board</a>

## To Run The Chatbot Server
Make sure you have docker desktop downloaded, running and configured to run linux containers

Then you can just go to the root of the project and run "docker-compose up"

It will take a little while to download the containers for the first time, and then a little more time for the node and rasa servers to start up.

Eventually cou can visit localhost:3000 to see the basic chatbot widget. Just click on the message icon to open the chat window and say "Hello".

## To Train The Chatbot

If you make changes to the chatbot you will probably need to retrain the NLU so it can recognize whatever new intents you've added. To do this go to the root of the project and run:

docker run -v ${pwd}/rasa:/app rasa/rasa:3.4.1-full train

Why?

docker | To start docker

run | Tell docker that it's going to download something and run a command

-v ${pwd}/rasa:/app | Tell docker that the /rasa folder in your current directory should be connected to the /app folder in the container it sets up

rasa/rasa:3.4.1-full | Tell docker to download and run the rasa container (or use an existing download of the rasa container if it already has one)

train | This is the command that gets passed to rasa. It tells it to train the NLU based on what you have in your rasa folder
