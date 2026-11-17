// Teacher notes for the Python module, keyed by lesson slug.
// One running story ties the module together: the class is the new data team at
// "Thattukada Co.", a street-food chain that started as one cart in Kochi.
// Code fences use ~~~ so the markdown needs no escaping inside template literals.

const story = `
> **Running story: Thattukada Co.** Meera started with one thattukada (roadside food cart) near Kochi's Marine Drive. Now she has carts in 15 cities, and she has just hired *this class* as her data team. Each session she brings a new problem, and the Python topic of the day is the tool that solves it.
`;

export const pythonNotes: Record<string, string> = {
  // -------------------------------------------------------------------------
  "python-intro": `
${story}
**Chapter 1: "You're hired."** Goal: every student runs Python in Colab and can store and tidy a value: a number, some text, true/false.

| Time | What | Notes |
|---|---|---|
| 0–10 | Hook | Tell the true story: in Oct 2020 England's health agency lost about **16,000 COVID cases** because an old Excel file format stops at about 65,000 rows. Ask: "Would you trust a spreadsheet with your city's data?" Then introduce Meera: "She doesn't want that to happen to her. That's why she hired you." |
| 10–20 | Colab setup | Everyone opens the session notebook → **File → Save a copy in Drive**. First cell: \`print("Hello, Thattukada")\`. Shift + Enter. |
| 20–40 | Meera's menu card | Live-code one menu item as variables (below). Ask for each one: "What type is this?" then check with \`type()\`. |
| 40–60 | WhatsApp orders | Meera's orders arrive as messy names. Strings come in as the cleaning tool (below). Students fix 3 names themselves. |
| 60–80 | Assignment 1 | Start Assignment 1 in class. It's the same skills: types, conversion, string methods. |
| 80–90 | Cliffhanger | "Tomorrow Meera sends the whole day's order book. One variable per order won't work..." |

~~~python
item = "Pazham pori"      # str
price = 15                # int
rating = 4.6              # float
is_veg = True             # bool
print(item, "costs ₹", price)

raw = "   aNJU k  "
print(raw.strip().title())          # Anju K
print("7012-345-678".replace("-", ""))
~~~

**For students who already know this:** "Boss level": take \`"  aNJU   k  "\` (several spaces in the middle) and get \`"Anju K"\`. Hint: \`" ".join(raw.split())\`. The first to solve it becomes a helper for the rest of the session.

**Watch for:** \`input()\` always returns a string. Have them check \`type(input("Age? "))\` before they try to add 1 to it.
`,

  // -------------------------------------------------------------------------
  "python-data-structures": `
${story}
**Chapter 2: "The order book."** Goal: choose the right container (list, tuple, dict or set) for each kind of business data.

| Time | What | Notes |
|---|---|---|
| 0–10 | Recap | 3 quick questions from Chapter 1 (types, \`.strip()\`, \`.title()\`). |
| 10–25 | Story | Meera: "Today 8 orders came in. Some people came twice. How many *different* customers did we have? What did we earn?" Write the questions on the board and don't answer yet. |
| 25–55 | Four containers | Introduce each one as the answer to one of Meera's needs (table below). Live-code each. |
| 55–75 | Solve Meera's questions | In pairs: unique customers (set), the price of an item (dict lookup), the number of orders (\`len\` of the list). |
| 75–90 | Assignment 2 | Start Assignment 2 in class. |

| Meera needs... | Container | Why |
|---|---|---|
| Today's orders, in order | **list** \`["Anju", "Rahul", "Anju"]\` | Ordered, can grow |
| The cart's location (never changes) | **tuple** \`(9.98, 76.28)\` | Fixed, can't be edited by mistake |
| The menu: item → price | **dict** \`{"Pazham pori": 15, "Chai": 12}\` | Look up by name |
| The unique customers | **set** \`set(orders)\` | Duplicates vanish automatically |

~~~python
orders = ["Anju", "Rahul", "Anju", "Fathima", "Rahul", "Joel", "Anju", "Sneha"]
print(len(orders), "orders")              # 8
print(len(set(orders)), "customers")      # 5
menu = {"Pazham pori": 15, "Chai": 12, "Egg puffs": 20}
print(menu["Chai"])
menu["Kappa"] = 40                        # new item on the menu
~~~

**Boss level:** "Who is the most loyal customer?" (\`max(set(orders), key=orders.count)\`) The faster students can explain *why* it works.
`,

  // -------------------------------------------------------------------------
  "python-operators-conditionals": `
${story}
**Chapter 3: "The billing counter."** Goal: write decision logic with comparison and logical operators and \`if / elif / else\`.

| Time | What | Notes |
|---|---|---|
| 0–10 | Recap | "Which container for...?" game: a phone contact list, roll numbers, the days of the week. |
| 10–20 | Story | Meera's offers: students get 10% off; any bill over ₹200 gets a free chai; seniors (60+) get 15% off. "The cashier keeps getting this wrong. Write the rules so the computer does it." |
| 20–50 | Operators + if/elif/else | Live-code the billing rules (below). Ask: what if someone is a student *and* a senior? Which rule wins? The order of the \`elif\`s matters. |
| 50–80 | Assignment 3 | The age → ticket-price question in Assignment 3 is the same pattern. Let them start in class. |
| 80–90 | Share | One student reads their code aloud. The class finds an input that breaks it (a negative age? 0?). |

~~~python
bill = 240
age = 21
is_student = True

if age >= 60:
    bill = bill * 0.85
elif is_student:
    bill = bill * 0.90

if bill > 200 and age > 0:
    print("Free chai!")
print("Pay ₹", round(bill))
~~~

**Watch for:** \`=\` vs \`==\`, and a missing colon or indent. Let the error message appear and read it together. Reading errors is a skill, not a failure.
`,

  // -------------------------------------------------------------------------
  "python-loops": `
${story}
**Chapter 4: "Closing time."** Goal: use \`for\` / \`while\` loops with \`break\` and \`continue\` to process many records.

| Time | What | Notes |
|---|---|---|
| 0–10 | Recap | One billing-rule question from Chapter 3. |
| 10–20 | Story | "At 10 pm Meera wants the day's total. Some orders were *cancelled* (skip them). When the cashier types CLOSED, stop counting." |
| 20–50 | Loops | Live-code the closing-time report (below): \`for\` to go through orders, \`continue\` to skip cancelled ones, \`break\` at CLOSED. |
| 50–80 | Practice + Bonus | Students write Assignment 3 Q2 (negative = skip, 0 = stop): it's the same pattern. Fast finishers do the Bonus assignment. |
| 80–90 | Cliffhanger | "Meera now has 15 cities and 40 carts. Next class: why her data team needs Python, not Excel." |

~~~python
day = [120, 85, "CANCELLED", 240, 60, "CLOSED", 999]
total = 0
for amount in day:
    if amount == "CANCELLED":
        continue
    if amount == "CLOSED":
        break
    total += amount
print("Today's total: ₹", total)    # 505 (the 999 after CLOSED is ignored)
~~~

**Ask:** "Why wasn't 999 counted?" If they can explain it, they understand \`break\`.
`,

  // -------------------------------------------------------------------------
  "python-for-analytics": `
${story}
**Chapter 5: "40 carts, and Excel keeps crashing."** Goal: students can explain *why* analysts use Python, and leave excited about the jobs it leads to.

| Time | What | Notes |
|---|---|---|
| 0–15 | Three true stories | 1) **COVID cases lost to Excel** (England, 2020: about 16,000 cases dropped by a row limit). 2) **Excel renamed human genes**: it kept turning gene names like SEPT1 into dates, so in 2020 scientists *renamed the genes*. 3) Ask: "What's the worst spreadsheet mistake you've seen?" |
| 15–30 | Python vs Excel | Use the slides. Frame: Excel is a calculator you click; Python is a recipe you can re-run on tomorrow's data in one second. |
| 30–45 | Think like an analyst | **WWII bullet holes:** returning planes had holes in the wings. The army wanted to armour the wings. Abraham Wald said to armour the engines, because planes hit *there* never came back. The lesson: the data you *don't* see matters. Ask where Meera might have the same problem (customers who never come back leave no orders). |
| 45–70 | Real uses | The slides' use cases (customers, health, games). Add: Swiggy and Zomato delivery times, IPL auctions, UPI fraud detection. In groups, each picks one and lists 3 questions the data answers. |
| 70–90 | Careers | Data analyst → data scientist → ML engineer. What freshers are asked in interviews: SQL, Python (Pandas), one dashboard tool. "You already have Tableau. In 6 weeks you'll have Pandas." |

**Tip:** keep the energy on stories and their questions. The slides are the backup, not the script.
`,

  // -------------------------------------------------------------------------
  "python-practice": `
${story}
**Chapter 6: "Meera's test day."** Goal: check that everyone can use the basics before Pandas, without it feeling like an exam.

| Time | What | Notes |
|---|---|---|
| 0–10 | Setup | Teams of 3, mixing strong and weak students. Each team names its "cart". |
| 10–55 | Speed round | 5 Thattukada challenges on the board, each one worth points. Teams solve them in Colab. Help is allowed *within* a team only. |
| 55–75 | Python basics quiz | Turn the practice quiz on from the admin session page. |
| 75–90 | Review | Go over the quiz question most people missed. Crown the winning cart. |

**Challenges (easy → hard):**
1. A menu dict: print every item that costs under ₹20.
2. A list of 10 order amounts: print the total, the average and the biggest order.
3. Clean a list of names: strip spaces, title case, remove duplicates.
4. A billing function \`bill(amount, age, is_student)\` that applies the discounts from Chapter 3.
5. **Boss:** a list of \`(customer, amount)\` tuples → a dict of total spend per customer.

**Tip:** the boss level is a \`groupby\` written by hand. Next class, show them Pandas doing it in one line. That's the "wow" moment.
`,

  // -------------------------------------------------------------------------
  "pandas-1": `
${story}
**Chapter 7: "The spreadsheet arrives."** Goal: load a CSV into a DataFrame and get its shape, types and summary in 3 lines. Then the **rematch with Tableau**.

| Time | What | Notes |
|---|---|---|
| 0–10 | Wow moment | Re-solve the Chapter 6 boss level in one line of Pandas. Let them react. |
| 10–25 | Libraries | NumPy, Pandas and Matplotlib as Meera's three tools: calculator, spreadsheet, chart-maker. NumPy demo: "Petrol went up 8%. Raise every price at once" (below). |
| 25–50 | First DataFrame | \`read_csv\`, \`head()\`, \`shape\`, \`info()\`, \`describe()\`. Ask: "How many rows? Which columns have blanks? Which are text?" |
| 50–80 | **Rematch with Tableau** | Load the Superstore data they used in Tableau. Challenge: get total sales, sales by region, and the sub-category that loses the most money. They already know the answers from Tableau, so they can check themselves. |
| 80–90 | Debrief | "How many clicks did that take in Tableau? How many lines here?" |

~~~python
import numpy as np
prices = np.array([15, 12, 20, 40, 30])
print((prices * 1.08).round())          # every price, at once

import pandas as pd
df = pd.read_csv("superstore.csv")
print(df.shape)
df.info()
print(df["Sales"].sum())
print(df.groupby("Region")["Sales"].sum().sort_values())
print(df.groupby("Sub-Category")["Profit"].sum().sort_values().head(3))
~~~

**Check figures** (the full Superstore file, 10,194 rows; your Tableau version may differ slightly): total sales about **$2,326,534**; West is highest (about $739.8K) and South is lowest (about $391.7K); **Tables** lose the most (about **−$17,753**), then Bookcases (−$3,632).

**Getting the file into Colab:** download it as CSV, then use the folder icon on the left → upload. Or mount Drive.
`,

  // -------------------------------------------------------------------------
  "pandas-2": `
${story}
**Chapter 8: "Find the leak."** Goal: select columns, filter rows with conditions, and sort, by asking detective questions.

| Time | What | Notes |
|---|---|---|
| 0–10 | Story | Meera: "Somewhere we're *losing* money on orders. Find me the leak." |
| 10–40 | Filters | Live-code: one column, several columns, filter \`df[df["Profit"] < 0]\`, combine filters with \`&\` and \`\\|\`, \`sort_values\`. Each filter answers one question. |
| 40–70 | Detective cards | In pairs, each pair gets 3 question cards (below) and answers them in Pandas. Write the answers on the board. |
| 70–90 | The verdict | Pairs present: "The leak is ___ because ___." The class challenges any weak evidence. |

~~~python
loss = df[df["Profit"] < 0]
print(len(loss), "orders lost money")
big_disc = df[(df["Discount"] >= 0.5) & (df["Profit"] < 0)]
print(big_disc[["Sub-Category", "Discount", "Profit"]].sort_values("Profit").head(10))
~~~

**Detective cards:** Which region has the most loss-making orders? Do high discounts always mean losses? Which customer generated the biggest single loss? What share of Furniture orders lose money? Which ship mode do loss-making orders use most?

**Watch for:** \`and\` / \`or\` don't work between Pandas columns. Use \`&\` / \`|\` with brackets around each condition.
`,

  // -------------------------------------------------------------------------
  "pandas-3": `
${story}
**Chapter 9: "The franchise sheet is a mess."** Goal: find and fix the classic data problems: blanks, wrong types, inconsistent text, duplicates and impossible values.

| Time | What | Notes |
|---|---|---|
| 0–10 | Story | The new franchise owners send their menu sheet (messy Indian street foods CSV). Show the raw file. "Find everything wrong with it." Students call out problems and you list them on the board. |
| 10–50 | Clean it together | Fix one problem at a time (code below). Tick each item off the board list as it's fixed. |
| 50–60 | Plot twist | Run \`drop_duplicates()\` *before* \`strip()\`: Pani Puri is still duplicated. Why? (One copy has a leading space.) **Order of cleaning matters.** |
| 60–85 | Assignment 4 | Employees dirty dataset: same moves, new mess. |
| 85–90 | Exit question | "Name 3 kinds of dirt you'll look for in *any* new dataset." |

**What's wrong with the file** (16 rows): leading space in " Pani Puri"; Category has mixed case (chaat/Chaat); one City is blank; Price mixes "₹30", "70 INR", "Thirty Five", "One Twenty" and a blank; Is_Vegetarian is yes/Yes/TRUE/true/NO; Rating has "Five" and an impossible **6.2**; Pani Puri appears twice.

~~~python
df = pd.read_csv("messy_indian_street_foods.csv")
df["Food"] = df["Food"].str.strip()
df["Category"] = df["Category"].str.title()
df = df.drop_duplicates()
words = {"Thirty Five": "35", "One Twenty": "120"}
df["Price"] = (df["Price"].replace(words)
                 .str.replace("₹", "").str.replace("INR", "").str.strip())
df["Price"] = pd.to_numeric(df["Price"])
df["Is_Vegetarian"] = df["Is_Vegetarian"].str.lower().isin(["yes", "true"])
df["Rating"] = pd.to_numeric(df["Rating"], errors="coerce")
df.loc[df["Rating"] > 5, "Rating"] = None
df["City"] = df["City"].fillna("Unknown")
print(df.groupby("Category")["Price"].mean().round(1))
~~~

Result: 15 rows. Average price: Meal ₹82.5, Beverage ₹55, Sweet ₹42.5, Snack ₹31.2, Chaat ₹30.

**Discuss:** should "Five" become 5, or be blanked? Should a blank price be filled with 0 (no: that's a lie) or left blank? There's no single right answer, but always say what you did.
`,

  // -------------------------------------------------------------------------
  "pandas-4": `
${story}
**Chapter 10: "Which city, which crop?"** Goal: \`groupby\` + \`agg\`, pivot tables, and reshaping wide data to long with \`melt\`.

| Time | What | Notes |
|---|---|---|
| 0–10 | Story | Meera is choosing where to open next and what to source locally: "Which states grow the most rice and pulses?" The government data arrives *wide*: one column per crop per year. |
| 10–35 | groupby + agg | Back on Superstore: \`groupby("Region").agg(...)\` with sum, mean and count. Then \`pivot_table\` (Region × Category). "This is your Tableau crosstab." |
| 35–55 | Wide → long | Show the problem: you can't group by crop when each crop is its own column. \`melt\` fixes it, then \`str.split\` breaks "Cereals_Rice_2009to10" into Category, Crop and Period. |
| 55–85 | Assignment 5 | State-wise agricultural production: melt, split, then answer 2 questions with groupby. |
| 85–90 | Recap | Wide is for reading, long is for analysing. |

~~~python
summary = df.groupby("Region").agg(total_sales=("Sales", "sum"),
                                   avg_profit=("Profit", "mean"),
                                   orders=("Order ID", "nunique"))
pd.pivot_table(df, index="Region", columns="Category", values="Sales", aggfunc="sum")

long = agri.melt(id_vars=["Country", "State"], var_name="Crop", value_name="Quantity")
long[["Category", "CropName", "Period"]] = long["Crop"].str.split("_", expand=True)
long.groupby("CropName")["Quantity"].sum().sort_values(ascending=False).head()
~~~
`,

  // -------------------------------------------------------------------------
  "pandas-5": `
${story}
**Chapter 11: "The audit."** Goal: take one raw file all the way to a tidy table and an answer, on their own.

| Time | What | Notes |
|---|---|---|
| 0–10 | Story | An investor wants to see clean sales by shipping mode and customer segment before funding Meera. The accountant sends the Orders file: wide, mostly empty, and dates stored as text. |
| 10–25 | Diagnose | Students run \`head\` / \`info\` / \`isna().sum()\` and list the problems themselves this time. |
| 25–70 | Clean it, in pairs | Melt to long, drop the empty rows, split "FirstClass_Consumer" into Ship_Mode + Segment, convert Date, then pivot back for the investor. |
| 70–90 | Show and tell | 2 pairs show their final table. Compare: did both get the same totals? If not, find where they diverged. |

~~~python
orders = pd.read_csv("orders_dirty.csv")
long = (orders.melt(id_vars="Date", var_name="Ship_Segment", value_name="Sales")
              .dropna(subset=["Sales"]))
long[["Ship_Mode", "Segment"]] = long["Ship_Segment"].str.split("_", expand=True)
long["Date"] = pd.to_datetime(long["Date"], format="%d-%b-%y")
long.pivot_table(index="Ship_Mode", columns="Segment", values="Sales", aggfunc="sum").round(0)
~~~

**Watch for:** one row has no sales at all (24-Oct-13). It disappears after \`dropna\`, which is correct, but ask them to *notice* it.
`,

  // -------------------------------------------------------------------------
  "matplotlib-1": `
${story}
**Chapter 12: "The investor pitch."** Goal: line, bar and scatter charts with titles and labels, each chosen to answer one question.

| Time | What | Notes |
|---|---|---|
| 0–15 | Hook: Anscombe's quartet | Show 4 datasets with the *same* mean, variance and correlation. Then plot them: 4 completely different pictures. "Never trust a summary you haven't plotted." (code below) |
| 15–45 | Three charts, three questions | Bar: "Which category earns most?" Line: "Are sales growing month by month?" Scatter: "Do discounts kill profit?" (Superstore). Build each one live. |
| 45–75 | Pitch deck | Pairs make 2 charts for Meera's investor from the cleaned street-food data or Superstore. Each chart needs a title that *states the finding*, not just the topic. |
| 75–90 | Pitch | 3 pairs pitch in 60 seconds each. The class plays investor: "Would you fund her?" |

~~~python
import matplotlib.pyplot as plt
import seaborn as sns
a = sns.load_dataset("anscombe")
print(a.groupby("dataset")[["x", "y"]].agg(["mean", "var"]).round(2))
fig, axes = plt.subplots(1, 4, figsize=(14, 3), sharey=True)
for ax, (name, d) in zip(axes, a.groupby("dataset")):
    ax.scatter(d["x"], d["y"]); ax.set_title(name)
plt.show()

monthly = df.set_index(pd.to_datetime(df["Order Date"]))["Sales"].resample("ME").sum()
monthly.plot(title="Sales peak in September, November and December")
plt.ylabel("Sales ($)"); plt.show()
~~~

**Tip:** "Sales by category" is a topic; "Technology earns the most profit" is a finding. Make them rewrite titles until they're findings.

**Show:** one visual essay from **The Pudding** (pudding.cool) as inspiration for what charts plus a story can do.
`,

  // -------------------------------------------------------------------------
  "matplotlib-2": `
${story}
**Chapter 13: "Side quest: the IPL scout."** Meera sponsors a local team, and the coach wants help at the auction. Goal: stacked bars, histograms and subplots, plus cleaning real sports data.

| Time | What | Notes |
|---|---|---|
| 0–10 | Hook: Moneyball | A poor baseball team used data instead of reputations to find cheap, undervalued players. "You have a budget. Who do you buy?" |
| 10–25 | Clean first | The IPL file has the *same* traps they fixed in Tableau: "-" means zero, and "*" means not out (73* → 73). Do it in Pandas (below). |
| 25–55 | Charts | Histogram of strike rates ("half of all batters sit between ___ and ___"). Stacked bar of 50s and 100s per team. A 2×2 subplot "scouting report". |
| 55–85 | Assignment 6 | Start it in class. |
| 85–90 | Debate | "Kohli scored the most runs. Is he the best buy?" Make them argue using strike rate and runs per innings, not fame. |

~~~python
ipl = pd.read_csv("ipl_2024.csv").replace("-", 0)
ipl["Highest Score"] = ipl["Highest Score"].astype(str).str.replace("*", "").astype(int)
num = ["Runs", "Strike Rate", "Innings Batted", "Not Outs", "100", "50"]
ipl[num] = ipl[num].apply(pd.to_numeric)
batters = ipl[ipl["Innings Batted"] >= 5]
batters["Strike Rate"].plot.hist(bins=15, title="Half of all batters strike between 130 and 165")
plt.show()
batters.groupby("Team Name")[["50", "100"]].sum().plot.barh(stacked=True); plt.show()
~~~

**Check figures** (207 players; 95 batted 5+ innings): Kohli has the most runs (741), then Gaikwad (583) and Parag (573). Fastest scorers with 5+ innings: Shepherd (271, but only 5 innings: a good sample-size debate), Fraser-McGurk (234), Dhoni (221). Half of these batters strike between about 131 and 164. Among players with 10+ innings, **Pooran's average (62.4) edges Kohli's (61.8)** at a much higher strike rate (178 vs 155): a great debate starter.
`,

  // -------------------------------------------------------------------------
  "project-build": `
${story}
**Chapter 14: "The newsroom."** Plot twist: a news channel borrows Meera's data team on counting day. Goal: teams run a full project (question → clean → analyse → chart → recommend) in Python and Tableau.

| Time | What | Notes |
|---|---|---|
| 0–15 | Brief | Teams of 2–3. Data: election results (the suggested final project), or their own (OTT/Netflix, a student survey, campus energy, from the Hackathon idea list). |
| 15–30 | Questions | Each team writes 3 questions on a card. You approve them or sharpen them before any code is written. A vague question means a vague project. |
| 30–80 | Build | Clean in Pandas, then chart in Matplotlib. Then **one** Tableau dashboard for the main question. Walk around; ask each team "what's your finding so far?" |
| 80–90 | Stand-up | Each team gives a one-sentence finding. It's fine if it's not final. |

**Rule for the project:** using Gemini in Colab is allowed, but every team member must be able to explain every line. You'll pick a random line during the presentation.
`,

  // -------------------------------------------------------------------------
  "project-present": `
${story}
**Chapter 15: "Pitch to Meera."** Goal: present like an analyst: question, finding, evidence, recommendation, in 5 minutes.

| Time | What | Notes |
|---|---|---|
| 0–5 | Format | Shark-Tank style: each team has 5 minutes plus 2 minutes of questions. The class and you are the panel. |
| 5–80 | Presentations | Score each team on: clear question · clean data (say what you fixed) · one strong chart · a recommendation. Ask one "explain this line of code" question per team. |
| 80–90 | Close the story | Meera's closing line: "You started with one variable for one pazham pori. Now you can clean, analyse and chart 10,000 rows." Preview the AI module: "Next, we teach the computer to help you." |

**Scoring** (out of 10 each): question 2 · cleaning 2 · analysis 2 · chart 2 · recommendation 2.
`,
};
