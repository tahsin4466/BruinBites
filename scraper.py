from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# initialize chrome driver
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

# open web page
driver.get("https://menu.dining.ucla.edu/hours/")

# wait bc slow lol
wait = WebDriverWait(driver, 10)

# testing by looking for food truck and open times
food_truck_name = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "hours-additional"))).text
food_truck_hours = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "hours-range"))).text

print(f"Food Truck Name: {food_truck_name}")
print(f"Hours Open: {food_truck_hours}")

# close driver
driver.quit()
