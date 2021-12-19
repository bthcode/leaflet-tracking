import sys
import random
from flask import Flask, render_template, jsonify

app = Flask(__name__)


BASECOORDS = [-72, 43]


@app.route('/')
def index():
    return render_template('index.html')



if __name__ == '__main__':
    if len(sys.argv) > 1:
        if sys.argv[1] == 'mkdb':
            db.create_all()
            make_random_data(db)
    else:
        app.run(debug=True)
