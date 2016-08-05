#!/usr/bin/python

import cgi
import MySQLdb

print "Content-type: text/plain"
print ""

form = cgi.FieldStorage()

name = form.getvalue("name", "Dr. Fail")
score = int(form.getvalue("score", "0"))

db = MySQLdb.connect(host="localhost",
                     user="hackrva_games",
                     database="hackrva_games",
                     passwd="")
cur = db.cursor()

def print_scores(cur):
  cur.execute("SELECT score, name FROM moon_defender;")
  for (name, score) in cur:
    print("%s, %d;", name, score)

def add_score(cur, name, score):
  cur.execute("INSERT INTO moon_defender VALUES (%s, %d)", name, score)

add_score(cur, name, score)
print_scores(cur)

db.commit()
db.close()

