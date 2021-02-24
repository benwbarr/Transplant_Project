
# import necessary libraries
from flask import Flask, render_template, redirect, url_for
from flask_pymongo import PyMongo
import json
from bson import json_util, ObjectId

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
#Use flask_pymongo to set up mongo connection


# Route to render webpage
@app.route("/")
def index():
    # # Test
        return render_template("Home.html")


#returns template for state html
@app.route("/State")
def state_map():
    return render_template("State.html")

#Change debug to false when ready for productions
if __name__ == '__main__':
    app.run(debug=True)
