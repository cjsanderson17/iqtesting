import statistics
from scipy.stats import norm
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import json
import math

# imports JSON file
alldata = json.load(open('analysis/data.json', 'r'))

# function to graph the score distribution
def GraphScores(mode):
    scores = []
    for User in alldata['data']:
        scores.append(int(User['Score']))
        # to use only Version 1 results
        #if User['userID'] == "43":
            #break
    scores.sort()
    calculationdata = CalculateDeviation(scores)
    CalculateIQ(calculationdata, scores)
    plt.grid(zorder=0, axis='y')
    plt.hist(scores, density=True, bins=np.arange(27)-0.5, edgecolor='black', zorder=3)
    plt.xlabel('IQ Scores')
    plt.ylabel('Percentage of Sample')
    if mode == "c":
        x = np.arange(0,25, 0.001)
        plt.plot(x, norm.pdf(x, calculationdata[0], calculationdata[1]), zorder=4)
    plt.show()

# calculates the mean and standard deviation of the data
def CalculateDeviation(scoreslist):
    meanscore = statistics.mean(scoreslist)
    deviation = statistics.stdev(scoreslist)
    print("mean: ", meanscore, "stdev: ", deviation)
    return(meanscore, deviation)

# calculates the IQ estimate based on the results of CalculateDeviation()
def CalculateIQ(data, scoreslist):
    iqlist = []
    for score in scoreslist:
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
    # list to replace range in for loop for v2 analysis
    #questionorderlist = [1,9,3,5,7,13,6,4,2,11,10,12,19,24,22,8,16,17,20,23,21,18,14,15,25]
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

# function to graph scores in question order
def GraphResponsesByQuestion(df):
    plt.grid(zorder=0, axis='y')
    plt.bar('questions', 'corrects', data=df, zorder=3)
    plt.xlabel('Question Numbers')
    plt.ylabel('Correct Responses')
    plt.show()

# function to graph scores in ascending order
def GraphResponsesByCorrects(df):
    dfsorted = df.sort_values('corrects', ascending=False)
    plt.grid(zorder=0, axis='y')
    plt.bar('questions', 'corrects', data=dfsorted, zorder=3)
    plt.xlabel('Question Numbers')
    plt.ylabel('Correct Responses')
    plt.show()

# [1,3,7,6,2,10,19,22,16,20,21,14,25] V2 odds
# [1,3,5,2,6,8,10,19,17,21,16,14,25] V3 odds
# function to graph correlation between two halves of the test
def GraphReliability():
    answers = []
    for Data in alldata['data']:
        if int(Data['userID']) > 43:
            answerstring = Data['Answers']
            answerlist = answerstring.split(',')
            oddcount = 0
            oddscore = 0
            evencount = 0
            evenscore = 0
            for i in range (0, len(answerlist) // 3):
                id = answerlist[3*i].rpartition(' ')[2]
                if int(id) in [1,3,5,2,6,8,10,19,17,21,16,14,25]:
                    oddcount +=1
                else:
                    evencount +=1
                if answerlist[3*i + 2] == 'true':
                    if int(id) in [1,3,5,2,6,8,10,19,17,21,16,14,25]:
                        oddscore += 1
                    else:
                        evenscore += 1
            if evencount == oddcount:
                answers.append(oddscore)
                answers.append(evenscore)
            elif evencount < oddcount:
                answers.append(oddscore - 1)
                answers.append(evenscore)

    oddscores = []
    evenscores = []
    for i in range(len(answers)):
        if i % 2 == 0:
            oddscores.append(answers[i])
        else:
            evenscores.append(answers[i])
    oddmean = statistics.mean(oddscores)
    evenmean = statistics.mean(evenscores)

    oddminusmean = []
    evenminusmean = []
    for i in range(len(answers)):
        if i % 2 == 0:
            oddminusmean.append(answers[i] - oddmean)
        else:
            evenminusmean.append(answers[i] - evenmean)

    minusmeanssquared =[]
    oddminusmeansquared = []
    evenminusmeansquared = []
    for i in range(len(oddminusmean)):
        minusmeanssquared.append(oddminusmean[i] * evenminusmean[i])
        oddminusmeansquared.append(oddminusmean[i]**2)
        evenminusmeansquared.append(evenminusmean[i]**2)
    
    bothsum = sum(minusmeanssquared)
    oddsum = sum(oddminusmeansquared)
    evensum = sum(evenminusmeansquared)
    r = bothsum / math.sqrt(oddsum * evensum)
    print('r = ', r)

    difflist = []
    for i in range(len(oddscores)):
        difflist.append(oddscores[i] - evenscores[i])
    #plt.scatter(range(1,len(difflist) + 1), difflist)
    plt.scatter(range(1,len(oddscores) + 1), oddscores, alpha=0.5)
    plt.scatter(range(1,len(evenscores) + 1), evenscores, alpha=0.5)
    #plt.scatter(oddscores, evenscores, alpha=0.5)
    plt.xlabel('Participant ID')
    plt.ylabel('Difference in correctly answered odd / even questions')
    plt.show()
    
# run functions to plot graphs
#GraphScores("c")
#GraphScores("a")
#GraphResponses('q')
#GraphResponses('c')
GraphReliability()