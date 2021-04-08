import random 
import csv
import pandas as pd

x_cord = []
y_cord = []

number_len = range(0,10000)
for n in number_len: 
    num1 = random.uniform(38.845323,38.891033)
    num2 = random.uniform(-77.065005,-77.113044)
    x_cord.append(num1)
    y_cord.append(num2)


df = pd.read_csv("longlat.csv")
df["x_cord"] = x_cord
df["y_cord"] = y_cord
df.to_csv("longlat.csv", index=False)




