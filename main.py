import json
import os
import numpy as np
from flask import Flask, render_template, request, Response
import keras

app = Flask(__name__,
            template_folder=os.path.join(os.path.dirname(__file__), 'templates')
            )

digit_reader = keras.models.load_model('MNIST-Reader.h5')

@app.route("/")
def homePage():
    return render_template('app_pages/home.html')

@app.route("/contact-info")
def contactInfo():
    return render_template('app_pages/contact-info.html')

@app.route("/mnist-digit-reader")
def digitReader():
    return render_template('app_pages/mnist-digit-reader.html')

@app.route("/read-number", methods=['POST'])
def readDigit():
    post = json.loads(request.form['grid'])

    table_list = np.zeros((28, 28))

    for row in range(28):
        for col in range(28):
            table_index = 'row_' + str(row) + '_col_' + str(col)
            table_list[row][col] = post[table_index]

    table_list = centerDrawing(table_list)

    table_list = table_list.reshape(1, 28, 28, 1)
    predictions = list(digit_reader.predict(table_list)[0])
    predicted_number = predictions.index(max(predictions))

    return str(predicted_number)


def centerDrawing(drawing):
    # variables for furthest filled pixel
    high = 0
    low = 999
    left = 999
    right = 0

    for i in range(len(drawing)):
        for j in range(len(drawing[i])):
            if drawing[i][j] != 0:
                if i < low:
                    low = i
                if i > high:
                    high = i
                if j < left:
                    left = j
                if j > right:
                    right = j

    length = len(drawing)
    height = len(drawing[0])

    # drawing = np.asarray(drawing)

    left_distance = left
    right_distance = length - right - 1

    drawing = np.roll(drawing, int((right_distance - left_distance)/2), axis=1)

    high_distance = height - high - 1
    low_distance = low

    drawing = np.roll(drawing, int((high_distance - low_distance)/2), axis=0)

    return drawing

if __name__ == "__main__":
    app.run()