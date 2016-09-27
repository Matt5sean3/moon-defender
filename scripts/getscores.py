#!/usr/bin/python

import sys
import MySQLdb

def print_scores(cur):
  cur.execute("SELECT name, score FROM leaderboard ORDER BY score DESC;")
  print "Num high scores: %d" % cur.rowcount
  for (name, score) in cur:
    print "%s, %d" % (name, int(score))

print "Content-type: text/plain"
print ""

try:
  db = MySQLdb.connect(host="",
                       user="",
                       db="",
                       passwd="")
  print_scores(db.cursor())
  db.close()
except:
  print "Fail! Hit the fail button!"
  print sys.exc_info()

