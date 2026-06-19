"""
Бэкенд для управления бронированиями ValdayEcoLife.
GET / — список всех броней (для админа)
POST / — создать новое бронирование
PATCH /{id}/status — обновить статус брони
"""
import json
import os
import psycopg2


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")

    if method == "GET" and path == "/":
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, house_id, house_title, house_location, house_price,
                   guest_name, guest_phone, date_from, date_to, nights,
                   total_amount, prepayment, status,
                   to_char(created_at, 'DD.MM.YYYY HH24:MI') as created_at
            FROM bookings
            ORDER BY created_at DESC
        """)
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        bookings = []
        for row in rows:
            b = dict(zip(cols, row))
            b["date_from"] = str(b["date_from"])
            b["date_to"] = str(b["date_to"])
            bookings.append(b)
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"bookings": bookings})}

    if method == "POST" and path == "/":
        body = json.loads(event.get("body") or "{}")
        required = ["house_id", "house_title", "house_location", "house_price",
                    "guest_name", "guest_phone", "date_from", "date_to", "nights",
                    "total_amount", "prepayment"]
        for field in required:
            if field not in body:
                return {"statusCode": 400, "headers": CORS,
                        "body": json.dumps({"error": f"Missing field: {field}"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO bookings
              (house_id, house_title, house_location, house_price,
               guest_name, guest_phone, date_from, date_to, nights,
               total_amount, prepayment, status)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,'pending')
            RETURNING id
        """, (
            body["house_id"], body["house_title"], body["house_location"], body["house_price"],
            body["guest_name"], body["guest_phone"], body["date_from"], body["date_to"],
            body["nights"], body["total_amount"], body["prepayment"]
        ))
        booking_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 201, "headers": CORS,
                "body": json.dumps({"id": booking_id, "status": "pending"})}

    parts = path.strip("/").split("/")
    if method == "PATCH" and len(parts) == 2 and parts[1] == "status":
        booking_id = int(parts[0])
        body = json.loads(event.get("body") or "{}")
        new_status = body.get("status")
        if new_status not in ("pending", "confirmed", "cancelled"):
            return {"statusCode": 400, "headers": CORS,
                    "body": json.dumps({"error": "Invalid status"})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("UPDATE bookings SET status=%s WHERE id=%s", (new_status, booking_id))
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": CORS,
                "body": json.dumps({"id": booking_id, "status": new_status})}

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Not found"})}
