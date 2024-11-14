import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    clients = []
    with open(csv_file_path, mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        
        for row in csv_reader:
            client = {
                "id": row["id"],
                "title": row["title"],
                "category": row["category"],
                "storeDetails": row["storeDetails"],
                "contact": row["contact"],
                "directions": {
                    "latitude": float(row["latitude"]) if row["latitude"] else 0.0,
                    "longitude": float(row["longitude"]) if row["longitude"] else 0.0
                },
                "logo": row["logo"] if row["logo"] else "assets/default_logo.png"
            }

            # Add tradingInfo only if both tradingdays and tradinghours are present
            if row["tradingdays"] and row["tradinghours"]:
                client["tradingInfo"] = {
                    "days": row["tradingdays"],
                    "hours": row["tradinghours"]
                }
            
            clients.append(client)
    
    with open(json_file_path, mode='w') as json_file:
        json.dump(clients, json_file, indent=2)

# Usage
csv_to_json('clients.csv', 'clients.json')
