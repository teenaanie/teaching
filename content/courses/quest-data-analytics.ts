import { colab, drive, gdoc, gsheet, gslides, type CourseSeed } from "../types";
import { sessionQuizzes } from "./quest-data-analytics-session-quizzes";

// ---------------------------------------------------------------------------
// Drive material (Quest Center shared folders)
// ---------------------------------------------------------------------------
const basic = {
  curriculum: gdoc("1OrBw6UYMMJ-F_roUPOBMOq1HbFV8k6uJjimLjGE0B2U"),
  futureOfDA: gdoc("15fSBqMFkHBV5r_J4w_nAQolkvrAznYoCC961HRV08UM"),
  udSlides: drive("16koBjyRFiQVCbtjJczLvbLxrE_C-aszA"),
  tableauSlides: gslides("1eG-nV0dYwRtI_sCDwLNzkB-jfgjWMCraVFl4dWifYmo"),
  udVideo1: drive("1mYpsMR7YTLclyQqReOKk5SUysQuzLZYG"),
  udVideo2: drive("1jFez_gCsAX01dkLdS9byXcu9U-u6XUHH"),
  tableauVideo: [
    drive("18xZbumOFCamkzAxEb2ysX2dXvJOs8kof"),
    drive("17mRODYHscKzUgrDeON5hvAVaxB_w4EHy"),
    drive("139tpyBvBAV42MBGqAWbWxXduTfeg7dMD"),
    drive("1S5VbZHFGZnm70uHd8CyDr-f5-oWTlctf"),
    drive("1EZsqaV3IEF8OIKjNCZW6Hvqa9Uc3pejE"),
    drive("1ked7IxgMf0lEAjMOhxxLesMwv3Y_TnOL"),
    drive("1Y32Pl0y7U5w-lm9dxEyKACweZ40siKu8"),
  ],
  a1: drive("1y0qmCVzV9prUhht23rGeNxvlEFC1yR9p"),
  a2: drive("1OMdVTy_agAmZIQizMyC1oFZXe3haJEOT"),
  a2Solution: drive("107HBDs71njR9WFDIUzb2hDmKmqvpfZhx"),
  a3: drive("12vZU1-1TvwG0BTzNiVZSQWe2mbfsLxZM"),
  a4: drive("1-I--xsw-NhC7gjkiVqM_46Lo-xxLcc1r"),
  a5: drive("1xJECdFcMEsRzG_9GZ5by8UfHOpLIUUqq"),
  superstore: gsheet("1K03dDWwD58to59w-1IZ7Nl1lpbvICes16PpyZw42LbY"),
  electronics: gsheet("1xZNM_T9s5f-6gzuHJhoezowLZEVNZk_04dkudtpMz7g"),
  studentData: gsheet("1SJ0c7UXz-pBP7Tmc-qOp1twWgDTeAoiL6clnTWypYj0"),
};

const py = {
  curriculum: gdoc("1GFq-k3ZHFln2EMmoEjp1IcY-ZyTyQbJxQKsvM_W-49U"),
  notes: gdoc("1zkvT12EsOCuwGdg0zypmEKLgYI2BHe8mpIfkYn_gKxM"),
  slides: drive("1N-u9E3iPsCRtl14iDO15w-jyyqx_t11o"),
  nb1: colab("1Lqm8IctOZNzQX-aQGlJNeEa5elrE_NH8"),
  nb2: colab("1iX2Dixp8KV5l8mMwUsfya8iNHgi-cfk_"),
  nb3: colab("11PWXvf3WNTiSLnZupdwuvx25DAZ4NXDr"),
  pandasNb: colab("1iP6MirjcqU1muwvK_RiCpWCd7bZuY6Sk"),
  matplotlibNb: colab("18FCjl5QdoQ3LTsl2CZrhqLZYh9HxC4pn"),
  introVideo: [
    drive("1OvdkDdGLKnBIU7Wpp4Sk8ezOe6coSYk-"),
    drive("1IWIAFjDaJXtzgnH3DouciCIWvZkJbq6N"),
    drive("11ouEQsOy0gU5ciB3bzzLQJUbopaav_M8"),
    drive("111fK3MtGxNZppDJY7255CALjYDmzMNUV"),
    drive("1B0OmULOuhtvIfFBjDNXOmi9eWPpVlhqr"),
  ],
  pandasVideo: [
    drive("1nuqCmuGQehwvpfEQMW7e4V0baY9X31Hj"),
    drive("1fckxJj8Ey-RbNwFVc9NmBe5cUyIsbpLk"),
    drive("1WJ1yO6b3WArqBq5HVX_oPEOq66IYv_E8"),
    drive("1d65yxVr92fcN8X1XGWTdG98a1EhRmt8p"),
    drive("1mOLgEKlm7FF4ok8yTSKsB3K8TOeiT35Y"),
  ],
  matplotlibVideo: [
    drive("1x4w-yhsioICFK6jzpl6WF60rwZ8Xpqjt"),
    drive("1WelSQqqxn_Cc7_EGlG0axelLMiMxB9Ax"),
    drive("1tw7_RVrp6UXhekow0bGiygKJXVtYcCxc"),
  ],
  streetFoods: drive("1nVF2stxRinuoxp0Sqca8rUNA_nt3XkdL"),
  ordersDirty: drive("1NUInTpjW8qaaYXQv8oqHsi72X5dSDbZq"),
  superstoreCsv: drive("1UEe7VY3CMAr9Sd98P0O0stXEQzfkRffa"),
  a1: gdoc("1H__Z6BmaN90mZAvXse6jTNkMrKGRq31s5HXJlrG2REw"),
  a2: gdoc("1Qdj3xLqgG0rIAmvXL4G4x14MKMejCiigIiE9Aq7nL7o"),
  a3: gdoc("15hsUMluxxNfYaYQ3TuTEab1jo7AA_iMwS_S1Y1Nrk4E"),
  bonus: gdoc("1EJiY5cojM6QG1A64nqi7m6AGpNFtDBUXhi9saFzZLHk"),
  a4: drive("1EwEPuZeWdrwU3e0OZftSnn0bb9GyK2xe"),
  a4Data: gsheet("1IE4fjGhimKjCfyNsP33-mPVNpjsJSLVcKV-aD9Ct-58"),
  a5: drive("1__wWvvlPaNwWasHS5FBbq2tIueg08r2T"),
  a5Data: gsheet("16ZI_s0ha-Li5GVA4YQ2Q8x_1nB57OwFqBmw8FuNKccY"),
  a6: drive("1eqK1KP6F-42lxWFqz9lP5zabuBY256j_"),
  a6Data: gsheet("1eg6SRYcmD8v0Z9spnUJmPRsgTVVj75U-5274cANMh48"),
  hackathon: gdoc("1iUs4PZmqZ8-E6Od_ZbaCnOhvowb-sDG2vx-xO0wNdvA"),
};

