import requests
import pandas as pd
import json
from io import StringIO
from bs4 import BeautifulSoup

url = 'https://en.wikipedia.org/wiki/List_of_Irish-language_given_names'
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
response = requests.get(url, headers=headers)
response.raise_for_status()

soup = BeautifulSoup(response.text, "lxml")

# Map heading keywords to gender
heading_to_gender = {
    "masculine": "Male",
    "feminine": "Female",
    "unisex": "Unisex"
}

all_names = []

# Find all tables that follow a heading with "Native ... names"
for heading in soup.find_all(['h2', 'h3']):
    title = heading.get_text().lower()
    gender = None
    for key, val in heading_to_gender.items():
        if key in title and "name" in title:
            gender = val
            break
    if gender:
        # Find the next table after the heading
        table = heading.find_next('table', {'class': 'wikitable'})
        if table:
            df = pd.read_html(str(table))[0]
            for _, row in df.iterrows():
                name = str(row.get('Name', '')).strip()
                if not name:
                    continue
                meaning = str(row.get('Meaning', '')).strip() if 'Meaning' in row else ''
                notes = str(row.get('Notes', '')).strip() if 'Notes' in row else ''
                pronunciation = str(row.get('IPA', '')).strip() if 'IPA' in row else ''
                origin = "Irish"
                description = notes

                angliz_col = next((col for col in row.index if 'Anglicis' in col or 'equivalent' in col), None)
                anglicized = str(row.get(angliz_col, '')).strip() if angliz_col else ''
                anglicized_names = [a.strip() for a in anglicized.replace(';', ',').split(',') if a.strip()]

                # Split the Name field by spaces (if more than one word, treat as variants)
                name_parts = name.split()
                main_name = name_parts[0]
                variants = name_parts[1:] if len(name_parts) > 1 else []

                all_names.append({
                    "Name": main_name,
                    "Gender": gender,
                    "Origin": origin,
                    "Description": description,
                    "Meaning": meaning,
                    "Pronunciation": pronunciation,
                    "Notes": notes,
                    "VariantsSerialized": ','.join(variants),
                    "AnglicizedNamesSerialized": ','.join(anglicized_names),
                })

with open("irish_babynames.json", "w", encoding="utf-8") as f:
    json.dump(all_names, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(all_names)} Irish names and wrote to irish_babynames.json")