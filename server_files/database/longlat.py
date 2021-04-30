import random 
import csv
import pandas as pd
import requests

# Form endoints for table requests
endpoint = 'http://localhost:3000/api'
incidents_end, calls_end, dispatch_end = endpoint + '/incidents', endpoint + '/calls', endpoint + '/dispatch'

# Get incidents table data
incidents_res = requests.get(incidents_end)
incidents_raw = incidents_res.json()
incidents = incidents_raw['data']
i_df = pd.DataFrame.from_records(incidents)
#print(i_df.columns)

# Get calls table data
calls_res = requests.get(calls_end)
calls_raw = calls_res.json()
calls = calls_raw['data']
c_df = pd.DataFrame.from_records(calls)

# Get dispatch table data
dispatch_res = requests.get(dispatch_end)
dispatch_raw = dispatch_res.json()
dispatch = dispatch_raw['data']
d_df = pd.DataFrame.from_records(dispatch)

# Generate random lat and long data.
x_coord = []
y_coord = []

number_len = range(0,10000)
for n in number_len: 
    num1 = random.uniform(38.845323,38.891033)
    num2 = random.uniform(-77.065005,-77.113044)
    x_coord.append(num1)
    y_coord.append(num2)

headers = ['lat', 'long']

lat_long_df = pd.DataFrame({'lat': x_coord, 'long': y_coord}, columns = headers)
print(lat_long_df)

# old_df = pd.read_csv('longlat.csv')
# print(old_df)

lat_long_df.to_csv("longlat.csv", index=False)




