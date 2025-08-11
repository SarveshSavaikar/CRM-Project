from database import get_connection
import string
import random
import datetime
import psycopg2  # type: ignore
from psycopg2.extras import RealDictCursor  # type: ignore
from psycopg2.errors import UniqueViolation  # type: ignore
from server_utils import *
import json


        
UNIQUE_EMAIL_CONSTRAINT = "unique_user_email"

def get_all_users():
    conn = get_connection()
    print("Connected")
    cur = conn.cursor()
    cur.execute('SELECT user_id, name, role, department, email, phone, status FROM "User"')
    result = cur.fetchall()
    users = list(map(get_user_from_row, result))
    cur.close()
    conn.close()
    print("Connection closed")
    return users
    
def create_user(user: User, max_depth = 10, current_depth = 0):
    if current_depth <= max_depth:
        conn = get_connection() 
        cur = conn.cursor()
        
        user.user_id = generate_user_id()
        user.status = "Idle"
        
        try:
            cur.execute("""
                        INSERT INTO "User"(user_id, name, role, department, status, email, phone, start)
                        VALUES(%s, %s, %s, %s, %s, %s, %s, %s)
                        """,
                        (user.user_id, user.name, user.role, user.department, user.status, user.email, user.phone, datetime.date.today()))
            conn.commit()
        except UniqueViolation as e:
            conn.rollback()
            cur.close()
            conn.close()
            if e.diag.constraint_name == UNIQUE_EMAIL_CONSTRAINT:
                print("Email already registered to a user.")
                return json.dumps({"success": False, "message":"Email already registered to a user"})
            else:
                print("User ID already exists")
                return create_user(user, max_depth, current_depth+1)
        
        return json.dumps({"success": True, "message":"User created successfully"})
    
    else:
        print("Maximum depth reached!")
        return False
    
    


        