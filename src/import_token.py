#!/usr/bin/env python3
import sys
import json
import sqlite3
import os
from datetime import datetime

# Path to database
DB_PATH = "warp2api/account-pool-service/accounts.db"

def import_token():
    print("Please paste the JSON output from your browser console:")
    try:
        # Read JSON from stdin
        data_str = sys.stdin.read().strip()
        if not data_str:
            print("No input provided.")
            return

        data = json.loads(data_str)
        
        email = data.get("email")
        local_id = data.get("local_id")
        id_token = data.get("id_token")
        refresh_token = data.get("refresh_token")

        if not all([email, local_id, id_token, refresh_token]):
            print("Error: Missing fields in JSON. Need email, local_id, id_token, refresh_token.")
            return

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Check if exists
        cursor.execute("SELECT id FROM accounts WHERE email = ?", (email,))
        existing = cursor.fetchone()

        now = datetime.now()

        if existing:
            print(f"Updating existing account: {email}")
            cursor.execute("""
                UPDATE accounts 
                SET local_id=?, id_token=?, refresh_token=?, last_refresh_time=?, status='available'
                WHERE email=?
            """, (local_id, id_token, refresh_token, now, email))
        else:
            print(f"Inserting new account: {email}")
            cursor.execute("""
                INSERT INTO accounts (email, local_id, id_token, refresh_token, status, created_at, last_refresh_time)
                VALUES (?, ?, ?, ?, 'available', ?, ?)
            """, (email, local_id, id_token, refresh_token, now, now))
        
        conn.commit()
        conn.close()
        print("Success! Token imported.")

    except json.JSONDecodeError:
        print("Error: Invalid JSON input.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    import_token()
