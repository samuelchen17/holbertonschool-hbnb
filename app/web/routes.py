from flask import Blueprint, render_template


web = Blueprint("web", __name__)


@web.route("/")
def index():
    return render_template("index.html")


@web.route("/login")
def login():
    return render_template("login.html")


@web.route("/place")
def place():
    return render_template("place.html")
