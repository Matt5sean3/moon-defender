#!/usr/bin/python

import cgi
import sys
import MySQLdb

def add_score(cur, name, score):
  cur.execute("INSERT INTO leaderboard VALUES (%s, %s);", (name, score))

print "Content-type: text/plain"
print ""

form = cgi.FieldStorage()

name = form.getvalue("name", "Dr. Fail")
score = int(form.getvalue("score", "0"))

try:
  db = MySQLdb.connect(host="",
                       user="",
                       db="",
                       passwd="")
  add_score(db.cursor(), name, score)
  db.commit()
  db.close()
  print "%s,%s" % (name, score)
except:
  print "Fail! Hit the fail button!"
  print sys.exc_info()

