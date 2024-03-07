from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
from datetime import datetime
import re
import os

# chrome driver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

# open ucla dining page
driver.get('https://menu.dining.ucla.edu/Hours/')

# wait bc slow lol
wait = WebDriverWait(driver, 10)
wait.until(EC.presence_of_element_located((By.CLASS_NAME, 'hours-table')))

# scrape
date_element = driver.find_element(By.ID, 'page-header')
date_text = date_element.text.split("Today, ")[-1].strip()

# clean the date_text to extract just the date part
pattern = r'HOURS OF OPERATION: (TODAY|TOMORROW|MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY), '
date_text_cleaned = re.sub(pattern, '', date_text).strip()
date_datetime = datetime.strptime(date_text_cleaned, '%B %d, %Y')
date_for_filename = date_datetime.strftime('%Y-%m-%d')
filename = f"{date_for_filename} - Dining Hours.csv"

# more scrape and create rows
table_rows = driver.find_elements(By.XPATH, '//table[@class="hours-table"]/tbody/tr')
data = []
for row in table_rows:
    name_element = row.find_element(By.XPATH, './/span[contains(@class, "hours-location")]')
    name = name_element.text if name_element else "N/A"

    # helper function to get hours or 'CLOSED'
    def get_hours_or_closed(td_class):
        try:
            hours_element = row.find_element(By.XPATH, f'.//td[contains(@class, "{td_class}")]/span[contains(@class, "hours-range")]')
            return hours_element.text if hours_element else "CLOSED"
        except:
            return "CLOSED"

    # apply for each column
    breakfast = get_hours_or_closed("Breakfast")
    lunch_brunch = get_hours_or_closed("Lunch")
    dinner = get_hours_or_closed("Dinner")
    extended_dinner = get_hours_or_closed("Extended Dinner")
    
    data.append({
        "Name": name,
        "Breakfast": breakfast,
        "Lunch/Brunch": lunch_brunch,
        "Dinner": dinner,
        "Extended Dinner": extended_dinner
    })

df = pd.DataFrame(data)
n = 1
df.drop(df.tail(n).index,inplace=True) # drop last n rows

# make folder for data
if not (os.path.isdir("data")):
    os.mkdir("data")
path = os.path.join(os.getcwd(), "data", filename)

# save as csv
df.to_csv(path, index=False)
print(f"Data saved to {path}")

# close driver
driver.quit()

# display data!
# print(df)
