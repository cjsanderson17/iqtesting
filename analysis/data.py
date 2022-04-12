import statistics
import math
from scipy.stats import norm
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import json

alldata = json.load(open('analysis/data.json', 'r'))

# Function to graph the score distribution
def GraphScores(mode):
    scores = []
    for User in alldata['data']:
        scores.append(int(User['Score']))
    scores.sort()
    if mode == "c":
        calculationdata = CalculateDeviation(scores)
        CalculateIQ(calculationdata, scores)
    else:
        plt.hist(scores, bins=np.arange(27)-0.5, edgecolor='black')
        plt.xlabel('Amount')
        plt.ylabel('Scores')
        plt.show()

def CalculateDeviation(scoreslist):
    meanscore = statistics.mean(scoreslist)
    deviation = statistics.stdev(scoreslist)
    return(meanscore, deviation)

def CalculateIQ(data, scoreslist):
    iqlist = []
    for score in scoreslist:
        print(score)
        zscore = (score - data[0]) / data[1]
        iqscore = 100 + (zscore * 15)
        iqstring = "Score: {}, IQ: {}".format(score, iqscore)
        iqlist.append(iqstring)
    print(*iqlist, sep='\n')


# Function to graph the responses to each question
def GraphResponses(mode):
    answers = {}
    usercounter = 0
    for Data in alldata['data']:
        usercounter += 1
        answerstring = Data['Answers']
        answerlist = answerstring.split(',')
        for i in range (0, len(answerlist) // 3):
            id = answerlist[3*i].rpartition(' ')[2]
            if id not in answers.keys():
                answers[id] = {'correct': 0, 'false': 0, 'unanswered':0}
            if answerlist[3*i + 2] == 'true':
                answers[id]['correct'] += 1
            elif answerlist[3*i + 2] == "false":
                answers[id]['false'] += 1

    questionlist = []
    correctslist = []
    for i in range(1,26):
        id = str(i)
        answers[id]['unanswered'] = usercounter - answers[id]['correct'] - answers[id]['false']
        questionlist.append(id)
        correctslist.append(answers[id]['correct'])

    df = pd.DataFrame(
        dict(
            questions = questionlist,
            corrects = correctslist
        )
    )

    if mode == "q":
        GraphResponsesByQuestion(df)
    elif mode == "c":
        GraphResponsesByCorrects(df)

# Function to graph scores in question order
def GraphResponsesByQuestion(df):
    plt.bar('questions', 'corrects', data=df)
    plt.xlabel('Question Numbers')
    plt.ylabel('Correct Responses')
    plt.show()

# Function to graph scores in ascending order
def GraphResponsesByCorrects(df):
    dfsorted = df.sort_values('corrects')
    plt.bar('questions', 'corrects', data=dfsorted)
    plt.xlabel('Question Numbers')
    plt.ylabel('Correct Responses')
    plt.show()

GraphScores("c")
#GraphResponses('q')
#GraphResponses('c')