import os
from flask import Flask, render_template

app = Flask(__name__,
            template_folder=os.path.join(os.path.dirname(__file__), 'templates')
            )
@app.route("/")
def homePage():
    return render_template('app_pages/home.html')

@app.route("/contact-info")
def contactInfo():
    return render_template('app_pages/contact-info.html')

@app.route("/mnist-digit-reader")
def digitReader():
    return render_template('app_pages/mnist-digit-reader.html')

if __name__ == "__main__":
    app.run()