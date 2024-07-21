import os
from model import update_db

for path in os.listdir("./files"):
    print(f"./files/{path}")
    update_db(f"./files/{path}")