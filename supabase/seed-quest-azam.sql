-- Content for the Quest for Data Analytics course and the Azam College 2026–27 class.
-- Generated from content/courses/quest-data-analytics.ts and content/cohorts/azam-2026.ts.
-- Run once in the Supabase SQL editor, AFTER the migration. Safe to re-run: existing rows are skipped.
-- Contains no students or results. Quiz PIN starts as 2026; change it in Admin → Settings.

begin;

INSERT INTO public.courses (id, slug, title, description, created_at) VALUES ('f2651647-7eb6-471f-ac68-77c9a12d65ae', 'quest-data-analytics', 'Quest for Data Analytics', 'Turning raw data into something a business can act on: statistics, Tableau, Python (Pandas, Matplotlib) and AI tools. A Quest Center programme for final-year BCA / BSc CS students.', '2026-10-14 14:12:00.811494+05:30') ON CONFLICT DO NOTHING;

INSERT INTO public.modules (id, course_id, slug, "position", code, title, summary, grading) VALUES ('e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', 'f2651647-7eb6-471f-ac68-77c9a12d65ae', 'basic', 1, 'TQDA-01', 'Data Analytics with Tableau', 'Statistics, understanding data, and visualising data in Tableau.', '{"quiz": 10, "assignment": 70, "attendance": 20}') ON CONFLICT DO NOTHING;
INSERT INTO public.modules (id, course_id, slug, "position", code, title, summary, grading) VALUES ('d4c4deda-0839-4ea1-8421-38cac91d316b', 'f2651647-7eb6-471f-ac68-77c9a12d65ae', 'python', 2, 'TQDA-03', 'Data Analytics with Python', 'Python basics in Google Colab, then Pandas and Matplotlib for real analysis.', '{"hackathon": 30, "assignment": 50, "attendance": 20}') ON CONFLICT DO NOTHING;
INSERT INTO public.modules (id, course_id, slug, "position", code, title, summary, grading) VALUES ('977c14b6-d97d-49a8-8ca5-226ff5329aa6', 'f2651647-7eb6-471f-ac68-77c9a12d65ae', 'ai-tools', 3, NULL, 'AI Tools for Data Analysts', 'What large language models are, prompting for data work, checking AI output, and responsible use; then hackathon prep.', '{"quiz": 50, "attendance": 50}') ON CONFLICT DO NOTHING;

INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('69967216-44dc-4cf5-8d4b-2459b56a5fc0', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', 'what-is-statistics', 1, 'Welcome: what is statistics?', 'What data analysts do, what statistics means, and how we organise raw data into tables and frequency distributions.', '
### What you''ll learn
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
Open a new Google Sheet. Type the number of hours you slept each night last week. Sort it, then count how many nights were under 6 hours, 6–8 hours and over 8 hours. You''ve just made a frequency table.
', 'Join the Google Classroom with the class code, and make sure you can open Google Sheets on the lab PC with your college account.', '[{"url": "https://docs.google.com/document/d/1OrBw6UYMMJ-F_roUPOBMOq1HbFV8k6uJjimLjGE0B2U/edit", "type": "doc", "title": "Course curriculum"}, {"url": "https://docs.google.com/document/d/15fSBqMFkHBV5r_J4w_nAQolkvrAznYoCC961HRV08UM/edit", "type": "doc", "title": "The future of data analytics"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('c650dcbf-b8ed-4161-977c-a9dc7f7eadda', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', 'presenting-data', 2, 'Presenting data with charts', 'Which chart to use when: line, bar/column, pie, scatter and histogram in Google Sheets.', '
### What you''ll learn
- Why we draw charts: people see patterns faster than they read numbers
- Choosing the right chart for the question

| Question you''re asking | Chart |
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
- A line chart for categories that aren''t in time order
- Missing axis titles or units
', 'Start Assignment 1. Find a small dataset you care about: cricket scores, prices at a shop, your monthly phone data use.', '[{"url": "https://drive.google.com/file/d/1y0qmCVzV9prUhht23rGeNxvlEFC1yR9p/view", "type": "doc", "title": "Assignment 1 brief and rubric"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('ce1101b7-5f86-4c27-9c96-14e8667e979c', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', 'central-tendency', 3, 'Mean, median and mode', 'Three ways to describe the ''middle'' of data, when each one misleads, and how to calculate them in Sheets.', '
### What you''ll learn
- **Mean**: add everything, divide by the count. `=AVERAGE(A2:A21)`
- **Median**: the middle value after sorting. `=MEDIAN(A2:A21)`
- **Mode**: the most common value. `=MODE(A2:A21)`

### Why three?
Imagine 9 people earn ₹20,000 a month and one earns ₹10,00,000.
- Mean = ₹1,18,000, which describes nobody
- Median = ₹20,000, which describes the typical person

**Outliers pull the mean, not the median.** That''s why news reports often quote *median* income.

### Try it
In Sheets, enter the marks below and calculate all three:
`45, 67, 67, 72, 80, 81, 81, 81, 90, 12`
Now delete the 12. Which measure changed most?
', NULL, '[{"url": "https://drive.google.com/file/d/1OMdVTy_agAmZIQizMyC1oFZXe3haJEOT/view", "type": "doc", "title": "Assignment 2 brief and rubric"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('46bd3d7b-08f2-4bef-b099-df78d9fc19f1', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', 'spread-and-normal-curve', 4, 'Spread, standard deviation and the normal curve', 'How spread out is the data? Range, standard deviation, the bell curve and skewness.', '
### What you''ll learn
- **Range** = max − min. Simple, but one outlier changes it a lot.
- **Standard deviation (SD)**: roughly the average distance of values from the mean. `=STDEV(A2:A21)`
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
', 'Submit Assignment 2 on Google Classroom. Take the Statistics quiz if it''s open.', '[{"url": "https://drive.google.com/file/d/1OMdVTy_agAmZIQizMyC1oFZXe3haJEOT/view", "type": "doc", "title": "Assignment 2 brief and rubric"}, {"url": "https://drive.google.com/file/d/107HBDs71njR9WFDIUzb2hDmKmqvpfZhx/view", "type": "video", "title": "Assignment 2 walkthrough (sample solution)"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('95710952-1ead-46e0-9c12-d766ccf19d4e', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', 'understanding-data-1', 5, 'Understanding data: types and the right questions', 'Quantitative vs qualitative, discrete vs continuous, nominal vs ordinal, structured vs unstructured, and how to ask useful questions of a dataset.', '
### Types of data
| Type | Meaning | Example |
|---|---|---|
| **Quantitative** | Measured as a number | Price, temperature |
| ↳ Discrete | Counted, whole numbers | Number of students |
| ↳ Continuous | Measured, any value in a range | Height, temperature |
| **Qualitative** | A characteristic, not a number | State, colour |
| ↳ Nominal | Categories with no order | Which state someone is from |
| ↳ Ordinal | Categories with an order | Primary < Secondary < Higher secondary |

**Structured** data fits rows and columns (a spreadsheet of orders). **Unstructured** data doesn''t (photos of vendor quotes, WhatsApp messages, videos).

### Asking the right questions
Good questions are **specific** and **answerable with the data you have**.
- ❌ "Is the business doing well?"
- ✅ "Which month had the lowest sales last year, and which product dropped most that month?"

### Why analyse data? Four reasons
1. **Cost savings**: stop buying ingredients for dishes nobody orders
2. **Better decisions**: stock more of what sells in each area
3. **Know your customers**: which age group visits most
4. **Stay competitive**: offer discounts on the slowest days
', NULL, '[{"url": "https://drive.google.com/file/d/1mYpsMR7YTLclyQqReOKk5SUysQuzLZYG/view", "type": "video", "title": "Understanding Data, part 1"}, {"url": "https://drive.google.com/file/d/16koBjyRFiQVCbtjJczLvbLxrE_C-aszA/view", "type": "slides", "title": "Understanding Data slides"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('4e57ccf1-d5dd-4554-837e-86999c2e16e3', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', 'tableau-dashboards', 12, 'Dashboards and data stories', 'Combining charts into a dashboard, adding filters, and presenting insights clearly.', '
A **dashboard** puts several charts on one screen so someone can answer their questions without asking you.

1. **New Dashboard** → drag sheets in
2. Add a **filter** and set it to apply to all sheets
3. Give it a title that states the insight, e.g. "Laptop sales doubled in Q4", not "Sales Dashboard"
', NULL, '[{"url": "https://drive.google.com/file/d/1Y32Pl0y7U5w-lm9dxEyKACweZ40siKu8/view", "type": "video", "title": "Tableau, part 7"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('0bbc8d8d-130c-415f-93cc-789e47781d08', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', 'understanding-data-2', 6, 'Understanding data: insights and data stories', 'Categorising data, finding patterns, questioning results (correlation vs causation) and telling a story with a chart.', '
### From data to insight
1. **Categorise**: group the data so it answers your question (by month? by product? cost vs earnings?)
2. **Look for patterns**: "Sales drop every February."
3. **Ask why**: "Is it fewer days? Exams? A price change?"
4. **Question the result**: is the data complete? Is there another explanation?

### Correlation is not causation
Ice-cream sales and drowning incidents both rise in summer. Ice cream doesn''t cause drowning; **heat** drives both. When two things move together, look for a hidden third factor before claiming one causes the other.

### Data tells a story
Case study: India''s 2024 general election results. 543 seats; one alliance won 293 seats and the other 234. The same numbers can be shown as a seat map, a bar chart by party, or a change-from-2019 chart. Each tells a different story. Pick the chart that answers *your* question.
', 'Assignment 3: copy the Superstore sheet, write 4 questions, build 4 charts that answer them, and put it all in Google Slides. Submit on Classroom.', '[{"url": "https://drive.google.com/file/d/1jFez_gCsAX01dkLdS9byXcu9U-u6XUHH/view", "type": "video", "title": "Understanding Data, part 2"}, {"url": "https://drive.google.com/file/d/16koBjyRFiQVCbtjJczLvbLxrE_C-aszA/view", "type": "slides", "title": "Understanding Data slides"}, {"url": "https://docs.google.com/spreadsheets/d/1K03dDWwD58to59w-1IZ7Nl1lpbvICes16PpyZw42LbY/edit", "type": "dataset", "title": "Superstore data (Google Sheet)"}, {"url": "https://drive.google.com/file/d/12vZU1-1TvwG0BTzNiVZSQWe2mbfsLxZM/view", "type": "doc", "title": "Assignment 3 brief and rubric"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('53ba7c8f-bb9c-4361-9663-f678e3685af5', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', 'tableau-setup', 7, 'Why Tableau? Setting up Tableau Public', 'Why visualise, Anscombe''s quartet, Tableau vs spreadsheets, creating a Tableau Public account and the data source page.', '
### Why visualise?
**Anscombe''s quartet**: four datasets with the *same* mean, standard deviation and correlation look completely different when plotted. Statistics alone can hide the story.

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
', NULL, '[{"url": "https://drive.google.com/file/d/18xZbumOFCamkzAxEb2ysX2dXvJOs8kof/view", "type": "video", "title": "Tableau, part 1"}, {"url": "https://docs.google.com/presentation/d/1eG-nV0dYwRtI_sCDwLNzkB-jfgjWMCraVFl4dWifYmo/edit", "type": "slides", "title": "Visualising data with Tableau (slides)"}, {"url": "https://public.tableau.com", "type": "link", "title": "Tableau Public (sign up / sign in)"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('b69e257f-840e-4da2-88e3-5af130eaa993', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', 'tableau-data-prep', 8, 'Tableau data prep: types, calculated fields, joins', 'Renaming, hiding and changing data types; creating calculated fields; combining tables with relationships and joins.', '
### Preparing data
- **Rename / hide** a field: right-click the column
- **Change data type**: click the type icon above the column
- **Discrete vs continuous** in Tableau: blue pills are discrete (counted), green pills are continuous (measured)

### Calculated fields
New fields from existing ones:
- `Profit = [Sale Revenue] - [Sale Cost]`
- `First Name = SPLIT([Name], " ", 1)`

### Combining tables
- **Relationships** (the default, "noodles"): Tableau combines tables only as needed for each chart. Use these first.
- **Joins** (open a logical table to see them): physically merge tables on a common column such as Customer ID.
', NULL, '[{"url": "https://drive.google.com/file/d/17mRODYHscKzUgrDeON5hvAVaxB_w4EHy/view", "type": "video", "title": "Tableau, part 2"}, {"url": "https://drive.google.com/file/d/139tpyBvBAV42MBGqAWbWxXduTfeg7dMD/view", "type": "video", "title": "Tableau, part 3"}, {"url": "https://docs.google.com/presentation/d/1eG-nV0dYwRtI_sCDwLNzkB-jfgjWMCraVFl4dWifYmo/edit", "type": "slides", "title": "Visualising data with Tableau (slides)"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('a9d909c5-cdbe-4915-8a7d-67323096e62d', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', 'tableau-first-charts', 9, 'Dimensions, measures and your first charts', 'The worksheet page, dimensions vs measures, shelves and marks; tables and bar charts.', '
### Dimensions and measures
| Dimensions | Measures |
|---|---|
| Describe *what* the data is about | The numbers you analyse |
| Product name, region, customer type | Sales revenue, units sold, average price |

Drag fields to **Rows** and **Columns** shelves to build a chart. Drag onto the **Marks** card (Colour, Size, Label) to add detail.

### First charts
- **Text table**: precise, but low visual impact
- **Bar chart**: best for comparing categories
', 'Start Assignment 4 (Global Electronics Retailer): relate the tables, create three calculated fields, and build three charts for the CEO.

**Recording tip:** a screen recording with your voice explaining the steps is perfect. You don''t need to turn on your camera. If you can''t record, a Google Doc with screenshots and a written explanation of each step is accepted too.', '[{"url": "https://drive.google.com/file/d/1S5VbZHFGZnm70uHd8CyDr-f5-oWTlctf/view", "type": "video", "title": "Tableau, part 4"}, {"url": "https://docs.google.com/spreadsheets/d/1xZNM_T9s5f-6gzuHJhoezowLZEVNZk_04dkudtpMz7g/edit", "type": "dataset", "title": "Global Electronics Retailer (Google Sheet)"}, {"url": "https://drive.google.com/file/d/1-I--xsw-NhC7gjkiVqM_46Lo-xxLcc1r/view", "type": "doc", "title": "Assignment 4 brief and rubric"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('5024a791-be23-4c93-8060-c169fd5e3fe2', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', 'tableau-comparing-charts', 10, 'Line, pie and treemap charts', 'Trends over time with line charts, part-to-whole with pie charts and treemaps, and when not to use them.', '
| Chart | Use it for | Avoid when |
|---|---|---|
| Line | Trends over time | Categories with no time order |
| Pie | Share of a whole, few categories | More than ~5 slices |
| Treemap | Hierarchies (category → sub-category) by size and colour | The audience is new to them |
', NULL, '[{"url": "https://drive.google.com/file/d/1EZsqaV3IEF8OIKjNCZW6Hvqa9Uc3pejE/view", "type": "video", "title": "Tableau, part 5"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('f5dd42e7-05ec-4488-99d2-41d6a7877be4', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', 'tableau-special-charts', 11, 'Heatmaps, scatter plots, box plots and maps', 'Highlight tables and heatmaps, scatter plots for relationships, box plots for distributions, choropleth maps.', '
- **Highlight table / heatmap**: colour shows where the big numbers are
- **Scatter plot**: is there a relationship between two measures?
- **Box plot**: median, quartiles and outliers at a glance (remember the spread from the statistics lessons)
- **Choropleth map**: colour regions by a value

**Tip for scatter and box plots:** if you only see one dot, turn off **Analysis → Aggregate Measures**.
', 'Assignment 5 (student data): answer the questions with charts in a Google Doc and be ready to present your findings in class.', '[{"url": "https://drive.google.com/file/d/1ked7IxgMf0lEAjMOhxxLesMwv3Y_TnOL/view", "type": "video", "title": "Tableau, part 6"}, {"url": "https://docs.google.com/spreadsheets/d/1SJ0c7UXz-pBP7Tmc-qOp1twWgDTeAoiL6clnTWypYj0/edit", "type": "dataset", "title": "Student data (Google Sheet)"}, {"url": "https://drive.google.com/file/d/1xJECdFcMEsRzG_9GZ5by8UfHOpLIUUqq/view", "type": "doc", "title": "Assignment 5 brief and rubric"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('66484dad-2976-4b58-b274-a039bd58a357', 'd4c4deda-0839-4ea1-8421-38cac91d316b', 'python-intro', 1, 'Hello Python: Colab and data types', 'What Python is, using Google Colab, variables, and numeric, string and boolean types.', '
### Getting started
1. Open the session notebook: **File → Save a copy in Drive** so you can edit it
2. Run a cell with **Shift + Enter**

### Data types
| Type | Example |
|---|---|
| `int` | `42` |
| `float` | `97.7` |
| `str` | `"Hello"` |
| `bool` | `True` / `False` |

Use `type(x)` to check a variable''s type and `int()`, `float()`, `str()` to convert.
', NULL, '[{"url": "https://drive.google.com/file/d/1OvdkDdGLKnBIU7Wpp4Sk8ezOe6coSYk-/view", "type": "video", "title": "Intro to Python, part 1"}, {"url": "https://colab.research.google.com/drive/1Lqm8IctOZNzQX-aQGlJNeEa5elrE_NH8", "type": "notebook", "title": "Python basics, session 1"}, {"url": "https://drive.google.com/file/d/1IWIAFjDaJXtzgnH3DouciCIWvZkJbq6N/view", "type": "video", "title": "Intro to Python, part 2"}, {"url": "https://drive.google.com/file/d/1N-u9E3iPsCRtl14iDO15w-jyyqx_t11o/view", "type": "slides", "title": "Data Analytics with Python (slides)"}, {"url": "https://docs.google.com/document/d/1zkvT12EsOCuwGdg0zypmEKLgYI2BHe8mpIfkYn_gKxM/edit", "type": "doc", "title": "Python notes"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('886af659-b608-49bc-8229-0a7735dc8655', 'd4c4deda-0839-4ea1-8421-38cac91d316b', 'python-data-structures', 2, 'Lists, tuples, dictionaries and sets', 'Storing many values: lists, tuples, dicts and sets, and the methods you''ll use most.', NULL, NULL, '[{"url": "https://drive.google.com/file/d/11ouEQsOy0gU5ciB3bzzLQJUbopaav_M8/view", "type": "video", "title": "Intro to Python, part 3"}, {"url": "https://colab.research.google.com/drive/1iX2Dixp8KV5l8mMwUsfya8iNHgi-cfk_", "type": "notebook", "title": "Python basics, session 2"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('fdec74a6-80b9-45f3-ac5a-0ef78050972e', 'd4c4deda-0839-4ea1-8421-38cac91d316b', 'python-operators-conditionals', 3, 'Operators and if/else', 'Arithmetic, comparison and logical operators; making decisions with if / elif / else.', NULL, NULL, '[{"url": "https://drive.google.com/file/d/111fK3MtGxNZppDJY7255CALjYDmzMNUV/view", "type": "video", "title": "Intro to Python, part 4"}, {"url": "https://colab.research.google.com/drive/11PWXvf3WNTiSLnZupdwuvx25DAZ4NXDr", "type": "notebook", "title": "Python basics, session 3"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('35b71571-5084-429c-88c0-2d89652c5715', 'd4c4deda-0839-4ea1-8421-38cac91d316b', 'python-loops', 4, 'Loops: for, while, break and continue', 'Repeating work with for and while loops; break and continue.', NULL, NULL, '[{"url": "https://drive.google.com/file/d/1B0OmULOuhtvIfFBjDNXOmi9eWPpVlhqr/view", "type": "video", "title": "Intro to Python, part 5"}, {"url": "https://colab.research.google.com/drive/11PWXvf3WNTiSLnZupdwuvx25DAZ4NXDr", "type": "notebook", "title": "Python basics, session 3"}, {"url": "https://docs.google.com/document/d/1EJiY5cojM6QG1A64nqi7m6AGpNFtDBUXhi9saFzZLHk/edit", "type": "doc", "title": "Bonus assignment"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('5a222050-9c85-4208-904b-6fe233a8b963', 'd4c4deda-0839-4ea1-8421-38cac91d316b', 'python-for-analytics', 5, 'Why Python for data analytics?', 'Analytics recap, real-world uses, Python vs Excel, and careers in data.', NULL, NULL, '[{"url": "https://drive.google.com/file/d/1N-u9E3iPsCRtl14iDO15w-jyyqx_t11o/view", "type": "slides", "title": "Data Analytics with Python (slides)"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('251cf991-c7c0-481b-b636-bfbabf26b6a6', 'd4c4deda-0839-4ea1-8421-38cac91d316b', 'python-practice', 6, 'Python practice lab', 'Mixed practice on everything so far, plus the Python basics quiz.', NULL, NULL, '[{"url": "https://colab.research.google.com/drive/1Lqm8IctOZNzQX-aQGlJNeEa5elrE_NH8", "type": "notebook", "title": "Python basics, session 1"}, {"url": "https://colab.research.google.com/drive/1iX2Dixp8KV5l8mMwUsfya8iNHgi-cfk_", "type": "notebook", "title": "Python basics, session 2"}, {"url": "https://colab.research.google.com/drive/11PWXvf3WNTiSLnZupdwuvx25DAZ4NXDr", "type": "notebook", "title": "Python basics, session 3"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('ed03cd94-3d5b-4d82-8d7e-aca306148abb', 'd4c4deda-0839-4ea1-8421-38cac91d316b', 'pandas-1', 7, 'Pandas 1: DataFrames and reading data', 'Key Python libraries; loading a CSV into a DataFrame; head, info, describe.', NULL, NULL, '[{"url": "https://drive.google.com/file/d/1nuqCmuGQehwvpfEQMW7e4V0baY9X31Hj/view", "type": "video", "title": "Pandas, part 1"}, {"url": "https://colab.research.google.com/drive/1iP6MirjcqU1muwvK_RiCpWCd7bZuY6Sk", "type": "notebook", "title": "Pandas notebook"}, {"url": "https://drive.google.com/file/d/1UEe7VY3CMAr9Sd98P0O0stXEQzfkRffa/view", "type": "dataset", "title": "Superstore data (CSV)"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('0616acc3-8ddc-40a2-9989-3b8eed119851', 'd4c4deda-0839-4ea1-8421-38cac91d316b', 'pandas-2', 8, 'Pandas 2: selecting, filtering and sorting', 'Choosing columns and rows, boolean filters, sorting values.', NULL, NULL, '[{"url": "https://drive.google.com/file/d/1fckxJj8Ey-RbNwFVc9NmBe5cUyIsbpLk/view", "type": "video", "title": "Pandas, part 2"}, {"url": "https://colab.research.google.com/drive/1iP6MirjcqU1muwvK_RiCpWCd7bZuY6Sk", "type": "notebook", "title": "Pandas notebook"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('2da648bf-e9ce-41f9-9de6-bb8a9dfecacb', 'd4c4deda-0839-4ea1-8421-38cac91d316b', 'pandas-3', 9, 'Pandas 3: cleaning messy data', 'Missing values, wrong types, duplicates and messy text, using the Indian street foods dataset.', NULL, NULL, '[{"url": "https://drive.google.com/file/d/1WJ1yO6b3WArqBq5HVX_oPEOq66IYv_E8/view", "type": "video", "title": "Pandas, part 3"}, {"url": "https://colab.research.google.com/drive/1iP6MirjcqU1muwvK_RiCpWCd7bZuY6Sk", "type": "notebook", "title": "Pandas notebook"}, {"url": "https://drive.google.com/file/d/1nVF2stxRinuoxp0Sqca8rUNA_nt3XkdL/view", "type": "dataset", "title": "Messy Indian street foods (CSV)"}, {"url": "https://docs.google.com/spreadsheets/d/1IE4fjGhimKjCfyNsP33-mPVNpjsJSLVcKV-aD9Ct-58/edit", "type": "dataset", "title": "Employees dirty dataset (Assignment 4)"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('d27cc1fb-9e95-40f5-af0a-0bbc43e510f9', 'd4c4deda-0839-4ea1-8421-38cac91d316b', 'pandas-4', 10, 'Pandas 4: group, aggregate and reshape', 'groupby, agg, pivot tables and melting/transposing data.', NULL, NULL, '[{"url": "https://drive.google.com/file/d/1d65yxVr92fcN8X1XGWTdG98a1EhRmt8p/view", "type": "video", "title": "Pandas, part 4"}, {"url": "https://colab.research.google.com/drive/1iP6MirjcqU1muwvK_RiCpWCd7bZuY6Sk", "type": "notebook", "title": "Pandas notebook"}, {"url": "https://docs.google.com/spreadsheets/d/16ZI_s0ha-Li5GVA4YQ2Q8x_1nB57OwFqBmw8FuNKccY/edit", "type": "dataset", "title": "State-wise agricultural production (Assignment 5)"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('b007eb7c-32f5-403f-b306-7b231b0b718b', 'd4c4deda-0839-4ea1-8421-38cac91d316b', 'pandas-5', 11, 'Pandas 5: end-to-end cleaning practice', 'A full clean-up on the dirty Orders dataset, from raw file to tidy table.', NULL, NULL, '[{"url": "https://drive.google.com/file/d/1mOLgEKlm7FF4ok8yTSKsB3K8TOeiT35Y/view", "type": "video", "title": "Pandas, part 5"}, {"url": "https://drive.google.com/file/d/1NUInTpjW8qaaYXQv8oqHsi72X5dSDbZq/view", "type": "dataset", "title": "Orders dirty dataset (CSV)"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('c12d1986-76e0-4df1-9d7f-0d9ce927a6a2', 'd4c4deda-0839-4ea1-8421-38cac91d316b', 'matplotlib-1', 12, 'Matplotlib 1: line, bar and scatter', 'Plotting with Matplotlib from Pandas data: titles, labels and colours.', NULL, NULL, '[{"url": "https://drive.google.com/file/d/1x4w-yhsioICFK6jzpl6WF60rwZ8Xpqjt/view", "type": "video", "title": "Matplotlib, part 1"}, {"url": "https://drive.google.com/file/d/1WelSQqqxn_Cc7_EGlG0axelLMiMxB9Ax/view", "type": "video", "title": "Matplotlib, part 2"}, {"url": "https://colab.research.google.com/drive/18FCjl5QdoQ3LTsl2CZrhqLZYh9HxC4pn", "type": "notebook", "title": "Matplotlib notebook"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('25d437db-c031-4500-81e4-0c742f87cbb8', 'd4c4deda-0839-4ea1-8421-38cac91d316b', 'matplotlib-2', 13, 'Matplotlib 2: stacked bars, histograms and subplots', 'More chart types and multiple plots per figure, using IPL 2024 batting data.', NULL, NULL, '[{"url": "https://drive.google.com/file/d/1tw7_RVrp6UXhekow0bGiygKJXVtYcCxc/view", "type": "video", "title": "Matplotlib, part 3"}, {"url": "https://colab.research.google.com/drive/18FCjl5QdoQ3LTsl2CZrhqLZYh9HxC4pn", "type": "notebook", "title": "Matplotlib notebook"}, {"url": "https://docs.google.com/spreadsheets/d/1eg6SRYcmD8v0Z9spnUJmPRsgTVVj75U-5274cANMh48/edit", "type": "dataset", "title": "IPL batting averages 2024 (Assignment 6)"}]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('6b1dab32-8ff9-4249-9533-72dbb60b29f4', 'd4c4deda-0839-4ea1-8421-38cac91d316b', 'project-build', 14, 'Project: Tableau + Python, end to end', 'The steps of a data analysis project: question, collect, clean, analyse, visualise, present.', '
### Project brief
Pick a dataset (your own, or one from class). In teams of 2–3 that you choose yourselves:
1. Write **3 questions** the data can answer
2. **Clean** the data in Python (Pandas)
3. **Analyse and plot** in Python (Matplotlib)
4. Build **one Tableau dashboard** that answers your main question
5. Present in **5 minutes**: question → what you found → one recommendation
', NULL, '[]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('e3284100-f4e7-4d2d-b30b-f18ea4b86519', 'd4c4deda-0839-4ea1-8421-38cac91d316b', 'project-present', 15, 'Project presentations', 'Each team presents their Tableau + Python project.', NULL, NULL, '[]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('28d70039-4d88-490f-8d9b-d903df655c9c', '977c14b6-d97d-49a8-8ca5-226ff5329aa6', 'ai-what-are-llms', 1, 'What are large language models?', 'How chat assistants like ChatGPT, Gemini and Claude work, at the level you need: predicting text, training data, and why they sometimes make things up.', NULL, NULL, '[]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('34324da3-f978-4b6a-8d52-9163f2923b70', '977c14b6-d97d-49a8-8ca5-226ff5329aa6', 'ai-prompting-for-data', 2, 'Prompting for data work', 'Writing clear prompts: give context, the data''s shape, the output you want, and ask for steps. Using AI to explain errors and write formulas.', NULL, NULL, '[]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('b34f02e9-0673-4975-a33b-200792533eae', '977c14b6-d97d-49a8-8ca5-226ff5329aa6', 'ai-in-colab-and-sheets', 3, 'AI inside Colab and Sheets, and checking its work', 'Using AI assistants in Colab and Google Sheets, and the habit of verifying every number it gives you.', NULL, NULL, '[]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('46de460d-362e-4169-9d96-7b6f4188e200', '977c14b6-d97d-49a8-8ca5-226ff5329aa6', 'ai-responsible-use', 4, 'Responsible AI and your career', 'Privacy (never paste personal data), bias, plagiarism and honesty, and how AI is changing analyst jobs.', NULL, NULL, '[]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('d3ab43e0-0a2d-4b15-8348-b8b23a67123c', '977c14b6-d97d-49a8-8ca5-226ff5329aa6', 'hackathon-ideas', 5, 'Hackathon: ideas and teams', 'Choosing a problem, forming teams, writing the one-page idea.', NULL, NULL, '[]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('747299c7-596a-435f-aefb-47e37bb113c3', '977c14b6-d97d-49a8-8ca5-226ff5329aa6', 'hackathon-data', 6, 'Hackathon: collecting and cleaning data', 'Getting the data and making it usable.', NULL, NULL, '[]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('862418d1-6cdb-4e15-9f63-db6c8237be71', '977c14b6-d97d-49a8-8ca5-226ff5329aa6', 'hackathon-build', 7, 'Hackathon: build day', 'Analysis, charts and a dashboard.', NULL, NULL, '[]', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.lessons (id, module_id, slug, "position", title, summary, body_md, before_next_md, resources, slots) VALUES ('8d1abe87-1672-4d94-8bde-8c19774b1caf', '977c14b6-d97d-49a8-8ca5-226ff5329aa6', 'hackathon-present', 8, 'Hackathon: presentations', 'Teams present their insights and recommendations.', NULL, NULL, '[]', 1) ON CONFLICT DO NOTHING;

INSERT INTO public.lesson_notes (lesson_id, notes_md) VALUES ('69967216-44dc-4cf5-8d4b-2459b56a5fc0', '
**Goal:** students leave knowing what the course is, how it''s graded, and what statistics is for.

| Time | What | Notes |
|---|---|---|
| 0–15 | Introductions | Your story: why data. Ask 3–4 students what they want after BCA. |
| 15–30 | The course map | Show the schedule page. Tableau → Python → AI tools → hackathon. Grading: attendance 20, quizzes 10, assignments 70. |
| 30–55 | What is statistics | Collect → organise → present → interpret. Use a class example: everyone''s travel time to college. |
| 55–80 | Hands-on | Each student enters their own travel time in a shared sheet. Sort, make a frequency table together. |
| 80–90 | Wrap | Classroom code on the board. Preview next class: charts. |

**Watch for:** students who don''t have Classroom access yet. Note their names.
') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_notes (lesson_id, notes_md) VALUES ('c650dcbf-b8ed-4161-977c-a9dc7f7eadda', '
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
- *"How do I record my screen?"* Windows: **Win+Alt+R** (Xbox Game Bar) or the Snipping Tool''s video mode. Or use Loom or ScreenPal free in the browser.
') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_notes (lesson_id, notes_md) VALUES ('ce1101b7-5f86-4c27-9c96-14e8667e979c', '
**Goal:** students can calculate all three by hand and in Sheets, and explain which one to trust when there are outliers.

| Time | What | Notes |
|---|---|---|
| 0–10 | Recap | Show 3 charts and ask which chart type each one is and why. |
| 10–25 | Hook | The salary example on the board. Ask "What''s the average salary?" before revealing the mean vs the median. |
| 25–45 | By hand | 7 numbers on the board; class calculates mean, median, mode on paper. Then an even count for the median (average of the two middle values). |
| 45–75 | In Sheets | AVERAGE, MEDIAN, MODE, plus MIN, MAX, COUNT. Students use a dataset of 20 values (cricket runs or marks). |
| 75–90 | Exit question | "A shop owner wants the typical bill size, and a few customers bought furniture. Mean or median?" |

**Watch for:** MODE returns only one value if there are ties. Mention `MODE.MULT` for interest.
') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_notes (lesson_id, notes_md) VALUES ('46bd3d7b-08f2-4bef-b099-df78d9fc19f1', '
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
') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_notes (lesson_id, notes_md) VALUES ('95710952-1ead-46e0-9c12-d766ccf19d4e', '
**Goal:** students can classify any column in a dataset and turn a vague goal into 3 specific questions.

| Time | What | Notes |
|---|---|---|
| 0–10 | Recap | Quickly go over Statistics quiz results and common mistakes. |
| 10–25 | Hook | Slide: a juice-shop menu. Ask "What questions can this data answer?" Write them all on the board. |
| 25–50 | Data types | Go through the table. Then a game: call out a column ("PIN code", "rating 1–5", "weight") and the class shouts the type. PIN code is a good trap: it''s a number but *nominal*. |
| 50–75 | Hands-on | Open the **Superstore** sheet. In pairs, label every column''s type, then write 4 questions the data could answer. |
| 75–90 | Share | 3 pairs read out their best question. Improve one vague question together. |

**Watch for:** confusion between ordinal and discrete. Ordinal is about *order of categories*; discrete is about *counting*.
') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_notes (lesson_id, notes_md) VALUES ('0bbc8d8d-130c-415f-93cc-789e47781d08', '
**Goal:** students practise the full loop (question → chart → insight → doubt) on Superstore data, ready for Assignment 3.

| Time | What | Notes |
|---|---|---|
| 0–10 | Recap | Data types lightning round, 5 columns. |
| 10–25 | Hook | Correlation ≠ causation: ice cream and drowning. Ask for their own examples (they come up with good ones). |
| 25–45 | Demo | In Sheets, use a pivot table on Superstore: sales by region and by category. Turn each into a chart and say the insight aloud in one sentence. |
| 45–75 | Hands-on | Students start Assignment 3 in class: 4 questions, 2 charts done before leaving. |
| 75–85 | Assignment 3 | Rubric (25 marks). Slides go to Classroom. |
| 85–90 | Quiz | Open the **Understanding Data quiz**. |

**Election case study:** keep it to the numbers and chart choice. Steer clear of political opinion: "We''re looking at how the data is shown, not who should have won."
') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_notes (lesson_id, notes_md) VALUES ('53ba7c8f-bb9c-4361-9663-f678e3685af5', '
**Goal:** every student has a working Tableau Public account and has loaded Superstore data before leaving.

| Time | What | Notes |
|---|---|---|
| 0–15 | Hook | Anscombe''s quartet: show the four tables first and ask "Are they the same?", then the four plots. |
| 15–30 | Why Tableau | Comparison table. Mention that Power BI and Looker Studio feel similar once you know Tableau. |
| 30–60 | Setup together | Everyone signs up. **Lab tip:** check before class that public.tableau.com isn''t blocked on the lab network. Have a backup: a few students can share one account in pairs. |
| 60–85 | Data source page | Upload Superstore. Point out the field types (Abc, #, calendar, globe). |
| 85–90 | Wrap | Watch Tableau part 2 before next class if possible. |

**Watch for:** sign-up emails going to spam; students who used a college email they can''t access.
') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_notes (lesson_id, notes_md) VALUES ('b69e257f-840e-4da2-88e3-5af130eaa993', '
**Goal:** students can make a calculated field and relate two tables, the two skills Assignment 4 needs.

| Time | What | Notes |
|---|---|---|
| 0–10 | Recap | Data source page parts. |
| 10–40 | Demo | Rename, hide, change type. Calculated field: Profit Ratio = SUM([Profit])/SUM([Sales]). |
| 40–60 | Relationships | Use Global Electronics Retailer (Sales, Products, Customers, Stores). Drag tables onto the canvas and match the keys. |
| 60–85 | Hands-on | Students relate the Electronics tables and create the **Sale Price** calculated field. |
| 85–90 | Wrap | Preview: building charts next class. |
') ON CONFLICT DO NOTHING;

INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('1183ed93-8694-4ce6-be0e-a39cc316f948', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', 'c650dcbf-b8ed-4161-977c-a9dc7f7eadda', 'a1-charts', 1, 'assignment', 'Assignment 1: Different graph types', 'Create a **line graph, column/bar graph, pie chart, scatter diagram and histogram** using any data of your choice in Google Sheets. Record a short video of the steps and submit it with the sheet.

**Recording tip:** a screen recording with your voice explaining the steps is perfect. You don''t need to turn on your camera. If you can''t record, a Google Doc with screenshots and a written explanation of each step is accepted too.', 'https://drive.google.com/file/d/1y0qmCVzV9prUhht23rGeNxvlEFC1yR9p/view', 45) ON CONFLICT DO NOTHING;
INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('3e0a8f8b-6f94-40fe-b0a6-514a0a86d8ba', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', 'ce1101b7-5f86-4c27-9c96-14e8667e979c', 'a2-mean-median-mode', 2, 'assignment', 'Assignment 2: Mean, median, mode and SD', 'Calculate **mean, median, mode and standard deviation** for any data of your choice in Google Sheets. Record a short video of the steps and submit it with the sheet.

**Recording tip:** a screen recording with your voice explaining the steps is perfect. You don''t need to turn on your camera. If you can''t record, a Google Doc with screenshots and a written explanation of each step is accepted too.', 'https://drive.google.com/file/d/1OMdVTy_agAmZIQizMyC1oFZXe3haJEOT/view', 50) ON CONFLICT DO NOTHING;
INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('cf2897e3-b12c-4110-aa07-f9e8b800a788', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', '46bd3d7b-08f2-4bef-b099-df78d9fc19f1', 'quiz-statistics', 3, 'quiz', 'Quiz: Statistics', NULL, NULL, 10) ON CONFLICT DO NOTHING;
INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('4d4b3cb0-7960-4d8e-a26f-692715e91f24', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', '0bbc8d8d-130c-415f-93cc-789e47781d08', 'a3-understanding-data', 4, 'assignment', 'Assignment 3: Questions and charts from Superstore data', '1. Copy the [Superstore data](https://docs.google.com/spreadsheets/d/1K03dDWwD58to59w-1IZ7Nl1lpbvICes16PpyZw42LbY/edit) into your own Google Sheet
2. Create a slide with **4 questions** you want to ask of this data
3. Create slides with **4 visualisations** that answer them
4. Submit your slides on Google Classroom', 'https://drive.google.com/file/d/12vZU1-1TvwG0BTzNiVZSQWe2mbfsLxZM/view', 25) ON CONFLICT DO NOTHING;
INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('15b42bca-ea26-44d5-bfc5-38d800330255', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', '0bbc8d8d-130c-415f-93cc-789e47781d08', 'quiz-understanding-data', 5, 'quiz', 'Quiz: Understanding Data', NULL, NULL, 10) ON CONFLICT DO NOTHING;
INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('384067db-2b42-410b-a48c-67fe1871545c', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', 'a9d909c5-cdbe-4915-8a7d-67323096e62d', 'a4-tableau-simple', 6, 'assignment', 'Assignment 4: Tableau, Global Electronics Retailer', 'Using the [Global Electronics Retailer](https://docs.google.com/spreadsheets/d/1xZNM_T9s5f-6gzuHJhoezowLZEVNZk_04dkudtpMz7g/edit) data:

**Part 1, data preparation:** combine the tables, hide extra columns, and create the calculated fields *Sale Price*, *Profit* and *Customer age* (use DATEDIFF and TODAY).

**Part 2, visualisation:** create **three** charts for the company''s CEO showing products, geographies, trends over time or customer segments.

Submit a short video of the steps on Google Classroom.

**Recording tip:** a screen recording with your voice explaining the steps is perfect. You don''t need to turn on your camera. If you can''t record, a Google Doc with screenshots and a written explanation of each step is accepted too.', 'https://drive.google.com/file/d/1-I--xsw-NhC7gjkiVqM_46Lo-xxLcc1r/view', 40) ON CONFLICT DO NOTHING;
INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('ad26dfa8-39e5-442e-aaaf-53e761cf85dc', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', 'f5dd42e7-05ec-4488-99d2-41d6a7877be4', 'a5-tableau-complex', 7, 'assignment', 'Assignment 5: Tableau, student data', 'Using the [student data](https://docs.google.com/spreadsheets/d/1SJ0c7UXz-pBP7Tmc-qOp1twWgDTeAoiL6clnTWypYj0/edit), answer the questions in the brief with charts: averages, a bar chart by major, a pie chart by gender, a **box plot** of GPA by major, a **stacked bar** of scholarship vs part-time job, and a **scatter plot** of GPA vs credits.

Submit a Google Doc with answers and screenshots, and present your findings in class.', 'https://drive.google.com/file/d/1xJECdFcMEsRzG_9GZ5by8UfHOpLIUUqq/view', 50) ON CONFLICT DO NOTHING;
INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('3819bb4a-1f2f-4b7c-8040-7d06e9825897', 'e08a45b9-d9eb-4fc2-a112-dee1ba39f80e', '4e57ccf1-d5dd-4554-837e-86999c2e16e3', 'quiz-tableau', 8, 'quiz', 'Quiz: Tableau', NULL, NULL, 10) ON CONFLICT DO NOTHING;
INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('769a7d6d-0a34-4d35-9207-0e89b8e1fbd2', 'd4c4deda-0839-4ea1-8421-38cac91d316b', '66484dad-2976-4b58-b274-a039bd58a357', 'py-a1-data-types', 1, 'assignment', 'Python Assignment 1: Variables and data types', 'Exercises on variables, numbers, strings and booleans. Make a copy of the brief into a Colab notebook, solve each exercise, and submit the notebook link on Classroom.', 'https://docs.google.com/document/d/1H__Z6BmaN90mZAvXse6jTNkMrKGRq31s5HXJlrG2REw/edit', 20) ON CONFLICT DO NOTHING;
INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('28f449b0-230a-440a-a943-a6e48474ac6c', 'd4c4deda-0839-4ea1-8421-38cac91d316b', '886af659-b608-49bc-8229-0a7735dc8655', 'py-a2-data-structures', 2, 'assignment', 'Python Assignment 2: Lists, tuples, dicts and sets', 'Exercises on lists, dictionaries and calculations with them. Submit your Colab notebook link on Classroom.', 'https://docs.google.com/document/d/1Qdj3xLqgG0rIAmvXL4G4x14MKMejCiigIiE9Aq7nL7o/edit', 20) ON CONFLICT DO NOTHING;
INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('8120cc10-ac83-4c22-98a9-97fef9955e3f', 'd4c4deda-0839-4ea1-8421-38cac91d316b', '35b71571-5084-429c-88c0-2d89652c5715', 'py-a3-conditionals', 3, 'assignment', 'Python Assignment 3: Operators and conditionals', 'Three small programs: age categories (with a ticket-price bonus), an even/odd loop with break and continue, and a pass/fail marks checker. Submit your Colab notebook link on Classroom.', 'https://docs.google.com/document/d/15hsUMluxxNfYaYQ3TuTEab1jo7AA_iMwS_S1Y1Nrk4E/edit', 20) ON CONFLICT DO NOTHING;
INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('8789fe90-4c9c-47fa-83af-80a58d5dbd68', 'd4c4deda-0839-4ea1-8421-38cac91d316b', '2da648bf-e9ce-41f9-9de6-bb8a9dfecacb', 'py-a4-cleaning', 4, 'assignment', 'Python Assignment 4: Data cleaning with Pandas', 'Clean the [Employees dataset](https://docs.google.com/spreadsheets/d/1IE4fjGhimKjCfyNsP33-mPVNpjsJSLVcKV-aD9Ct-58/edit) with Pandas: fix ages (21–65; fill blanks with the mean), emails missing @, dates (to_datetime), phone numbers with extra symbols, remove duplicates, rename a column.', 'https://drive.google.com/file/d/1EwEPuZeWdrwU3e0OZftSnn0bb9GyK2xe/view', 25) ON CONFLICT DO NOTHING;
INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('2d8c2a23-b999-45ae-b716-e0599b899542', 'd4c4deda-0839-4ea1-8421-38cac91d316b', 'd27cc1fb-9e95-40f5-af0a-0bbc43e510f9', 'py-a5-reshape', 5, 'assignment', 'Python Assignment 5: Transposing data with Pandas', 'Clean and reshape the [state-wise agricultural production data](https://docs.google.com/spreadsheets/d/16ZI_s0ha-Li5GVA4YQ2Q8x_1nB57OwFqBmw8FuNKccY/edit) into five columns: **State, Category, Crop, TimePeriod, Quantity**.', 'https://drive.google.com/file/d/1__wWvvlPaNwWasHS5FBbq2tIueg08r2T/view', 25) ON CONFLICT DO NOTHING;
INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('f1f07285-550f-4bd6-8a98-ca2335906cd4', 'd4c4deda-0839-4ea1-8421-38cac91d316b', '25d437db-c031-4500-81e4-0c742f87cbb8', 'py-a6-matplotlib', 6, 'assignment', 'Python Assignment 6: Plots with Matplotlib (IPL 2024)', 'Using the [IPL 2024 batting data](https://docs.google.com/spreadsheets/d/1eg6SRYcmD8v0Z9spnUJmPRsgTVVj75U-5274cANMh48/edit): a red bar chart of one team''s strike rates, a stacked bar of runs by team and player, and scatter plots of highest score vs strike rate for two teams, with your conclusion.', 'https://drive.google.com/file/d/1eqK1KP6F-42lxWFqz9lP5zabuBY256j_/view', 25) ON CONFLICT DO NOTHING;
INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('80398487-3698-4665-9a35-be9a026aa139', 'd4c4deda-0839-4ea1-8421-38cac91d316b', '251cf991-c7c0-481b-b636-bfbabf26b6a6', 'quiz-python-basics', 7, 'quiz', 'Quiz: Python basics (practice)', NULL, NULL, 10) ON CONFLICT DO NOTHING;
INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('8f8a58c2-a694-498e-8bd2-a92869f84edf', 'd4c4deda-0839-4ea1-8421-38cac91d316b', '25d437db-c031-4500-81e4-0c742f87cbb8', 'quiz-pandas-matplotlib', 8, 'quiz', 'Quiz: Pandas and Matplotlib (practice)', NULL, NULL, 10) ON CONFLICT DO NOTHING;
INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('27ac5710-270f-4520-9ee8-6381cd49da6d', 'd4c4deda-0839-4ea1-8421-38cac91d316b', '6b1dab32-8ff9-4249-9533-72dbb60b29f4', 'project', 9, 'project', 'Project: Tableau + Python', 'Team project (2–3 students): 3 questions → clean in Pandas → plot in Matplotlib → one Tableau dashboard → 5-minute presentation.', NULL, 50) ON CONFLICT DO NOTHING;
INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('4c0fa8a3-fc4a-4985-bef7-dae97e35f245', 'd4c4deda-0839-4ea1-8421-38cac91d316b', 'd3ab43e0-0a2d-4b15-8348-b8b23a67123c', 'hackathon', 10, 'hackathon', 'Hackathon', 'Pick an idea (e.g. campus energy/resource dashboard, student life and performance survey, movie and OTT data explorer), submit a one-page idea write-up before the hackathon starts, then build and present your analysis.', 'https://docs.google.com/document/d/1iUs4PZmqZ8-E6Od_ZbaCnOhvowb-sDG2vx-xO0wNdvA/edit', 100) ON CONFLICT DO NOTHING;
INSERT INTO public.assessments (id, module_id, lesson_id, slug, "position", kind, title, brief_md, brief_url, max_score) VALUES ('2cb37fba-eb6f-44bd-ad42-41edb76d7020', '977c14b6-d97d-49a8-8ca5-226ff5329aa6', '46de460d-362e-4169-9d96-7b6f4188e200', 'quiz-ai-tools', 1, 'quiz', 'Quiz: AI tools', NULL, NULL, 10) ON CONFLICT DO NOTHING;

INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('d37b0a52-0719-4a95-943a-65ebc281eef8', 'cf2897e3-b12c-4110-aa07-f9e8b800a788', 1, 'Which chart is best for showing how sales changed month by month?', '["Pie chart", "Line chart", "Scatter plot", "Histogram"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('e7320859-f95f-48c9-b37b-9571792afa26', 'cf2897e3-b12c-4110-aa07-f9e8b800a788', 2, 'What is the median of 3, 9, 4, 7, 5?', '["4", "5", "5.6", "7"]', 1, 'Sorted: 3, 4, 5, 7, 9. The middle value is 5.') ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('3a97b8f2-8457-4447-bca7-96c162f85500', 'cf2897e3-b12c-4110-aa07-f9e8b800a788', 3, 'Nine people earn ₹20,000 and one earns ₹10,00,000. Which measure best describes a typical income?', '["Mean", "Median", "Range", "Maximum"]', 1, 'The outlier pulls the mean up; the median stays at ₹20,000.') ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('fd202340-f5e9-4b91-9ee7-503b5e593271', 'cf2897e3-b12c-4110-aa07-f9e8b800a788', 4, 'What is the mode of 2, 4, 4, 6, 6, 6, 8?', '["4", "5.1", "6", "8"]', 2, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('55231eb4-85a0-4402-ab84-68dc483e9aff', 'cf2897e3-b12c-4110-aa07-f9e8b800a788', 5, 'Which Google Sheets function calculates the mean?', '["=MEAN()", "=AVERAGE()", "=MEDIAN()", "=SUM()"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('78f40b53-a9a3-423d-aa48-122040cbbf96', 'cf2897e3-b12c-4110-aa07-f9e8b800a788', 6, 'A small standard deviation means…', '["Values are close to the mean", "Values are spread far apart", "The mean is small", "There are few values"]', 0, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('6af3bd85-0661-4384-a4c0-a11695d22e6a', 'cf2897e3-b12c-4110-aa07-f9e8b800a788', 7, 'Which chart shows how values are spread across ranges (e.g. how many students scored 60–69)?', '["Pie chart", "Line chart", "Histogram", "Scatter plot"]', 2, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('aba212c9-3c66-45cb-8eae-9f15c5588dd8', 'cf2897e3-b12c-4110-aa07-f9e8b800a788', 8, 'Incomes usually have a few very large values. The distribution is…', '["Symmetric", "Right (positively) skewed", "Left (negatively) skewed", "Uniform"]', 1, 'A long tail of large values on the right; the mean is pulled above the median.') ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('ff8c50fe-54ef-47c7-a2c5-930ac93d7ab7', 'cf2897e3-b12c-4110-aa07-f9e8b800a788', 9, 'Cumulative frequency is…', '["The most common value", "The running total of frequencies", "The difference between max and min", "The average frequency"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('2e7bdbda-43fa-4f0f-8b57-8e8d87a09f9d', 'cf2897e3-b12c-4110-aa07-f9e8b800a788', 10, 'Which chart helps you see whether study hours and marks are related?', '["Pie chart", "Scatter plot", "Histogram", "Table"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('2e250feb-be89-482f-803d-d5564919a7dd', '15b42bca-ea26-44d5-bfc5-38d800330255', 1, 'Temperature recorded every hour is…', '["Discrete", "Continuous", "Nominal", "Ordinal"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('5256c827-c9e5-483b-8fb0-f562b3419e3f', '15b42bca-ea26-44d5-bfc5-38d800330255', 2, 'The state a person comes from is…', '["Ordinal", "Continuous", "Nominal", "Discrete"]', 2, 'Categories with no order are nominal.') ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('5e582d93-d60e-4e73-bed9-4b540477fda4', '15b42bca-ea26-44d5-bfc5-38d800330255', 3, 'Education level (Primary, Secondary, Higher Secondary) is…', '["Nominal", "Ordinal", "Continuous", "Unstructured"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('c87f7eb1-fa53-4ee7-968a-db27887e5b7d', '15b42bca-ea26-44d5-bfc5-38d800330255', 4, 'A PIN code like 411001 is best treated as…', '["Continuous number", "Nominal category", "Ordinal category", "Measure to average"]', 1, 'It''s written with digits, but averaging PIN codes means nothing.') ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('d04059ff-3571-43d9-897b-479cd52fde2d', '15b42bca-ea26-44d5-bfc5-38d800330255', 5, 'Which of these is unstructured data?', '["A sheet of daily sales", "Photos of vendor price quotes", "A table of student marks", "A CSV of orders"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('0a9bc90e-3862-4322-8c5c-d48db71b83e2', '15b42bca-ea26-44d5-bfc5-38d800330255', 6, 'Which is the most useful question to ask a sales dataset?', '["Is the business good?", "What is data?", "Which product''s sales fell most in February?", "Why do people buy things?"]', 2, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('32db8fcc-c434-4a62-840b-6caf6d4b8a45', '15b42bca-ea26-44d5-bfc5-38d800330255', 7, 'Ice-cream sales and drowning incidents both rise in summer. This shows…', '["Ice cream causes drowning", "Correlation, probably caused by a third factor (heat)", "No relationship", "Drowning causes ice-cream sales"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('ec4067ac-7ba6-44df-833d-10b3ad044dcd', '15b42bca-ea26-44d5-bfc5-38d800330255', 8, 'A restaurant wants to know which months are most profitable. It should group orders by…', '["Customer name", "Month", "Dish colour", "Table number"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('e4caa56e-8db1-4356-bca4-7953792c1fcf', '15b42bca-ea26-44d5-bfc5-38d800330255', 9, 'Number of students in a class is…', '["Continuous", "Discrete", "Nominal", "Unstructured"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('e2e4c43c-ef14-4c06-adc7-16b45a9e0b83', '15b42bca-ea26-44d5-bfc5-38d800330255', 10, 'Identifying which items people rarely order, so you stop buying their ingredients, is an example of…', '["Cost savings", "Data cleaning", "Unstructured data", "Causation"]', 0, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('e7c16568-d02d-478d-ae1a-562a132daff8', '3819bb4a-1f2f-4b7c-8040-7d06e9825897', 1, 'In Tableau, ''Region'' and ''Product Name'' are usually…', '["Measures", "Dimensions", "Calculated fields", "Filters only"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('13247329-5932-48dc-b35b-70f20b50e1b7', '3819bb4a-1f2f-4b7c-8040-7d06e9825897', 2, '''Sales'' and ''Quantity'' are usually…', '["Dimensions", "Measures", "Joins", "Relationships"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('66ef344a-ec38-4710-9871-6d8b07972870', '3819bb4a-1f2f-4b7c-8040-7d06e9825897', 3, 'Anscombe''s quartet shows that…', '["Pie charts are best", "Datasets with identical statistics can look very different when plotted", "Tableau is faster than Excel", "Mean is always better than median"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('3b2c42f6-e73f-4ecb-8edc-2bcc9eab251e', '3819bb4a-1f2f-4b7c-8040-7d06e9825897', 4, 'Which chart is best for a trend over time?', '["Treemap", "Line chart", "Pie chart", "Highlight table"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('e8bb97cb-e2ad-4a70-bd4d-dfba58b01bcb', '3819bb4a-1f2f-4b7c-8040-7d06e9825897', 5, 'Which chart shows median, quartiles and outliers?', '["Box plot", "Pie chart", "Line chart", "Treemap"]', 0, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('8f7fbac8-9466-4ba4-88ed-5e91c3e8dac6', '3819bb4a-1f2f-4b7c-8040-7d06e9825897', 6, 'Your scatter plot shows a single dot. What should you try?', '["Add more filters", "Turn off Analysis → Aggregate Measures", "Change it to a pie chart", "Delete the data source"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('ef57b1cb-1c4a-4cea-89d9-3ef7026625be', '3819bb4a-1f2f-4b7c-8040-7d06e9825897', 7, 'Profit = [Sales] − [Cost] in Tableau is a…', '["Join", "Calculated field", "Dimension", "Dashboard"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('3b723a77-7e94-4b11-b14b-1917541113b3', '3819bb4a-1f2f-4b7c-8040-7d06e9825897', 8, 'Combining a Sales table and a Customers table on Customer ID uses…', '["A relationship or join", "A pie chart", "A filter", "A treemap"]', 0, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('fb437ede-45d2-455c-a48a-5011831255be', '3819bb4a-1f2f-4b7c-8040-7d06e9825897', 9, 'A pie chart is a poor choice when…', '["There are 2–3 categories", "There are 12 categories", "You show share of a whole", "The audience is new"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('fc594425-9f81-4b17-90c5-5538e6e55b16', '3819bb4a-1f2f-4b7c-8040-7d06e9825897', 10, 'A good dashboard title…', '["''Dashboard 1''", "States the insight, e.g. ''Laptop sales doubled in Q4''", "Is left blank", "Lists every field"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('8793d1f5-a8a0-43f9-ab89-d6947866e250', '80398487-3698-4665-9a35-be9a026aa139', 1, 'What does type(3.5) return?', '["int", "float", "str", "bool"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('c753fc34-ca95-4517-b9a1-9c53f680b48f', '80398487-3698-4665-9a35-be9a026aa139', 2, 'What is the output of print(7 // 2)?', '["3.5", "3", "4", "1"]', 1, '// is floor division.') ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('7b55198b-0f79-4490-ac2f-8673886996d8', '80398487-3698-4665-9a35-be9a026aa139', 3, 'What is the output of print(7 % 2)?', '["3", "1", "0", "3.5"]', 1, '% gives the remainder.') ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('5ffb8586-7d99-4c0d-8be6-cab56fb5c5c5', '80398487-3698-4665-9a35-be9a026aa139', 4, 'Which of these is mutable (can be changed after creation)?', '["Tuple", "String", "List", "Integer"]', 2, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('206adf86-545b-47b4-b44a-ad074953b959', '80398487-3698-4665-9a35-be9a026aa139', 5, 'How do you add ''jam'' to the end of a list called items?', '["items.add(''jam'')", "items.append(''jam'')", "items.insert(''jam'')", "items + ''jam''"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('8c57e6f9-4744-4d8a-9980-9ccf6717973d', '80398487-3698-4665-9a35-be9a026aa139', 6, 'd = {''name'': ''Plato'', ''born'': -427}. How do you get the birth year?', '["d[1]", "d.born", "d[''born'']", "d(''born'')"]', 2, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('5d41c571-5e20-4a07-a0cb-258e1f1b8a34', '80398487-3698-4665-9a35-be9a026aa139', 7, 'What does a set automatically remove?', '["Numbers", "Duplicates", "Strings", "Nothing"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('b3a6be8c-f0a0-4a2a-8b4f-059108e7bd47', '80398487-3698-4665-9a35-be9a026aa139', 8, 'What type does input() return?', '["int", "float", "str", "Depends on what the user types"]', 2, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('3957e73d-a1c3-489e-9617-65b395272182', '80398487-3698-4665-9a35-be9a026aa139', 9, 'In a loop, what does `continue` do?', '["Stops the loop completely", "Skips to the next iteration", "Restarts the program", "Prints the value"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('9254ef62-6a84-4a0d-8ee3-a47242532157', '80398487-3698-4665-9a35-be9a026aa139', 10, 'What is the value of (5 > 3) and (2 > 4)?', '["True", "False", "None", "Error"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('4bdd6f1a-9381-45b5-ac62-b40492bf0943', '8f8a58c2-a694-498e-8bd2-a92869f84edf', 1, 'Which line loads a CSV into a DataFrame?', '["pd.open(''data.csv'')", "pd.read_csv(''data.csv'')", "pd.load(''data.csv'')", "pd.DataFrame(''data.csv'')"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('8c6006da-6915-44f8-b8a6-af02c640887a', '8f8a58c2-a694-498e-8bd2-a92869f84edf', 2, 'df.head() shows…', '["The last 5 rows", "The first 5 rows", "Column types", "Summary statistics"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('50be470e-ad18-4559-b321-9815ae3abbe4', '8f8a58c2-a694-498e-8bd2-a92869f84edf', 3, 'Which method gives count, mean, std, min and max for numeric columns?', '["df.info()", "df.describe()", "df.shape", "df.columns"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('d7eb08c1-42d5-47a0-b5f8-38362dda0a3b', '8f8a58c2-a694-498e-8bd2-a92869f84edf', 4, 'How do you select rows where Age is over 30?', '["df[df[''Age''] > 30]", "df.Age > 30", "df.select(Age > 30)", "df.filter(''Age'' > 30)"]', 0, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('5952f470-3c53-461e-b6bc-588e8a11b370', '8f8a58c2-a694-498e-8bd2-a92869f84edf', 5, 'Which removes duplicate rows?', '["df.dropna()", "df.drop_duplicates()", "df.unique()", "df.clean()"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('8226261d-799b-41bc-be5e-92660e7cdc73', '8f8a58c2-a694-498e-8bd2-a92869f84edf', 6, 'df.fillna(df[''Age''].mean()) is used to…', '["Delete missing ages", "Replace missing values with the mean", "Sort by age", "Rename the column"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('ec86f9bc-3f14-40cf-9ac8-e2cc4f48712a', '8f8a58c2-a694-498e-8bd2-a92869f84edf', 7, 'df.groupby(''Team'')[''Runs''].sum() gives…', '["Total runs per team", "Number of teams", "Average runs overall", "Runs of the first team"]', 0, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('39ca15b6-f88d-47b9-882b-2f67dd285d65', '8f8a58c2-a694-498e-8bd2-a92869f84edf', 8, 'Which Matplotlib function draws a bar chart?', '["plt.plot()", "plt.bar()", "plt.scatter()", "plt.hist()"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('2cdcae45-3a5f-4767-a1ab-fb0beaa561fc', '8f8a58c2-a694-498e-8bd2-a92869f84edf', 9, 'How do you label the x-axis?', '["plt.xaxis(''Runs'')", "plt.xlabel(''Runs'')", "plt.label_x(''Runs'')", "plt.title(''Runs'')"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('71a19918-e525-42db-9f3a-1720e47807b0', '8f8a58c2-a694-498e-8bd2-a92869f84edf', 10, 'Which chart best checks whether highest score and strike rate are related?', '["Pie", "Scatter", "Stacked bar", "Line"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('4495063b-a8df-4722-a7d2-e56c5b183c9e', '2cb37fba-eb6f-44bd-ad42-41edb76d7020', 1, 'A large language model produces answers mainly by…', '["Looking up a database of facts", "Predicting likely next words based on patterns in training data", "Searching Google every time", "Running Excel formulas"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('b96ef20e-365c-4841-9015-08c1d2a909ef', '2cb37fba-eb6f-44bd-ad42-41edb76d7020', 2, 'When an AI confidently states something false, this is called…', '["Debugging", "A hallucination", "Overfitting", "Encryption"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('ad0b6840-d038-40d2-8461-270273ecab1d', '2cb37fba-eb6f-44bd-ad42-41edb76d7020', 3, 'Which prompt will get the most useful help with a Pandas error?', '["''fix my code''", "''Python error help''", "Paste the code, the full error message, and describe what you expected", "''why is pandas bad''"]', 2, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('c99fdcae-6581-4029-ba13-45c44792e0ee', '2cb37fba-eb6f-44bd-ad42-41edb76d7020', 4, 'An AI gives you the average of a column. You should…', '["Trust it", "Check it with a formula or code yourself", "Round it", "Ask a different AI and pick one"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('f9433bb7-e111-4a37-a58b-3fd5476ad494', '2cb37fba-eb6f-44bd-ad42-41edb76d7020', 5, 'Which should you NOT paste into a public AI chat?', '["A public dataset''s column names", "Students'' names and phone numbers", "A Python error message", "A chart description"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('de1ad551-00d6-4a69-93ce-ba51198c5d4a', '2cb37fba-eb6f-44bd-ad42-41edb76d7020', 6, 'Submitting AI-written work as entirely your own is…', '["Fine if it''s correct", "Dishonest; say how you used AI", "Required", "Only a problem in exams"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('cb07df2c-1034-47f5-a30d-cfb0b399ecb5', '2cb37fba-eb6f-44bd-ad42-41edb76d7020', 7, 'Giving the AI the column names and a few sample rows helps because…', '["It makes the prompt longer", "The AI understands your data''s structure", "It''s required by law", "It speeds up your PC"]', 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('a3e51de8-d662-4054-a41e-910a0782a66f', '2cb37fba-eb6f-44bd-ad42-41edb76d7020', 8, 'AI models can reflect bias because…', '["They are trained on human-written data that contains bias", "Computers are biased by design", "They use too much electricity", "They can''t do maths"]', 0, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('f8420615-16bc-4b42-b85d-23b33aa551ae', '2cb37fba-eb6f-44bd-ad42-41edb76d7020', 9, 'A good use of AI for a data analyst is…', '["Writing a first draft of a formula and then testing it", "Making up data you don''t have", "Replacing all checking", "Avoiding learning Python"]', 0, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.quiz_questions (id, assessment_id, "position", prompt, options, answer_index, explanation) VALUES ('5036d01d-f058-4653-909a-bec39d04eda9', '2cb37fba-eb6f-44bd-ad42-41edb76d7020', 10, 'The best way to ask AI for a chart recommendation is to…', '["Say ''make a chart''", "Describe the question you''re answering and the data types", "Upload nothing", "Ask for the most colourful chart"]', 1, NULL) ON CONFLICT DO NOTHING;

INSERT INTO public.cohorts (id, course_id, slug, title, institution, weekdays, start_time, end_time, timezone, start_date, holidays, classroom_url, classroom_code, is_public, created_at) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', 'f2651647-7eb6-471f-ac68-77c9a12d65ae', 'azam-2026', 'Azam College · BCA 2026–27', 'Azam College', '{2,4}', '13:30:00', '15:00:00', 'Asia/Kolkata', '2026-10-13', '{}', NULL, NULL, true, '2026-10-14 14:12:01.675342+05:30') ON CONFLICT DO NOTHING;

INSERT INTO public.cohort_secrets (cohort_id, quiz_pin) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', '2026') ON CONFLICT DO NOTHING;

INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', '1183ed93-8694-4ce6-be0e-a39cc316f948', NULL, NULL, false) ON CONFLICT DO NOTHING;
INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', '3e0a8f8b-6f94-40fe-b0a6-514a0a86d8ba', NULL, NULL, false) ON CONFLICT DO NOTHING;
INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', 'cf2897e3-b12c-4110-aa07-f9e8b800a788', NULL, NULL, false) ON CONFLICT DO NOTHING;
INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', '4d4b3cb0-7960-4d8e-a26f-692715e91f24', NULL, NULL, false) ON CONFLICT DO NOTHING;
INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', '15b42bca-ea26-44d5-bfc5-38d800330255', NULL, NULL, false) ON CONFLICT DO NOTHING;
INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', '384067db-2b42-410b-a48c-67fe1871545c', NULL, NULL, false) ON CONFLICT DO NOTHING;
INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', 'ad26dfa8-39e5-442e-aaaf-53e761cf85dc', NULL, NULL, false) ON CONFLICT DO NOTHING;
INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', '3819bb4a-1f2f-4b7c-8040-7d06e9825897', NULL, NULL, false) ON CONFLICT DO NOTHING;
INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', '769a7d6d-0a34-4d35-9207-0e89b8e1fbd2', NULL, NULL, false) ON CONFLICT DO NOTHING;
INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', '28f449b0-230a-440a-a943-a6e48474ac6c', NULL, NULL, false) ON CONFLICT DO NOTHING;
INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', '8120cc10-ac83-4c22-98a9-97fef9955e3f', NULL, NULL, false) ON CONFLICT DO NOTHING;
INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', '8789fe90-4c9c-47fa-83af-80a58d5dbd68', NULL, NULL, false) ON CONFLICT DO NOTHING;
INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', '2d8c2a23-b999-45ae-b716-e0599b899542', NULL, NULL, false) ON CONFLICT DO NOTHING;
INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', 'f1f07285-550f-4bd6-8a98-ca2335906cd4', NULL, NULL, false) ON CONFLICT DO NOTHING;
INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', '80398487-3698-4665-9a35-be9a026aa139', NULL, NULL, false) ON CONFLICT DO NOTHING;
INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', '8f8a58c2-a694-498e-8bd2-a92869f84edf', NULL, NULL, false) ON CONFLICT DO NOTHING;
INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', '27ac5710-270f-4520-9ee8-6381cd49da6d', NULL, NULL, false) ON CONFLICT DO NOTHING;
INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', '4c0fa8a3-fc4a-4985-bef7-dae97e35f245', NULL, NULL, false) ON CONFLICT DO NOTHING;
INSERT INTO public.cohort_assessments (cohort_id, assessment_id, classroom_url, due_date, is_open) VALUES ('c8f95650-d9db-40bc-a939-1b7011bd11d4', '2cb37fba-eb6f-44bd-ad42-41edb76d7020', NULL, NULL, false) ON CONFLICT DO NOTHING;

INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('90a902ad-2a52-42cf-847d-658f32a66016', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '69967216-44dc-4cf5-8d4b-2459b56a5fc0', 1, 1, '2026-10-13 13:30:00+05:30', '2026-10-13 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('d1ed4301-83ca-4dea-827d-4af2e7fc3665', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', 'c650dcbf-b8ed-4161-977c-a9dc7f7eadda', 1, 2, '2026-10-15 13:30:00+05:30', '2026-10-15 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('e24bb275-8260-41ef-b74a-157847796ebb', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', 'ce1101b7-5f86-4c27-9c96-14e8667e979c', 1, 3, '2026-10-20 13:30:00+05:30', '2026-10-20 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('8806ea26-94c0-4e5a-b805-7a8038412654', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '46bd3d7b-08f2-4bef-b099-df78d9fc19f1', 1, 4, '2026-10-22 13:30:00+05:30', '2026-10-22 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('ed97b9d1-96e4-4257-81fa-94115d2a8eaa', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '95710952-1ead-46e0-9c12-d766ccf19d4e', 1, 5, '2026-10-27 13:30:00+05:30', '2026-10-27 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('2dccd9d3-de4a-4f98-8bed-8e6a0eda7d19', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '0bbc8d8d-130c-415f-93cc-789e47781d08', 1, 6, '2026-10-29 13:30:00+05:30', '2026-10-29 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('eaf202d8-0f13-45e9-8fc2-8cb7cb1eec09', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '53ba7c8f-bb9c-4361-9663-f678e3685af5', 1, 7, '2026-11-03 13:30:00+05:30', '2026-11-03 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('ebf1ac43-92ae-40bb-83a9-c1cbb78386a9', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', 'b69e257f-840e-4da2-88e3-5af130eaa993', 1, 8, '2026-11-05 13:30:00+05:30', '2026-11-05 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('8c4187e0-9ec8-4017-977f-3c8381d74733', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', 'a9d909c5-cdbe-4915-8a7d-67323096e62d', 1, 9, '2026-11-10 13:30:00+05:30', '2026-11-10 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('65eb7e9d-b9b4-49c7-ac12-af39efc5b38d', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '5024a791-be23-4c93-8060-c169fd5e3fe2', 1, 10, '2026-11-12 13:30:00+05:30', '2026-11-12 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('b6a6cca5-b350-429c-981a-d0fb3dbe7edc', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', 'f5dd42e7-05ec-4488-99d2-41d6a7877be4', 1, 11, '2026-11-17 13:30:00+05:30', '2026-11-17 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('55df964c-1cd9-4b93-a8ea-63ca23c73293', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '4e57ccf1-d5dd-4554-837e-86999c2e16e3', 1, 12, '2026-11-19 13:30:00+05:30', '2026-11-19 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('44ee36f5-1ce4-4f1c-802a-f7ffae432c94', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '66484dad-2976-4b58-b274-a039bd58a357', 1, 13, '2026-11-24 13:30:00+05:30', '2026-11-24 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('d883b014-faf4-49b0-b1b3-55f616266a24', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '886af659-b608-49bc-8229-0a7735dc8655', 1, 14, '2026-11-26 13:30:00+05:30', '2026-11-26 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('12e0dec4-69c3-4f74-b221-a698d22d189f', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', 'fdec74a6-80b9-45f3-ac5a-0ef78050972e', 1, 15, '2026-12-01 13:30:00+05:30', '2026-12-01 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('8ce3da52-0ce0-47cc-9392-04828d2698d3', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '35b71571-5084-429c-88c0-2d89652c5715', 1, 16, '2026-12-03 13:30:00+05:30', '2026-12-03 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('311246e0-8b67-4df6-b20f-58b4dd470f6a', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '5a222050-9c85-4208-904b-6fe233a8b963', 1, 17, '2026-12-08 13:30:00+05:30', '2026-12-08 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('5fc3acb3-03d4-4ee4-af21-e0c50dc173f6', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '251cf991-c7c0-481b-b636-bfbabf26b6a6', 1, 18, '2026-12-10 13:30:00+05:30', '2026-12-10 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('4d0001f2-5d79-4e5d-bae2-fd634aaa5861', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', 'ed03cd94-3d5b-4d82-8d7e-aca306148abb', 1, 19, '2026-12-15 13:30:00+05:30', '2026-12-15 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('be71d795-9d88-442f-9924-53f3f8e3a281', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '0616acc3-8ddc-40a2-9989-3b8eed119851', 1, 20, '2026-12-17 13:30:00+05:30', '2026-12-17 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('fb70272c-2b1a-4101-8116-d64b423758d8', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '2da648bf-e9ce-41f9-9de6-bb8a9dfecacb', 1, 21, '2026-12-22 13:30:00+05:30', '2026-12-22 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('d8f73596-5512-48db-aac1-994d4d48cb53', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', 'd27cc1fb-9e95-40f5-af0a-0bbc43e510f9', 1, 22, '2026-12-24 13:30:00+05:30', '2026-12-24 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('ed48e677-8c72-4a44-b5f0-b96e7d4d0067', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', 'b007eb7c-32f5-403f-b306-7b231b0b718b', 1, 23, '2026-12-29 13:30:00+05:30', '2026-12-29 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('d341fc71-05a3-4e82-a0af-51f9ac5ed62f', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', 'c12d1986-76e0-4df1-9d7f-0d9ce927a6a2', 1, 24, '2026-12-31 13:30:00+05:30', '2026-12-31 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('ed021ecf-d291-4fd6-8a28-e7dc854bf94e', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '25d437db-c031-4500-81e4-0c742f87cbb8', 1, 25, '2027-01-05 13:30:00+05:30', '2027-01-05 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('6686edff-8527-4693-9c6d-3b451ec70a94', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '6b1dab32-8ff9-4249-9533-72dbb60b29f4', 1, 26, '2027-01-07 13:30:00+05:30', '2027-01-07 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('dc8ecaec-5370-4e3d-a3bd-132952755936', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', 'e3284100-f4e7-4d2d-b30b-f18ea4b86519', 1, 27, '2027-01-12 13:30:00+05:30', '2027-01-12 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('ad34a7bc-6217-4c62-b238-a2f56d57d0db', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '28d70039-4d88-490f-8d9b-d903df655c9c', 1, 28, '2027-01-14 13:30:00+05:30', '2027-01-14 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('77d6f7af-1a8d-4283-9254-f08b2064c8d7', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '34324da3-f978-4b6a-8d52-9163f2923b70', 1, 29, '2027-01-19 13:30:00+05:30', '2027-01-19 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('0d5dad8e-327b-4d87-9016-d7f846e44ad3', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', 'b34f02e9-0673-4975-a33b-200792533eae', 1, 30, '2027-01-21 13:30:00+05:30', '2027-01-21 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('a537b386-5f95-4311-a0d0-82d1d11bd98b', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '46de460d-362e-4169-9d96-7b6f4188e200', 1, 31, '2027-01-26 13:30:00+05:30', '2027-01-26 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('3e34a754-f92b-4a1b-8f10-703702eaa29c', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', 'd3ab43e0-0a2d-4b15-8348-b8b23a67123c', 1, 32, '2027-01-28 13:30:00+05:30', '2027-01-28 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('a5b248c6-2b04-4306-a7d2-477b2b9c2c02', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '747299c7-596a-435f-aefb-47e37bb113c3', 1, 33, '2027-02-02 13:30:00+05:30', '2027-02-02 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('b2bcd30e-0b49-4f27-9b80-f9ac9fdfcc13', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '862418d1-6cdb-4e15-9f63-db6c8237be71', 1, 34, '2027-02-04 13:30:00+05:30', '2027-02-04 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (id, cohort_id, lesson_id, part, "position", starts_at, ends_at, title, status) VALUES ('b58f7929-915a-4918-875b-34504c297746', 'c8f95650-d9db-40bc-a939-1b7011bd11d4', '8d1abe87-1672-4d94-8bde-8c19774b1caf', 1, 35, '2027-02-09 13:30:00+05:30', '2027-02-09 15:00:00+05:30', NULL, 'scheduled') ON CONFLICT DO NOTHING;
commit;