const submitNote =
  "**Recording tip:** a screen recording with your voice explaining the steps is perfect. You don't need to turn on your camera. If you can't record, a Google Doc with screenshots and a written explanation of each step is accepted too.";

// ---------------------------------------------------------------------------
// Course
// ---------------------------------------------------------------------------
const course: CourseSeed = {
  type: "course",
  slug: "quest-data-analytics",
  title: "Quest for Data Analytics",
  description:
    "Turning raw data into something a business can act on: statistics, Tableau, Python (Pandas, Matplotlib) and AI tools. A Quest Center programme for final-year BCA / BSc CS students.",
  modules: [
    // =======================================================================
    {
      slug: "basic",
      code: "TQDA-01",
      title: "Data Analytics with Tableau",
      summary: "Statistics, understanding data, and visualising data in Tableau.",
      grading: { attendance: 20, quiz: 10, assignment: 70 },
      lessons: [
        {
          slug: "what-is-statistics",
          title: "Welcome: what is statistics?",
          summary: "What data analysts do, what statistics means, and how we organise raw data into tables and frequency distributions.",
          resources: [
            { type: "doc", title: "Course curriculum", url: basic.curriculum },
            { type: "doc", title: "The future of data analytics", url: basic.futureOfDA },
          ],
          bodyMd: `
### What you'll learn
- What a data analyst does all day and why companies hire them
- What **statistics** means: collecting, organising, presenting and interpreting data
- The difference between **data** and **information**
- How to organise raw data: **statistical tables**, **rank order**, **frequency distribution** and **cumulative frequency**

### Key ideas
| Term | Meaning | Example |
|---|---|---|
| Raw data | Values as they were collected | Marks of 20 students in any order |
| Rank order | Data sorted from lowest to highest | 34, 41, 41, 56, ... |
| Frequency | How many times a value or range appears | 5 students scored 60–69 |
| Cumulative frequency | Running total of frequencies | 12 students scored below 70 |

### Try it
Open a new Google Sheet. Type the number of hours you slept each night last week. Sort it, then count how many nights were under 6 hours, 6–8 hours and over 8 hours. You've just made a frequency table.
`,
          beforeNextMd: "Join the Google Classroom with the class code, and make sure you can open Google Sheets on the lab PC with your college account.",
          notesMd: `
**Goal:** students leave knowing what the course is, how it's graded, and what statistics is for.

| Time | What | Notes |
|---|---|---|
| 0–15 | Introductions | Your story: why data. Ask 3–4 students what they want after BCA. |
| 15–30 | The course map | Show the schedule page. Tableau → Python → AI tools → hackathon. Grading: attendance 20, quizzes 10, assignments 70. |
| 30–55 | What is statistics | Collect → organise → present → interpret. Use a class example: everyone's travel time to college. |
| 55–80 | Hands-on | Each student enters their own travel time in a shared sheet. Sort, make a frequency table together. |
| 80–90 | Wrap | Classroom code on the board. Preview next class: charts. |

**Watch for:** students who don't have Classroom access yet. Note their names.
`,
        },
        {
          slug: "presenting-data",
          title: "Presenting data with charts",
          summary: "Which chart to use when: line, bar/column, pie, scatter and histogram in Google Sheets.",
          resources: [
            { type: "doc", title: "Assignment 1 brief and rubric", url: basic.a1 },
          ],
          bodyMd: `
### What you'll learn
- Why we draw charts: people see patterns faster than they read numbers
- Choosing the right chart for the question

| Question you're asking | Chart |
|---|---|
| How does something change over time? | **Line** |
| How do categories compare? | **Bar / column** |
| What share of the whole is each part? | **Pie** (few categories only) |
| Are two numbers related? | **Scatter** |
| How are values spread out? | **Histogram** |

### In Google Sheets
1. Select your data, including the header row
2. **Insert → Chart**
3. In the Chart editor change the **Chart type**
4. Under **Customise**, add a chart title and axis titles. A chart without labels is only half done.

### Common mistakes
- A pie chart with 12 slices: use a bar chart instead
- A line chart for categories that aren't in time order
- Missing axis titles or units
`,
          beforeNextMd: "Start Assignment 1. Find a small dataset you care about: cricket scores, prices at a shop, your monthly phone data use.",
          notesMd: `
**Goal:** every student creates all five chart types once in class, so the assignment is practice and not a first attempt.

| Time | What | Notes |
|---|---|---|
| 0–10 | Recap | Ask: "What is a frequency distribution?" Get 2 answers. |
| 10–25 | Hook | Show the same data as a table and as a bar chart. Ask which one they understood faster. |
| 25–45 | Demo | Live in Sheets with a 2-column dataset (months × sales). Make line → column → pie. Add a second column (ad spend) for scatter. Use marks data for a histogram. |
| 45–80 | Hands-on | Pairs or individual. Give them a small dataset (or their own) and have them build all five charts with titles. Walk around. |
| 80–90 | Assignment 1 | Walk through the rubric (45 marks). Explain that a screen recording with voice is enough and the camera is not required. |

**Likely questions**
- *"Bar or column?"* Same chart, just horizontal or vertical. Use bar when the labels are long.
- *"Histogram vs bar?"* A histogram groups numbers into ranges and the bars touch; a bar chart compares categories.
- *"How do I record my screen?"* Windows: **Win+Alt+R** (Xbox Game Bar) or the Snipping Tool's video mode. Or use Loom or ScreenPal free in the browser.
`,
        },
        {
          slug: "central-tendency",
          title: "Mean, median and mode",
          summary: "Three ways to describe the 'middle' of data, when each one misleads, and how to calculate them in Sheets.",
          resources: [{ type: "doc", title: "Assignment 2 brief and rubric", url: basic.a2 }],
          bodyMd: `
### What you'll learn
- **Mean**: add everything, divide by the count. \`=AVERAGE(A2:A21)\`
- **Median**: the middle value after sorting. \`=MEDIAN(A2:A21)\`
- **Mode**: the most common value. \`=MODE(A2:A21)\`

### Why three?
Imagine 9 people earn ₹20,000 a month and one earns ₹10,00,000.
- Mean = ₹1,18,000, which describes nobody
- Median = ₹20,000, which describes the typical person

**Outliers pull the mean, not the median.** That's why news reports often quote *median* income.

### Try it
In Sheets, enter the marks below and calculate all three:
\`45, 67, 67, 72, 80, 81, 81, 81, 90, 12\`
Now delete the 12. Which measure changed most?
`,
          notesMd: `
**Goal:** students can calculate all three by hand and in Sheets, and explain which one to trust when there are outliers.

| Time | What | Notes |
|---|---|---|
| 0–10 | Recap | Show 3 charts and ask which chart type each one is and why. |
| 10–25 | Hook | The salary example on the board. Ask "What's the average salary?" before revealing the mean vs the median. |
| 25–45 | By hand | 7 numbers on the board; class calculates mean, median, mode on paper. Then an even count for the median (average of the two middle values). |
| 45–75 | In Sheets | AVERAGE, MEDIAN, MODE, plus MIN, MAX, COUNT. Students use a dataset of 20 values (cricket runs or marks). |
| 75–90 | Exit question | "A shop owner wants the typical bill size, and a few customers bought furniture. Mean or median?" |

**Watch for:** MODE returns only one value if there are ties. Mention \`MODE.MULT\` for interest.
`,
        },
        {
          slug: "spread-and-normal-curve",
          title: "Spread, standard deviation and the normal curve",
          summary: "How spread out is the data? Range, standard deviation, the bell curve and skewness.",
          resources: [
            { type: "doc", title: "Assignment 2 brief and rubric", url: basic.a2 },
            { type: "video", title: "Assignment 2 walkthrough (sample solution)", url: basic.a2Solution },
          ],
          bodyMd: `
### What you'll learn
- **Range** = max − min. Simple, but one outlier changes it a lot.
- **Standard deviation (SD)**: roughly the average distance of values from the mean. \`=STDEV(A2:A21)\`
  - Small SD → values are close together
  - Large SD → values are spread out
- **Normal curve (bell curve)**: many natural measurements (heights, exam marks in a big class) pile up around the mean and thin out evenly on both sides
- **Skewness**: when one tail is longer
  - *Right (positive) skew*: a few very large values, e.g. incomes. Mean > median.
  - *Left (negative) skew*: a few very small values, e.g. marks in an easy test. Mean < median.

### Two classes, same mean
| Class A | 48, 50, 50, 52 | mean 50, SD ≈ 1.6 |
|---|---|---|
| **Class B** | **20, 30, 70, 80** | **mean 50, SD ≈ 29** |

Same average, very different classes. Always report the spread with the average.
`,
          beforeNextMd: "Submit Assignment 2 on Google Classroom. Take the Statistics quiz if it's open.",
          notesMd: `
**Goal:** students understand SD intuitively ("typical distance from the mean") and can spot skew from a histogram.

| Time | What | Notes |
|---|---|---|
| 0–10 | Recap quiz | Ask aloud: mean vs median with an outlier. |
| 10–25 | Hook | The Class A vs Class B table. "Same average, so are they the same class?" |
| 25–45 | Concept | Draw the bell curve. Mark mean ±1 SD (about 68% of values). Then draw right and left skew; ask where the mean sits relative to the median. |
| 45–75 | Hands-on | Sheets: STDEV on two datasets plus a histogram of each. Students write one sentence comparing them. |
| 75–85 | Assignment 2 | Rubric (50 marks). Show the sample solution video for a minute. |
| 85–90 | Quiz | Open the **Statistics quiz** in Settings, put the PIN on the board, students take it on the lab PCs. |

**Likely question:** *"STDEV or STDEVP?"* STDEV is for a sample, STDEVP for the whole population. For this course, STDEV is fine.
`,
        },
        {
          slug: "understanding-data-1",
          title: "Understanding data: types and the right questions",
          summary: "Quantitative vs qualitative, discrete vs continuous, nominal vs ordinal, structured vs unstructured, and how to ask useful questions of a dataset.",
          resources: [
            { type: "video", title: "Understanding Data, part 1", url: basic.udVideo1 },
            { type: "slides", title: "Understanding Data slides", url: basic.udSlides },
          ],
          bodyMd: `
### Types of data
| Type | Meaning | Example |
|---|---|---|
| **Quantitative** | Measured as a number | Price, temperature |
| ↳ Discrete | Counted, whole numbers | Number of students |
| ↳ Continuous | Measured, any value in a range | Height, temperature |
| **Qualitative** | A characteristic, not a number | State, colour |
| ↳ Nominal | Categories with no order | Which state someone is from |
| ↳ Ordinal | Categories with an order | Primary < Secondary < Higher secondary |

**Structured** data fits rows and columns (a spreadsheet of orders). **Unstructured** data doesn't (photos of vendor quotes, WhatsApp messages, videos).

### Asking the right questions
Good questions are **specific** and **answerable with the data you have**.
- ❌ "Is the business doing well?"
- ✅ "Which month had the lowest sales last year, and which product dropped most that month?"

### Why analyse data? Four reasons
1. **Cost savings**: stop buying ingredients for dishes nobody orders
2. **Better decisions**: stock more of what sells in each area
3. **Know your customers**: which age group visits most
4. **Stay competitive**: offer discounts on the slowest days
`,
          notesMd: `
**Goal:** students can classify any column in a dataset and turn a vague goal into 3 specific questions.

| Time | What | Notes |
|---|---|---|
| 0–10 | Recap | Quickly go over Statistics quiz results and common mistakes. |
| 10–25 | Hook | Slide: a juice-shop menu. Ask "What questions can this data answer?" Write them all on the board. |
| 25–50 | Data types | Go through the table. Then a game: call out a column ("PIN code", "rating 1–5", "weight") and the class shouts the type. PIN code is a good trap: it's a number but *nominal*. |
| 50–75 | Hands-on | Open the **Superstore** sheet. In pairs, label every column's type, then write 4 questions the data could answer. |
| 75–90 | Share | 3 pairs read out their best question. Improve one vague question together. |

**Watch for:** confusion between ordinal and discrete. Ordinal is about *order of categories*; discrete is about *counting*.
`,
        },
        {
          slug: "understanding-data-2",
          title: "Understanding data: insights and data stories",
          summary: "Categorising data, finding patterns, questioning results (correlation vs causation) and telling a story with a chart.",
          resources: [
            { type: "video", title: "Understanding Data, part 2", url: basic.udVideo2 },
            { type: "slides", title: "Understanding Data slides", url: basic.udSlides },
            { type: "dataset", title: "Superstore data (Google Sheet)", url: basic.superstore },
            { type: "doc", title: "Assignment 3 brief and rubric", url: basic.a3 },
          ],
          bodyMd: `
### From data to insight
1. **Categorise**: group the data so it answers your question (by month? by product? cost vs earnings?)
2. **Look for patterns**: "Sales drop every February."
3. **Ask why**: "Is it fewer days? Exams? A price change?"
4. **Question the result**: is the data complete? Is there another explanation?

### Correlation is not causation
Ice-cream sales and drowning incidents both rise in summer. Ice cream doesn't cause drowning; **heat** drives both. When two things move together, look for a hidden third factor before claiming one causes the other.

### Data tells a story
Case study: India's 2024 general election results. 543 seats; one alliance won 293 seats and the other 234. The same numbers can be shown as a seat map, a bar chart by party, or a change-from-2019 chart. Each tells a different story. Pick the chart that answers *your* question.
`,
          beforeNextMd: "Assignment 3: copy the Superstore sheet, write 4 questions, build 4 charts that answer them, and put it all in Google Slides. Submit on Classroom.",
          notesMd: `
**Goal:** students practise the full loop (question → chart → insight → doubt) on Superstore data, ready for Assignment 3.

| Time | What | Notes |
|---|---|---|
| 0–10 | Recap | Data types lightning round, 5 columns. |
| 10–25 | Hook | Correlation ≠ causation: ice cream and drowning. Ask for their own examples (they come up with good ones). |
| 25–45 | Demo | In Sheets, use a pivot table on Superstore: sales by region and by category. Turn each into a chart and say the insight aloud in one sentence. |
| 45–75 | Hands-on | Students start Assignment 3 in class: 4 questions, 2 charts done before leaving. |
| 75–85 | Assignment 3 | Rubric (25 marks). Slides go to Classroom. |
| 85–90 | Quiz | Open the **Understanding Data quiz**. |

**Election case study:** keep it to the numbers and chart choice. Steer clear of political opinion: "We're looking at how the data is shown, not who should have won."
`,
        },
        {
          slug: "tableau-setup",
          title: "Why Tableau? Setting up Tableau Public",
          summary: "Why visualise, Anscombe's quartet, Tableau vs spreadsheets, creating a Tableau Public account and the data source page.",
          resources: [
            { type: "video", title: "Tableau, part 1", url: basic.tableauVideo[0] },
            { type: "slides", title: "Visualising data with Tableau (slides)", url: basic.tableauSlides },
            { type: "link", title: "Tableau Public (sign up / sign in)", url: "https://public.tableau.com" },
          ],
          bodyMd: `
### Why visualise?
**Anscombe's quartet**: four datasets with the *same* mean, standard deviation and correlation look completely different when plotted. Statistics alone can hide the story.

### Tableau vs Sheets/Excel
| Tableau | Sheets / Excel |
|---|---|
| Built for visualisation and dashboards | Built for calculation and preparation |
| Handles large data well | Best for moderate data |
| Connects to many data sources easily | Needs plugins for many sources |

### Setup (in class)
1. Create a free account at **public.tableau.com**
2. **Create → Web Authoring**
3. Connect to a file: upload the Superstore sample data
4. Explore the **Data Source page**: tables on the left, canvas at the top, data grid below
`,
          notesMd: `
**Goal:** every student has a working Tableau Public account and has loaded Superstore data before leaving.

| Time | What | Notes |
|---|---|---|
| 0–15 | Hook | Anscombe's quartet: show the four tables first and ask "Are they the same?", then the four plots. |
| 15–30 | Why Tableau | Comparison table. Mention that Power BI and Looker Studio feel similar once you know Tableau. |
| 30–60 | Setup together | Everyone signs up. **Lab tip:** check before class that public.tableau.com isn't blocked on the lab network. Have a backup: a few students can share one account in pairs. |
| 60–85 | Data source page | Upload Superstore. Point out the field types (Abc, #, calendar, globe). |
| 85–90 | Wrap | Watch Tableau part 2 before next class if possible. |

**Watch for:** sign-up emails going to spam; students who used a college email they can't access.
`,
        },
        {
          slug: "tableau-data-prep",
          title: "Tableau data prep: types, calculated fields, joins",
          summary: "Renaming, hiding and changing data types; creating calculated fields; combining tables with relationships and joins.",
          resources: [
            { type: "video", title: "Tableau, part 2", url: basic.tableauVideo[1] },
            { type: "video", title: "Tableau, part 3", url: basic.tableauVideo[2] },
            { type: "slides", title: "Visualising data with Tableau (slides)", url: basic.tableauSlides },
          ],
          bodyMd: `
### Preparing data
- **Rename / hide** a field: right-click the column
- **Change data type**: click the type icon above the column
- **Discrete vs continuous** in Tableau: blue pills are discrete (counted), green pills are continuous (measured)

### Calculated fields
New fields from existing ones:
- \`Profit = [Sale Revenue] - [Sale Cost]\`
- \`First Name = SPLIT([Name], " ", 1)\`

### Combining tables
- **Relationships** (the default, "noodles"): Tableau combines tables only as needed for each chart. Use these first.
- **Joins** (open a logical table to see them): physically merge tables on a common column such as Customer ID.
`,
          notesMd: `
**Goal:** students can make a calculated field and relate two tables, the two skills Assignment 4 needs.

| Time | What | Notes |
|---|---|---|
| 0–10 | Recap | Data source page parts. |
| 10–40 | Demo | Rename, hide, change type. Calculated field: Profit Ratio = SUM([Profit])/SUM([Sales]). |
| 40–60 | Relationships | Use Global Electronics Retailer (Sales, Products, Customers, Stores). Drag tables onto the canvas and match the keys. |
| 60–85 | Hands-on | Students relate the Electronics tables and create the **Sale Price** calculated field. |
| 85–90 | Wrap | Preview: building charts next class. |
`,
        },
        {
          slug: "tableau-first-charts",
          title: "Dimensions, measures and your first charts",
          summary: "The worksheet page, dimensions vs measures, shelves and marks; tables and bar charts.",
          resources: [
            { type: "video", title: "Tableau, part 4", url: basic.tableauVideo[3] },
            { type: "dataset", title: "Global Electronics Retailer (Google Sheet)", url: basic.electronics },
            { type: "doc", title: "Assignment 4 brief and rubric", url: basic.a4 },
          ],
          bodyMd: `
### Dimensions and measures
| Dimensions | Measures |
|---|---|
| Describe *what* the data is about | The numbers you analyse |
| Product name, region, customer type | Sales revenue, units sold, average price |

Drag fields to **Rows** and **Columns** shelves to build a chart. Drag onto the **Marks** card (Colour, Size, Label) to add detail.

### First charts
- **Text table**: precise, but low visual impact
- **Bar chart**: best for comparing categories
`,
          beforeNextMd: `Start Assignment 4 (Global Electronics Retailer): relate the tables, create three calculated fields, and build three charts for the CEO.\n\n${submitNote}`,
        },
        {
          slug: "tableau-comparing-charts",
          title: "Line, pie and treemap charts",
          summary: "Trends over time with line charts, part-to-whole with pie charts and treemaps, and when not to use them.",
          resources: [{ type: "video", title: "Tableau, part 5", url: basic.tableauVideo[4] }],
          bodyMd: `
| Chart | Use it for | Avoid when |
|---|---|---|
| Line | Trends over time | Categories with no time order |
| Pie | Share of a whole, few categories | More than ~5 slices |
| Treemap | Hierarchies (category → sub-category) by size and colour | The audience is new to them |
`,
        },
        {
          slug: "tableau-special-charts",
          title: "Heatmaps, scatter plots, box plots and maps",
          summary: "Highlight tables and heatmaps, scatter plots for relationships, box plots for distributions, choropleth maps.",
          resources: [
            { type: "video", title: "Tableau, part 6", url: basic.tableauVideo[5] },
            { type: "dataset", title: "Student data (Google Sheet)", url: basic.studentData },
            { type: "doc", title: "Assignment 5 brief and rubric", url: basic.a5 },
          ],
          bodyMd: `
- **Highlight table / heatmap**: colour shows where the big numbers are
- **Scatter plot**: is there a relationship between two measures?
- **Box plot**: median, quartiles and outliers at a glance (remember the spread from the statistics lessons)
- **Choropleth map**: colour regions by a value

**Tip for scatter and box plots:** if you only see one dot, turn off **Analysis → Aggregate Measures**.
`,
          beforeNextMd: "Assignment 5 (student data): answer the questions with charts in a Google Doc and be ready to present your findings in class.",
        },
        {
          slug: "tableau-dashboards",
          title: "Dashboards and data stories",
          summary: "Combining charts into a dashboard, adding filters, and presenting insights clearly.",
          resources: [{ type: "video", title: "Tableau, part 7", url: basic.tableauVideo[6] }],
          bodyMd: `
A **dashboard** puts several charts on one screen so someone can answer their questions without asking you.

1. **New Dashboard** → drag sheets in
2. Add a **filter** and set it to apply to all sheets
3. Give it a title that states the insight, e.g. "Laptop sales doubled in Q4", not "Sales Dashboard"
`,
        },
      ],
      assessments: [
        {
          slug: "a1-charts",
          kind: "assignment",
          title: "Assignment 1: Different graph types",
          maxScore: 45,
          lesson: "presenting-data",
          briefUrl: basic.a1,
          briefMd: `Create a **line graph, column/bar graph, pie chart, scatter diagram and histogram** using any data of your choice in Google Sheets. Record a short video of the steps and submit it with the sheet.\n\n${submitNote}`,
        },
        {
          slug: "a2-mean-median-mode",
          kind: "assignment",
          title: "Assignment 2: Mean, median, mode and SD",
          maxScore: 50,
          lesson: "central-tendency",
          briefUrl: basic.a2,
          briefMd: `Calculate **mean, median, mode and standard deviation** for any data of your choice in Google Sheets. Record a short video of the steps and submit it with the sheet.\n\n${submitNote}`,
        },
        {
          slug: "quiz-statistics",
          kind: "quiz",
          title: "Quiz: Statistics",
          maxScore: 10,
          lesson: "spread-and-normal-curve",
          questions: [
            { prompt: "Which chart is best for showing how sales changed month by month?", options: ["Pie chart", "Line chart", "Scatter plot", "Histogram"], answer: 1 },
            { prompt: "What is the median of 3, 9, 4, 7, 5?", options: ["4", "5", "5.6", "7"], answer: 1, explanation: "Sorted: 3, 4, 5, 7, 9. The middle value is 5." },
            { prompt: "Nine people earn ₹20,000 and one earns ₹10,00,000. Which measure best describes a typical income?", options: ["Mean", "Median", "Range", "Maximum"], answer: 1, explanation: "The outlier pulls the mean up; the median stays at ₹20,000." },
            { prompt: "What is the mode of 2, 4, 4, 6, 6, 6, 8?", options: ["4", "5.1", "6", "8"], answer: 2 },
            { prompt: "Which Google Sheets function calculates the mean?", options: ["=MEAN()", "=AVERAGE()", "=MEDIAN()", "=SUM()"], answer: 1 },
            { prompt: "A small standard deviation means…", options: ["Values are close to the mean", "Values are spread far apart", "The mean is small", "There are few values"], answer: 0 },
            { prompt: "Which chart shows how values are spread across ranges (e.g. how many students scored 60–69)?", options: ["Pie chart", "Line chart", "Histogram", "Scatter plot"], answer: 2 },
            { prompt: "Incomes usually have a few very large values. The distribution is…", options: ["Symmetric", "Right (positively) skewed", "Left (negatively) skewed", "Uniform"], answer: 1, explanation: "A long tail of large values on the right; the mean is pulled above the median." },
            { prompt: "Cumulative frequency is…", options: ["The most common value", "The running total of frequencies", "The difference between max and min", "The average frequency"], answer: 1 },
            { prompt: "Which chart helps you see whether study hours and marks are related?", options: ["Pie chart", "Scatter plot", "Histogram", "Table"], answer: 1 },
          ],
        },
        {
          slug: "a3-understanding-data",
          kind: "assignment",
          title: "Assignment 3: Questions and charts from Superstore data",
          maxScore: 25,
          lesson: "understanding-data-2",
          briefUrl: basic.a3,
          briefMd: `1. Copy the [Superstore data](${basic.superstore}) into your own Google Sheet\n2. Create a slide with **4 questions** you want to ask of this data\n3. Create slides with **4 visualisations** that answer them\n4. Submit your slides on Google Classroom`,
        },
        {
          slug: "quiz-understanding-data",
          kind: "quiz",
          title: "Quiz: Understanding Data",
          maxScore: 10,
          lesson: "understanding-data-2",
          questions: [
            { prompt: "Temperature recorded every hour is…", options: ["Discrete", "Continuous", "Nominal", "Ordinal"], answer: 1 },
            { prompt: "The state a person comes from is…", options: ["Ordinal", "Continuous", "Nominal", "Discrete"], answer: 2, explanation: "Categories with no order are nominal." },
            { prompt: "Education level (Primary, Secondary, Higher Secondary) is…", options: ["Nominal", "Ordinal", "Continuous", "Unstructured"], answer: 1 },
            { prompt: "A PIN code like 411001 is best treated as…", options: ["Continuous number", "Nominal category", "Ordinal category", "Measure to average"], answer: 1, explanation: "It's written with digits, but averaging PIN codes means nothing." },
            { prompt: "Which of these is unstructured data?", options: ["A sheet of daily sales", "Photos of vendor price quotes", "A table of student marks", "A CSV of orders"], answer: 1 },
            { prompt: "Which is the most useful question to ask a sales dataset?", options: ["Is the business good?", "What is data?", "Which product's sales fell most in February?", "Why do people buy things?"], answer: 2 },
            { prompt: "Ice-cream sales and drowning incidents both rise in summer. This shows…", options: ["Ice cream causes drowning", "Correlation, probably caused by a third factor (heat)", "No relationship", "Drowning causes ice-cream sales"], answer: 1 },
            { prompt: "A restaurant wants to know which months are most profitable. It should group orders by…", options: ["Customer name", "Month", "Dish colour", "Table number"], answer: 1 },
            { prompt: "Number of students in a class is…", options: ["Continuous", "Discrete", "Nominal", "Unstructured"], answer: 1 },
            { prompt: "Identifying which items people rarely order, so you stop buying their ingredients, is an example of…", options: ["Cost savings", "Data cleaning", "Unstructured data", "Causation"], answer: 0 },
          ],
        },
        {
          slug: "a4-tableau-simple",
          kind: "assignment",
          title: "Assignment 4: Tableau, Global Electronics Retailer",
          maxScore: 40,
          lesson: "tableau-first-charts",
          briefUrl: basic.a4,
          briefMd: `Using the [Global Electronics Retailer](${basic.electronics}) data:\n\n**Part 1, data preparation:** combine the tables, hide extra columns, and create the calculated fields *Sale Price*, *Profit* and *Customer age* (use DATEDIFF and TODAY).\n\n**Part 2, visualisation:** create **three** charts for the company's CEO showing products, geographies, trends over time or customer segments.\n\nSubmit a short video of the steps on Google Classroom.\n\n${submitNote}`,
        },
        {
          slug: "a5-tableau-complex",
          kind: "assignment",
          title: "Assignment 5: Tableau, student data",
          maxScore: 50,
          lesson: "tableau-special-charts",
          briefUrl: basic.a5,
          briefMd: `Using the [student data](${basic.studentData}), answer the questions in the brief with charts: averages, a bar chart by major, a pie chart by gender, a **box plot** of GPA by major, a **stacked bar** of scholarship vs part-time job, and a **scatter plot** of GPA vs credits.\n\nSubmit a Google Doc with answers and screenshots, and present your findings in class.`,
        },
        {
          slug: "quiz-tableau",
          kind: "quiz",
          title: "Quiz: Tableau",
          maxScore: 10,
          lesson: "tableau-dashboards",
          questions: [
            { prompt: "In Tableau, 'Region' and 'Product Name' are usually…", options: ["Measures", "Dimensions", "Calculated fields", "Filters only"], answer: 1 },
            { prompt: "'Sales' and 'Quantity' are usually…", options: ["Dimensions", "Measures", "Joins", "Relationships"], answer: 1 },
            { prompt: "Anscombe's quartet shows that…", options: ["Pie charts are best", "Datasets with identical statistics can look very different when plotted", "Tableau is faster than Excel", "Mean is always better than median"], answer: 1 },
            { prompt: "Which chart is best for a trend over time?", options: ["Treemap", "Line chart", "Pie chart", "Highlight table"], answer: 1 },
            { prompt: "Which chart shows median, quartiles and outliers?", options: ["Box plot", "Pie chart", "Line chart", "Treemap"], answer: 0 },
            { prompt: "Your scatter plot shows a single dot. What should you try?", options: ["Add more filters", "Turn off Analysis → Aggregate Measures", "Change it to a pie chart", "Delete the data source"], answer: 1 },
            { prompt: "Profit = [Sales] − [Cost] in Tableau is a…", options: ["Join", "Calculated field", "Dimension", "Dashboard"], answer: 1 },
            { prompt: "Combining a Sales table and a Customers table on Customer ID uses…", options: ["A relationship or join", "A pie chart", "A filter", "A treemap"], answer: 0 },
            { prompt: "A pie chart is a poor choice when…", options: ["There are 2–3 categories", "There are 12 categories", "You show share of a whole", "The audience is new"], answer: 1 },
            { prompt: "A good dashboard title…", options: ["'Dashboard 1'", "States the insight, e.g. 'Laptop sales doubled in Q4'", "Is left blank", "Lists every field"], answer: 1 },
          ],
        },
      ],
    },

    // =======================================================================
    {
      slug: "python",
      code: "TQDA-03",
      title: "Data Analytics with Python",
      summary: "Python basics in Google Colab, then Pandas and Matplotlib for real analysis.",
      grading: { attendance: 20, assignment: 50, hackathon: 30 },
      lessons: [
        {
          slug: "python-intro",
          title: "Hello Python: Colab and data types",
          summary: "What Python is, using Google Colab, variables, and numeric, string and boolean types.",
          resources: [
            { type: "video", title: "Intro to Python, part 1", url: py.introVideo[0] },
            { type: "notebook", title: "Python basics, session 1", url: py.nb1 },
            { type: "video", title: "Intro to Python, part 2", url: py.introVideo[1] },
            { type: "slides", title: "Data Analytics with Python (slides)", url: py.slides },
            { type: "doc", title: "Python notes", url: py.notes },
          ],
          bodyMd: `
### Getting started
1. Open the session notebook: **File → Save a copy in Drive** so you can edit it
2. Run a cell with **Shift + Enter**

### Data types
| Type | Example |
|---|---|
| \`int\` | \`42\` |
| \`float\` | \`97.7\` |
| \`str\` | \`"Hello"\` |
| \`bool\` | \`True\` / \`False\` |

Use \`type(x)\` to check a variable's type and \`int()\`, \`float()\`, \`str()\` to convert.
`,
        },
        {
          slug: "python-data-structures",
          title: "Lists, tuples, dictionaries and sets",
          summary: "Storing many values: lists, tuples, dicts and sets, and the methods you'll use most.",
          resources: [
            { type: "video", title: "Intro to Python, part 3", url: py.introVideo[2] },
            { type: "notebook", title: "Python basics, session 2", url: py.nb2 },
          ],
        },
        {
          slug: "python-operators-conditionals",
          title: "Operators and if/else",
          summary: "Arithmetic, comparison and logical operators; making decisions with if / elif / else.",
          resources: [
            { type: "video", title: "Intro to Python, part 4", url: py.introVideo[3] },
            { type: "notebook", title: "Python basics, session 3", url: py.nb3 },
          ],
        },
        {
          slug: "python-loops",
          title: "Loops: for, while, break and continue",
          summary: "Repeating work with for and while loops; break and continue.",
          resources: [
            { type: "video", title: "Intro to Python, part 5", url: py.introVideo[4] },
            { type: "notebook", title: "Python basics, session 3", url: py.nb3 },
            { type: "doc", title: "Bonus assignment", url: py.bonus },
          ],
        },
        {
          slug: "python-for-analytics",
          title: "Why Python for data analytics?",
          summary: "Analytics recap, real-world uses, Python vs Excel, and careers in data.",
          resources: [{ type: "slides", title: "Data Analytics with Python (slides)", url: py.slides }],
        },
        {
          slug: "python-practice",
          title: "Python practice lab",
          summary: "Mixed practice on everything so far, plus the Python basics quiz.",
          resources: [
            { type: "notebook", title: "Python basics, session 1", url: py.nb1 },
            { type: "notebook", title: "Python basics, session 2", url: py.nb2 },
            { type: "notebook", title: "Python basics, session 3", url: py.nb3 },
          ],
        },
        {
          slug: "pandas-1",
          title: "Pandas 1: DataFrames and reading data",
          summary: "Key Python libraries; loading a CSV into a DataFrame; head, info, describe.",
          resources: [
            { type: "video", title: "Pandas, part 1", url: py.pandasVideo[0] },
            { type: "notebook", title: "Pandas notebook", url: py.pandasNb },
            { type: "dataset", title: "Superstore data (CSV)", url: py.superstoreCsv },
          ],
        },
        {
          slug: "pandas-2",
          title: "Pandas 2: selecting, filtering and sorting",
          summary: "Choosing columns and rows, boolean filters, sorting values.",
          resources: [
            { type: "video", title: "Pandas, part 2", url: py.pandasVideo[1] },
            { type: "notebook", title: "Pandas notebook", url: py.pandasNb },
          ],
        },
        {
          slug: "pandas-3",
          title: "Pandas 3: cleaning messy data",
          summary: "Missing values, wrong types, duplicates and messy text, using the Indian street foods dataset.",
          resources: [
            { type: "video", title: "Pandas, part 3", url: py.pandasVideo[2] },
            { type: "notebook", title: "Pandas notebook", url: py.pandasNb },
            { type: "dataset", title: "Messy Indian street foods (CSV)", url: py.streetFoods },
            { type: "dataset", title: "Employees dirty dataset (Assignment 4)", url: py.a4Data },
          ],
        },
        {
          slug: "pandas-4",
          title: "Pandas 4: group, aggregate and reshape",
          summary: "groupby, agg, pivot tables and melting/transposing data.",
          resources: [
            { type: "video", title: "Pandas, part 4", url: py.pandasVideo[3] },
            { type: "notebook", title: "Pandas notebook", url: py.pandasNb },
            { type: "dataset", title: "State-wise agricultural production (Assignment 5)", url: py.a5Data },
          ],
        },
        {
          slug: "pandas-5",
          title: "Pandas 5: end-to-end cleaning practice",
          summary: "A full clean-up on the dirty Orders dataset, from raw file to tidy table.",
          resources: [
            { type: "video", title: "Pandas, part 5", url: py.pandasVideo[4] },
            { type: "dataset", title: "Orders dirty dataset (CSV)", url: py.ordersDirty },
          ],
        },
        {
          slug: "matplotlib-1",
          title: "Matplotlib 1: line, bar and scatter",
          summary: "Plotting with Matplotlib from Pandas data: titles, labels and colours.",
          resources: [
            { type: "video", title: "Matplotlib, part 1", url: py.matplotlibVideo[0] },
            { type: "video", title: "Matplotlib, part 2", url: py.matplotlibVideo[1] },
            { type: "notebook", title: "Matplotlib notebook", url: py.matplotlibNb },
          ],
        },
        {
          slug: "matplotlib-2",
          title: "Matplotlib 2: stacked bars, histograms and subplots",
          summary: "More chart types and multiple plots per figure, using IPL 2024 batting data.",
          resources: [
            { type: "video", title: "Matplotlib, part 3", url: py.matplotlibVideo[2] },
            { type: "notebook", title: "Matplotlib notebook", url: py.matplotlibNb },
            { type: "dataset", title: "IPL batting averages 2024 (Assignment 6)", url: py.a6Data },
          ],
        },
        {
          slug: "project-build",
          title: "Project: Tableau + Python, end to end",
          summary: "The steps of a data analysis project: question, collect, clean, analyse, visualise, present.",
          bodyMd: `
### Project brief
Pick a dataset (your own, or one from class). In teams of 2–3 that you choose yourselves:
1. Write **3 questions** the data can answer
2. **Clean** the data in Python (Pandas)
3. **Analyse and plot** in Python (Matplotlib)
4. Build **one Tableau dashboard** that answers your main question
5. Present in **5 minutes**: question → what you found → one recommendation
`,
        },
        {
          slug: "project-present",
          title: "Project presentations",
          summary: "Each team presents their Tableau + Python project.",
        },
      ],
      assessments: [
        {
          slug: "py-a1-data-types",
          kind: "assignment",
          title: "Python Assignment 1: Variables and data types",
          maxScore: 20,
          lesson: "python-intro",
          briefUrl: py.a1,
          briefMd: "Exercises on variables, numbers, strings and booleans. Make a copy of the brief into a Colab notebook, solve each exercise, and submit the notebook link on Classroom.",
        },
        {
          slug: "py-a2-data-structures",
          kind: "assignment",
          title: "Python Assignment 2: Lists, tuples, dicts and sets",
          maxScore: 20,
          lesson: "python-data-structures",
          briefUrl: py.a2,
          briefMd: "Exercises on lists, dictionaries and calculations with them. Submit your Colab notebook link on Classroom.",
        },
        {
          slug: "py-a3-conditionals",
          kind: "assignment",
          title: "Python Assignment 3: Operators and conditionals",
          maxScore: 20,
          lesson: "python-loops",
          briefUrl: py.a3,
          briefMd: "Three small programs: age categories (with a ticket-price bonus), an even/odd loop with break and continue, and a pass/fail marks checker. Submit your Colab notebook link on Classroom.",
        },
        {
          slug: "py-a4-cleaning",
          kind: "assignment",
          title: "Python Assignment 4: Data cleaning with Pandas",
          maxScore: 25,
          lesson: "pandas-3",
          briefUrl: py.a4,
          briefMd: `Clean the [Employees dataset](${py.a4Data}) with Pandas: fix ages (21–65; fill blanks with the mean), emails missing @, dates (to_datetime), phone numbers with extra symbols, remove duplicates, rename a column.`,
        },
        {
          slug: "py-a5-reshape",
          kind: "assignment",
          title: "Python Assignment 5: Transposing data with Pandas",
          maxScore: 25,
          lesson: "pandas-4",
          briefUrl: py.a5,
          briefMd: `Clean and reshape the [state-wise agricultural production data](${py.a5Data}) into five columns: **State, Category, Crop, TimePeriod, Quantity**.`,
        },
        {
          slug: "py-a6-matplotlib",
          kind: "assignment",
          title: "Python Assignment 6: Plots with Matplotlib (IPL 2024)",
          maxScore: 25,
          lesson: "matplotlib-2",
          briefUrl: py.a6,
          briefMd: `Using the [IPL 2024 batting data](${py.a6Data}): a red bar chart of one team's strike rates, a stacked bar of runs by team and player, and scatter plots of highest score vs strike rate for two teams, with your conclusion.`,
        },
        {
          slug: "quiz-python-basics",
          kind: "quiz",
          title: "Quiz: Python basics (practice)",
          maxScore: 10,
          lesson: "python-practice",
          questions: [
            { prompt: "What does type(3.5) return?", options: ["int", "float", "str", "bool"], answer: 1 },
            { prompt: "What is the output of print(7 // 2)?", options: ["3.5", "3", "4", "1"], answer: 1, explanation: "// is floor division." },
            { prompt: "What is the output of print(7 % 2)?", options: ["3", "1", "0", "3.5"], answer: 1, explanation: "% gives the remainder." },
            { prompt: "Which of these is mutable (can be changed after creation)?", options: ["Tuple", "String", "List", "Integer"], answer: 2 },
            { prompt: "How do you add 'jam' to the end of a list called items?", options: ["items.add('jam')", "items.append('jam')", "items.insert('jam')", "items + 'jam'"], answer: 1 },
            { prompt: "d = {'name': 'Plato', 'born': -427}. How do you get the birth year?", options: ["d[1]", "d.born", "d['born']", "d('born')"], answer: 2 },
            { prompt: "What does a set automatically remove?", options: ["Numbers", "Duplicates", "Strings", "Nothing"], answer: 1 },
            { prompt: "What type does input() return?", options: ["int", "float", "str", "Depends on what the user types"], answer: 2 },
            { prompt: "In a loop, what does `continue` do?", options: ["Stops the loop completely", "Skips to the next iteration", "Restarts the program", "Prints the value"], answer: 1 },
            { prompt: "What is the value of (5 > 3) and (2 > 4)?", options: ["True", "False", "None", "Error"], answer: 1 },
          ],
        },
        {
          slug: "quiz-pandas-matplotlib",
          kind: "quiz",
          title: "Quiz: Pandas and Matplotlib (practice)",
          maxScore: 10,
          lesson: "matplotlib-2",
          questions: [
            { prompt: "Which line loads a CSV into a DataFrame?", options: ["pd.open('data.csv')", "pd.read_csv('data.csv')", "pd.load('data.csv')", "pd.DataFrame('data.csv')"], answer: 1 },
            { prompt: "df.head() shows…", options: ["The last 5 rows", "The first 5 rows", "Column types", "Summary statistics"], answer: 1 },
            { prompt: "Which method gives count, mean, std, min and max for numeric columns?", options: ["df.info()", "df.describe()", "df.shape", "df.columns"], answer: 1 },
            { prompt: "How do you select rows where Age is over 30?", options: ["df[df['Age'] > 30]", "df.Age > 30", "df.select(Age > 30)", "df.filter('Age' > 30)"], answer: 0 },
            { prompt: "Which removes duplicate rows?", options: ["df.dropna()", "df.drop_duplicates()", "df.unique()", "df.clean()"], answer: 1 },
            { prompt: "df.fillna(df['Age'].mean()) is used to…", options: ["Delete missing ages", "Replace missing values with the mean", "Sort by age", "Rename the column"], answer: 1 },
            { prompt: "df.groupby('Team')['Runs'].sum() gives…", options: ["Total runs per team", "Number of teams", "Average runs overall", "Runs of the first team"], answer: 0 },
            { prompt: "Which Matplotlib function draws a bar chart?", options: ["plt.plot()", "plt.bar()", "plt.scatter()", "plt.hist()"], answer: 1 },
            { prompt: "How do you label the x-axis?", options: ["plt.xaxis('Runs')", "plt.xlabel('Runs')", "plt.label_x('Runs')", "plt.title('Runs')"], answer: 1 },
            { prompt: "Which chart best checks whether highest score and strike rate are related?", options: ["Pie", "Scatter", "Stacked bar", "Line"], answer: 1 },
          ],
        },
        {
          slug: "project",
          kind: "project",
          title: "Project: Tableau + Python",
          maxScore: 50,
          lesson: "project-build",
          briefMd: "Team project (2–3 students): 3 questions → clean in Pandas → plot in Matplotlib → one Tableau dashboard → 5-minute presentation.",
        },
        {
          slug: "hackathon",
          kind: "hackathon",
          title: "Hackathon",
          maxScore: 100,
          lesson: "hackathon-ideas",
          briefUrl: py.hackathon,
          briefMd:
            "Pick an idea (e.g. campus energy/resource dashboard, student life and performance survey, movie and OTT data explorer), submit a one-page idea write-up before the hackathon starts, then build and present your analysis.",
        },
      ],
    },

    // =======================================================================
    {
      slug: "ai-tools",
      title: "AI Tools for Data Analysts",
      summary: "What large language models are, prompting for data work, checking AI output, and responsible use; then hackathon prep.",
      // Placeholder weights: adjust when Quest Center confirms how this module is graded.
      grading: { attendance: 50, quiz: 50 },
      lessons: [
        {
          slug: "ai-what-are-llms",
          title: "What are large language models?",
          summary: "How chat assistants like ChatGPT, Gemini and Claude work, at the level you need: predicting text, training data, and why they sometimes make things up.",
        },
        {
          slug: "ai-prompting-for-data",
          title: "Prompting for data work",
          summary: "Writing clear prompts: give context, the data's shape, the output you want, and ask for steps. Using AI to explain errors and write formulas.",
        },
        {
          slug: "ai-in-colab-and-sheets",
          title: "AI inside Colab and Sheets, and checking its work",
          summary: "Using AI assistants in Colab and Google Sheets, and the habit of verifying every number it gives you.",
        },
        {
          slug: "ai-responsible-use",
          title: "Responsible AI and your career",
          summary: "Privacy (never paste personal data), bias, plagiarism and honesty, and how AI is changing analyst jobs.",
        },
        { slug: "hackathon-ideas", title: "Hackathon: ideas and teams", summary: "Choosing a problem, forming teams, writing the one-page idea." },
        { slug: "hackathon-data", title: "Hackathon: collecting and cleaning data", summary: "Getting the data and making it usable." },
        { slug: "hackathon-build", title: "Hackathon: build day", summary: "Analysis, charts and a dashboard." },
        { slug: "hackathon-present", title: "Hackathon: presentations", summary: "Teams present their insights and recommendations." },
      ],
      assessments: [
        {
          slug: "quiz-ai-tools",
          kind: "quiz",
          title: "Quiz: AI tools",
          maxScore: 10,
          lesson: "ai-responsible-use",
          questions: [
            { prompt: "A large language model produces answers mainly by…", options: ["Looking up a database of facts", "Predicting likely next words based on patterns in training data", "Searching Google every time", "Running Excel formulas"], answer: 1 },
            { prompt: "When an AI confidently states something false, this is called…", options: ["Debugging", "A hallucination", "Overfitting", "Encryption"], answer: 1 },
            { prompt: "Which prompt will get the most useful help with a Pandas error?", options: ["'fix my code'", "'Python error help'", "Paste the code, the full error message, and describe what you expected", "'why is pandas bad'"], answer: 2 },
            { prompt: "An AI gives you the average of a column. You should…", options: ["Trust it", "Check it with a formula or code yourself", "Round it", "Ask a different AI and pick one"], answer: 1 },
            { prompt: "Which should you NOT paste into a public AI chat?", options: ["A public dataset's column names", "Students' names and phone numbers", "A Python error message", "A chart description"], answer: 1 },
            { prompt: "Submitting AI-written work as entirely your own is…", options: ["Fine if it's correct", "Dishonest; say how you used AI", "Required", "Only a problem in exams"], answer: 1 },
            { prompt: "Giving the AI the column names and a few sample rows helps because…", options: ["It makes the prompt longer", "The AI understands your data's structure", "It's required by law", "It speeds up your PC"], answer: 1 },
            { prompt: "AI models can reflect bias because…", options: ["They are trained on human-written data that contains bias", "Computers are biased by design", "They use too much electricity", "They can't do maths"], answer: 0 },
            { prompt: "A good use of AI for a data analyst is…", options: ["Writing a first draft of a formula and then testing it", "Making up data you don't have", "Replacing all checking", "Avoiding learning Python"], answer: 0 },
            { prompt: "The best way to ask AI for a chart recommendation is to…", options: ["Say 'make a chart'", "Describe the question you're answering and the data types", "Upload nothing", "Ask for the most colourful chart"], answer: 1 },
          ],
        },
      ],
    },
  ],
};

// Add the per-session check-in quizzes after each module's own assessments.
for (const m of course.modules) m.assessments = [...(m.assessments ?? []), ...(sessionQuizzes[m.slug] ?? [])];

export default course;
