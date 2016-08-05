#!/usr/bin/python

import cgi
import sys
import MySQLdb

def print_scores(cur):
  cur.execute("SELECT name, score FROM moon_defender;")
  print "Num high scores: %d" % cur.rowcount
  for (name, score) in cur:
    print "%s, %d" % (name, int(score))

def add_score(cur, name, score):
  cur.execute("INSERT INTO moon_defender VALUES (%s, %s);", (name, score))

print "Content-type: text/plain"
print ""

form = cgi.FieldStorage()

name = form.getvalue("name", "Dr. Fail")
score = int(form.getvalue("score", "0"))

print "THIS IS YOUR SCORE: %d" % score
print "THESE ARE THE HIGH SCORES:"

try:
  db = MySQLdb.connect(host="localhost",
                       user="hackrva_games",
                       db="hackrva_games",
                       passwd="")
  cur = db.cursor()
  
  print_scores(cur)

  add_score(cur, name, score)
  db.commit()
  
  db.close()
except:
  print "Fail! Hit the fail button!"
  print sys.exc_info()

