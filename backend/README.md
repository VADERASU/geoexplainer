# The GeoExplainer framework

The interface is implemented by JavaScript, and the services are deployed in a Python Flask server. We use the RESTful API to handle the communications between interface and the Python backend calculations.

## Install the framework

```bash
# pip install -r requirements.txt
```

## Run GeoExplainer service

```bash
# python app.py
```

Then open the web browser (Recommend to use Chrome, Firefox, Safari or Edge),
and visit the http://127.0.0.1:5000/

You can change the port number in app.py (5000 is the default port),
Go to the last line of the code in app.py, replace
```
app.run()
```
with your own port number (e.g. 5005)
```
app.run(host='0.0.0.0', port=5005, debug=False)
```

## Structure of the framework resources
- GeoExplainer-source-code/ : the main project folder
    - static/   : the front-end implementations
      - css/ : CSS style files
      - js/ : all the JavaScript functions
      - data/ : all the Geo-spatial data for this project (GeoJSON, shape files and csv files)
      - lib/ : external dependencies 
    - templates/ : the front-end HTML interface code
    - app.py : the main entrance of the system, including all the flask and python code
    - requirements.txt : using ```pip install -r requirements.txt``` to install the dependencies
    
