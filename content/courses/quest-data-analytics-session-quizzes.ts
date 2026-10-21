import type { AssessmentSeed, QuestionSeed } from "../types";

/**
 * A short check-in quiz for each teaching session, keyed by module slug.
 * Sessions that already end with a module quiz (Statistics, Understanding Data, Tableau,
 * Python basics, Pandas & Matplotlib, AI tools) don't get a second one.
 * Project and hackathon sessions have no quiz.
 */
function check(lesson: string, title: string, questions: QuestionSeed[]): AssessmentSeed {
  return { slug: `check-${lesson}`, kind: "quiz", title: `Session check: ${title}`, maxScore: 5, lesson, questions };
}

export const sessionQuizzes: Record<string, AssessmentSeed[]> = {
  basic: [
    check("what-is-statistics", "What is statistics?", [
      {
        prompt: "Which list shows the four steps of statistics in order?",
        options: ["Present → collect → interpret → organise", "Collect → organise → present → interpret", "Interpret → collect → present → organise", "Organise → interpret → collect → present"],
        answer: 1,
      },
      { prompt: "Marks written down in the order students handed in their papers are…", options: ["Raw data", "A frequency table", "Rank order", "Cumulative frequency"], answer: 0 },
      {
        prompt: "Sorting values from lowest to highest gives you…",
        options: ["A frequency distribution", "The mode", "Rank order", "A pie chart"],
        answer: 2,
      },
      {
        prompt: "In a frequency table, '5 students scored 60–69' tells you the…",
        options: ["Mean of the class", "Frequency of that range", "Cumulative frequency", "Highest mark"],
        answer: 1,
      },
      {
        prompt: "Frequencies for 0–49, 50–69 and 70–100 are 4, 10 and 6. What is the cumulative frequency up to 69?",
        options: ["10", "6", "14", "20"],
        answer: 2,
        explanation: "Add the frequencies up to that range: 4 + 10 = 14.",
      },
    ]),
    check("presenting-data", "Presenting data with charts", [
      { prompt: "You want to show how your phone's data use changed over 12 months. Best chart?", options: ["Pie chart", "Line chart", "Scatter plot", "Histogram"], answer: 1 },
      { prompt: "You want to compare total sales of five products. Best chart?", options: ["Bar / column chart", "Line chart", "Scatter plot", "Histogram"], answer: 0 },
      {
        prompt: "Why is a pie chart with 12 slices a poor choice?",
        options: ["Pie charts can't show percentages", "Small slices are hard to compare; a bar chart is clearer", "Sheets can't make it", "Pie charts only work with time data"],
        answer: 1,
      },
      { prompt: "In Google Sheets, where do you add a chart?", options: ["Data → Chart", "Format → Chart", "Insert → Chart", "View → Chart"], answer: 2 },
      {
        prompt: "What is the main difference between a histogram and a bar chart?",
        options: ["Histograms are always red", "A histogram groups numbers into ranges and its bars touch", "A bar chart can only be vertical", "There is no difference"],
        answer: 1,
      },
    ]),
    check("central-tendency", "Mean, median and mode", [
      { prompt: "What is the mean of 4, 6, 8, 10?", options: ["6", "7", "8", "28"], answer: 1, explanation: "(4 + 6 + 8 + 10) ÷ 4 = 7." },
      { prompt: "What is the median of 3, 8, 1, 9, 5?", options: ["5", "8", "1", "5.2"], answer: 0, explanation: "Sorted: 1, 3, 5, 8, 9. The middle value is 5." },
      { prompt: "What is the median of 2, 4, 6, 8?", options: ["4", "6", "5", "20"], answer: 2, explanation: "With an even count, average the two middle values: (4 + 6) ÷ 2 = 5." },
      {
        prompt: "One student scored 12 while everyone else scored 70–90. Which measure changes most because of that one mark?",
        options: ["Median", "Mode", "Mean", "None of them"],
        answer: 2,
      },
      { prompt: "Which Google Sheets formula gives the most common value?", options: ["=AVERAGE()", "=MEDIAN()", "=MODE()", "=COUNT()"], answer: 2 },
    ]),
    check("understanding-data-1", "Types of data and the right questions", [
      { prompt: "The weight of a parcel is…", options: ["Discrete", "Continuous", "Nominal", "Ordinal"], answer: 1 },
      { prompt: "Customer ratings of Poor / Average / Good / Excellent are…", options: ["Nominal", "Continuous", "Ordinal", "Unstructured"], answer: 2 },
      { prompt: "Which of these is structured data?", options: ["WhatsApp voice notes", "A spreadsheet of orders with date, item and price", "Photos of handwritten bills", "A YouTube video"], answer: 1 },
      {
        prompt: "Which is the most useful question to ask a restaurant's order data?",
        options: ["Is the restaurant good?", "Which dish sold least in the last 3 months?", "Why do people eat?", "What is a restaurant?"],
        answer: 1,
      },
      { prompt: "The number of orders in a day is…", options: ["Discrete", "Continuous", "Ordinal", "Nominal"], answer: 0 },
    ]),
    check("tableau-setup", "Why Tableau? Setting up", [
      {
        prompt: "What does Anscombe's quartet teach us?",
        options: ["Always use pie charts", "Data with identical statistics can look completely different when plotted", "Tableau is free", "Mean is better than median"],
        answer: 1,
      },
      { prompt: "Where do we use Tableau for free in this course?", options: ["Tableau Desktop trial", "Tableau Public (in the browser)", "Excel add-in", "Google Sheets"], answer: 1 },
      {
        prompt: "Which job is Tableau better at than a spreadsheet?",
        options: ["Typing in raw data", "Building interactive dashboards", "Writing letters", "Simple calculations on 10 rows"],
        answer: 1,
      },
      {
        prompt: "On the Data Source page, where do you see a preview of the table's rows?",
        options: ["The data grid", "The toolbar", "The Marks card", "The status bar"],
        answer: 0,
      },
      { prompt: "A field shown with the 'Abc' icon is a…", options: ["Number", "Date", "String (text)", "Geographic field"], answer: 2 },
    ]),
    check("tableau-data-prep", "Data prep, calculated fields and joins", [
      { prompt: "Profit = [Sales] − [Cost] in Tableau is a…", options: ["Filter", "Calculated field", "Dashboard", "Join"], answer: 1 },
      { prompt: "Which formula takes the first word of a Name field?", options: ['SPLIT([Name], " ", 1)', "LEFT([Name])", 'FIRST([Name], " ")', "[Name] - 1"], answer: 0 },
      {
        prompt: "To combine a Sales table with a Customers table you need…",
        options: ["The same number of rows", "A common field such as Customer ID", "The same column names everywhere", "A pie chart"],
        answer: 1,
      },
      {
        prompt: "What should you try first in Tableau to combine tables?",
        options: ["Relationships (the default 'noodles')", "Copy-paste into one sheet", "Delete one table", "A union of every table"],
        answer: 0,
      },
      {
        prompt: "How do you change a field's data type?",
        options: ["Retype the whole column", "Click the type icon above the column and pick a new type", "Delete and re-upload the file", "It can't be changed"],
        answer: 1,
      },
    ]),
    check("tableau-first-charts", "Dimensions, measures and first charts", [
      { prompt: "Which of these is a measure?", options: ["Region", "Product name", "Units sold", "Customer type"], answer: 2 },
      { prompt: "Which of these is a dimension?", options: ["Revenue", "Store country", "Quantity", "Unit price"], answer: 1 },
      { prompt: "To build a chart in Tableau you drag fields onto…", options: ["The Rows and Columns shelves", "The status bar", "The data grid", "The file menu"], answer: 0 },
      { prompt: "Dragging a field to Colour on the Marks card…", options: ["Deletes it", "Colours the marks by that field", "Sorts the data", "Exports the chart"], answer: 1 },
      { prompt: "Which chart is best for comparing sales across 6 countries?", options: ["Bar chart", "Line chart", "Scatter plot", "Text table"], answer: 0 },
    ]),
    check("tableau-comparing-charts", "Line, pie and treemap charts", [
      { prompt: "A line chart works best for…", options: ["Categories with no order", "Trends over time", "Parts of a whole", "Two unrelated numbers"], answer: 1 },
      { prompt: "A treemap shows hierarchy using…", options: ["Size and colour of nested rectangles", "Lines over time", "Dots on two axes", "Map regions"], answer: 0 },
      {
        prompt: "When is a pie chart acceptable?",
        options: ["With 15 categories", "To show change over time", "Showing a share of the whole with only a few categories", "Never"],
        answer: 2,
      },
      { prompt: "Which chart shows Category → Sub-category sales most compactly?", options: ["Pie chart", "Treemap", "Line chart", "Scatter plot"], answer: 1 },
      { prompt: "A line chart joining unrelated categories (Pune, Mumbai, Delhi) is misleading because…", options: ["Lines suggest a sequence that doesn't exist", "Lines are hard to draw", "Cities can't be charted", "It uses too much colour"], answer: 0 },
    ]),
    check("tableau-special-charts", "Heatmaps, scatter, box plots and maps", [
      { prompt: "Which chart shows whether GPA and credits completed are related?", options: ["Box plot", "Scatter plot", "Pie chart", "Highlight table"], answer: 1 },
      { prompt: "A box plot shows…", options: ["Only the mean", "The median, quartiles and outliers", "Change over time", "A share of the whole"], answer: 1 },
      { prompt: "A highlight table uses ___ to show where the big numbers are.", options: ["Size", "Colour", "Lines", "Sound"], answer: 1 },
      {
        prompt: "Your scatter plot shows only one dot. What should you do?",
        options: ["Add a filter", "Turn off Analysis → Aggregate Measures", "Switch to a pie chart", "Rename the fields"],
        answer: 1,
      },
      { prompt: "Colouring each state by its sales value creates a…", options: ["Treemap", "Choropleth (filled) map", "Line chart", "Box plot"], answer: 1 },
    ]),

    // Two 10-question practice quizzes before dashboards (requested 19 Oct).
    {
      slug: "quiz-tableau-elements",
      kind: "quiz",
      title: "Quiz: Tableau building blocks",
      maxScore: 10,
      lesson: "tableau-comparing-charts",
      questions: [
        {
          prompt: "In Tableau, a blue pill on a shelf means the field is…",
          options: ["A measure", "Discrete", "A filter", "Continuous"],
          answer: 1,
          explanation: "Blue = discrete (separate headers), green = continuous (an axis). This is not the same as dimension vs measure.",
        },
        {
          prompt: "You drag Order Date to Columns and get separate YEAR headers. To get one continuous timeline you…",
          options: ["Change it to continuous (green)", "Change its type to String", "Turn it into a measure", "Hide the column"],
          answer: 0,
        },
        {
          prompt: "When you drag Sales into the view, Tableau adds it up by default as…",
          options: ["AVG(Sales)", "COUNT(Sales)", "SUM(Sales)", "MAX(Sales)"],
          answer: 2,
        },
        {
          prompt: "Office Supplies has the most order lines but the smallest total sales. Which aggregation shows how many lines each category has?",
          options: ["SUM", "AVG", "COUNT", "MIN"],
          answer: 2,
          explanation: "In our Superstore file: Office Supplies has 23 lines but $1,781 of sales; Furniture has 10 lines and $8,221.",
        },
        {
          prompt: "Which calculated field gives the correct profit ratio for each category?",
          options: ["[Profit] / [Sales]", "SUM([Profit]) / SUM([Sales])", "AVG([Profit] / [Sales])", "SUM([Profit] / [Sales])"],
          answer: 1,
          explanation: "Add up first, then divide. For Furniture this gives −19.2%; the other formulas give −57.4% or −5.7%.",
        },
        {
          prompt: "A globe icon next to the State field means…",
          options: ["The data came from the internet", "It's a number", "It has missing values", "Tableau knows it's a place and can map it"],
          answer: 3,
        },
        {
          prompt: "Customer ID looks like a number (e.g. 12520). Should it be a dimension or a measure?",
          options: ["Dimension: it's a label", "Measure, so we can add it up", "Either, it makes no difference", "Neither"],
          answer: 0,
        },
        {
          prompt: "You hide the Ship Mode column in Tableau. What happens to the data?",
          options: ["It's deleted from the file", "It moves to another sheet", "It's still there, just not shown", "Tableau renames it"],
          answer: 2,
        },
        {
          prompt: "The Products table lists one product twice. You JOIN it to Order on Product ID. What goes wrong?",
          options: ["Nothing", "The product disappears", "Tableau shows an error and stops", "That product's sales are counted twice, so totals are too high"],
          answer: 3,
          explanation: "In our file the Bretford table is listed twice; a careless join pushes total sales from $13,222 to $15,225.",
        },
        {
          prompt: "To show the exact value on top of each bar, drag the measure onto which part of the Marks card?",
          options: ["Colour", "Size", "Label", "Detail"],
          answer: 2,
        },
      ],
    },
    {
      slug: "quiz-chart-types",
      kind: "quiz",
      title: "Quiz: Which chart?",
      maxScore: 10,
      lesson: "tableau-special-charts",
      questions: [
        { prompt: "Compare total runs scored by the 10 IPL teams.", options: ["Line chart", "Bar chart", "Scatter plot", "Pie chart"], answer: 1 },
        { prompt: "Show how monthly sales went up and down from 2014 to 2017.", options: ["Line chart", "Pie chart", "Treemap", "Box plot"], answer: 0 },
        {
          prompt: "Find out whether IPL batters who score more runs also have a higher strike rate.",
          options: ["Bar chart", "Pie chart", "Scatter plot", "Highlight table"],
          answer: 2,
          explanation: "Two measures against each other: one dot per player.",
        },
        { prompt: "Show what share of total sales each of the 3 categories brings in.", options: ["Pie chart", "Line chart", "Scatter plot", "Histogram"], answer: 0, explanation: "A pie works for a few parts of a whole. A bar chart would also be fine." },
        { prompt: "Show sales by Category and Sub-Category in one view, with box size showing sales.", options: ["Treemap", "Line chart", "Scatter plot", "Histogram"], answer: 0 },
        { prompt: "Show rice production for each Indian state on a map, darker for more.", options: ["Bar chart", "Line chart", "Pie chart", "Filled (choropleth) map"], answer: 3 },
        { prompt: "Sales by Region (rows) and Year (columns), with colour showing which cells are biggest.", options: ["Highlight table / heatmap", "Pie chart", "Scatter plot", "Line chart"], answer: 0 },
        { prompt: "Show how GPA is spread within each major, including the outliers.", options: ["Pie chart", "Treemap", "Box plot", "Line chart"], answer: 2 },
        { prompt: "How many students scored 0–10, 10–20, 20–30 marks and so on?", options: ["Histogram", "Pie chart", "Scatter plot", "Map"], answer: 0 },
        {
          prompt: "Which is the worst choice for comparing sales across 15 sub-categories?",
          options: ["Sorted bar chart", "Pie chart", "Text table", "Treemap"],
          answer: 1,
          explanation: "15 thin slices are impossible to compare. A sorted bar chart is easiest to read.",
        },
      ],
    },

    // Dashboards session demo dataset (requested 21 Oct). Numbers checked against the workbook.
    {
      slug: "quiz-global-electronics",
      kind: "quiz",
      title: "Quiz: Global Electronics Retailer",
      maxScore: 10,
      lesson: "tableau-dashboards",
      questions: [
        {
          prompt: "The data has no Revenue column. Which calculated field gives the revenue of each sales line?",
          options: ["SUM([Quantity])", "[Unit Sale Price USD] - [Unit Cost USD]", "[Quantity] * [Unit Sale Price USD]", "COUNT([Order Number]) * [Unit Cost USD]"],
          answer: 2,
          explanation: "Quantity × sale price. (Sale price − cost is profit per item, not revenue.)",
        },
        {
          prompt: "COUNT of Order Number shows 62,884, but the business only had 26,326 orders. Why?",
          options: [
            "One order has several lines (one per product), so COUNT counts lines. Use Count (Distinct) instead.",
            "Tableau counts blank rows twice",
            "The Customers table added extra rows",
            "62,884 is right; 26,326 is a typo",
          ],
          answer: 0,
        },
        {
          prompt: "Which is the correct Profit Margin calculation for a category?",
          options: ["AVG([Profit] / [Revenue])", "SUM([Profit] / [Revenue])", "[Profit] - [Revenue]", "SUM([Profit]) / SUM([Revenue])"],
          answer: 3,
          explanation: "Add up first, then divide. Averaging each line's margin gives a different, wrong answer.",
        },
        {
          prompt: "On the yearly chart, 2021 revenue is only about $1M compared with $9.3M in 2020. What is the best explanation?",
          options: [
            "The company nearly shut down in 2021",
            "The data stops on 20 Feb 2021, so 2021 only has 7 weeks of sales",
            "Tableau is using AVG instead of SUM",
            "Online sales were left out of 2021",
          ],
          answer: 1,
          explanation: "Always check the date range. Filter out or label a partial period.",
        },
        {
          prompt: "You want one line per year, with the months Jan–Dec along the bottom, to see if there is a busy season. How do you set it up?",
          options: [
            "Green MONTH(Order Date) on Columns, nothing on Color",
            "YEAR(Order Date) on Columns and MONTH on Rows",
            "Blue MONTH(Order Date) on Columns, Revenue on Rows, YEAR(Order Date) on Color",
            "Order Date on Filters only",
          ],
          answer: 2,
          explanation: "Blue (discrete) month gives Jan–Dec; YEAR on Color draws a separate line for each year.",
        },
        {
          prompt: "Movie DVDs sell the most units (28,802), but Desktops bring in the most revenue ($9.9M). What does this tell you?",
          options: [
            "Cheap items sell in large numbers; expensive items earn most of the money. Always ask “most by what?”",
            "The data is wrong",
            "DVDs must have a higher profit than desktops",
            "Quantity and revenue always give the same ranking",
          ],
          answer: 0,
        },
        {
          prompt: "Only online orders have a Delivery Date; in-store purchases are blank. What does AVG(Delivery Days) give you?",
          options: [
            "Wrong numbers, because blanks count as 0",
            "An error",
            "The average for in-store purchases only",
            "The average for online orders only, because AVG ignores blanks",
          ],
          answer: 3,
          explanation: "About 4.5 days overall, improving from 7.3 days in 2016 to 4.0 in 2020.",
        },
        {
          prompt: "The Stores sheet lists “Online” as a Country. What is the best way to compare online and in-store sales?",
          options: [
            "Delete the Online rows",
            "Create a calculated field: IF [StoreKey] = 0 THEN \"Online\" ELSE \"In store\" END",
            "Put Country (Stores) on a map",
            "Rename Online to United States",
          ],
          answer: 1,
          explanation: "Online is a sales channel, not a place. It is about 20% of revenue.",
        },
        {
          prompt: "The US is 54% of revenue and the UK is next. Which chart makes it easiest to see how many times bigger the US is?",
          options: ["Filled map", "Pie chart with 8 slices", "Sorted bar chart", "Scatter plot"],
          answer: 2,
          explanation: "A map shows where; bars of the same baseline show how much more.",
        },
        {
          prompt: "On your dashboard, you want a click on a country in the map to filter all the other charts. What do you do?",
          options: [
            "Add Country to every sheet's Rows",
            "Select the map on the dashboard and turn on Use as Filter (the funnel icon)",
            "Create a new calculated field",
            "Change the Marks type to Map",
          ],
          answer: 1,
        },
      ],
    },
  ],

  python: [
    check("python-intro", "Colab and data types", [
      { prompt: "Which key combination runs a cell in Google Colab?", options: ["Ctrl + S", "Shift + Enter", "Alt + F4", "Ctrl + Z"], answer: 1 },
      { prompt: 'What does type("42") return?', options: ["int", "float", "str", "bool"], answer: 2, explanation: "It's in quotes, so it's a string." },
      { prompt: 'What is int("10") + 5?', options: ['"105"', "15", "Error", "10.5"], answer: 1 },
      { prompt: "Which value is a boolean?", options: ['"True"', "1.0", "True", "'yes'"], answer: 2 },
      { prompt: 'What does "hello".upper() return?', options: ['"Hello"', '"HELLO"', '"hello"', "Error"], answer: 1 },
    ]),
    check("python-data-structures", "Lists, tuples, dicts and sets", [
      { prompt: "lst = [11, 100, 99]. What is lst[0]?", options: ["100", "11", "99", "Error"], answer: 1, explanation: "Python counts from 0." },
      { prompt: "Which method adds an item to the end of a list?", options: [".add()", ".push()", ".append()", ".insert_end()"], answer: 2 },
      { prompt: "Which structure can't be changed after it's created?", options: ["List", "Dictionary", "Set", "Tuple"], answer: 3 },
      { prompt: 'd = {"name": "Plato", "born": -427}. What does d.get("born") return?', options: ['"born"', "-427", "None", "Error"], answer: 1 },
      { prompt: "What is set([1, 2, 2, 3, 3])?", options: ["{1, 2, 2, 3, 3}", "{1, 2, 3}", "[1, 2, 3]", "Error"], answer: 1 },
    ]),
    check("python-operators-conditionals", "Operators and if/else", [
      { prompt: "What is 17 % 5?", options: ["3", "2", "3.4", "12"], answer: 1, explanation: "% gives the remainder: 17 = 3 × 5 + 2." },
      { prompt: "What is 17 // 5?", options: ["3", "3.4", "2", "4"], answer: 0 },
      { prompt: "Which operator checks whether two values are equal?", options: ["=", "==", "!=", "=>"], answer: 1 },
      {
        prompt: "age = 15. Which branch runs?\nif age < 13: child\nelif age < 20: teenager\nelse: adult",
        options: ["child", "teenager", "adult", "none"],
        answer: 1,
      },
      { prompt: "What is (avg >= 40) and (lowest >= 35) when avg = 55 and lowest = 30?", options: ["True", "False", "55", "Error"], answer: 1 },
    ]),
    check("python-loops", "Loops: for, while, break, continue", [
      { prompt: "How many numbers does range(5) give?", options: ["4", "5", "6", "Infinite"], answer: 1, explanation: "0, 1, 2, 3, 4." },
      { prompt: "What does `break` do inside a loop?", options: ["Skips to the next round", "Leaves the loop immediately", "Restarts the loop", "Prints an error"], answer: 1 },
      { prompt: "What does `continue` do inside a loop?", options: ["Leaves the loop", "Skips the rest of this round and moves to the next", "Ends the program", "Pauses for input"], answer: 1 },
      { prompt: "Which loop keeps going as long as a condition is true?", options: ["for", "while", "if", "def"], answer: 1 },
      {
        prompt: "total = 0\nfor n in [2, 4, 6]: total = total + n\nWhat is total?",
        options: ["6", "12", "246", "0"],
        answer: 1,
      },
    ]),
    check("python-for-analytics", "Why Python for data analytics?", [
      {
        prompt: "When does Python beat Excel for analysis?",
        options: ["Typing 10 numbers", "Repeating the same cleaning steps on large or many files", "Making a quick sum", "Formatting a printout"],
        answer: 1,
      },
      { prompt: "Which library is used for tables (DataFrames) in Python?", options: ["Pandas", "Matplotlib", "Flask", "Pygame"], answer: 0 },
      { prompt: "Which library is used to draw charts?", options: ["NumPy", "Matplotlib", "Requests", "Pandas only"], answer: 1 },
      {
        prompt: "Which is the usual order of a data analysis?",
        options: ["Visualise → ask → clean", "Ask a question → collect → clean → analyse → visualise → share", "Clean → delete → share", "Share → ask → collect"],
        answer: 1,
      },
      { prompt: "Why do analysts save their work as code?", options: ["It looks impressive", "Anyone can re-run the same steps and get the same result", "Code never has errors", "It's required by Excel"], answer: 1 },
    ]),
    check("pandas-1", "DataFrames and reading data", [
      { prompt: "What is the usual way to import Pandas?", options: ["import pandas as pd", "include pandas", "using pandas", "import pd"], answer: 0 },
      { prompt: "Which line loads a CSV file?", options: ['pd.read_csv("orders.csv")', 'pd.open("orders.csv")', 'pd.csv("orders.csv")', 'read("orders.csv")'], answer: 0 },
      { prompt: "df.shape returns…", options: ["The column names", "(number of rows, number of columns)", "The first 5 rows", "The data types"], answer: 1 },
      { prompt: "Which method lists each column's type and how many values are not empty?", options: ["df.head()", "df.info()", "df.tail()", "df.sum()"], answer: 1 },
      { prompt: "df.describe() gives…", options: ["Summary statistics for numeric columns", "A chart", "The file name", "Only the first row"], answer: 0 },
    ]),
    check("pandas-2", "Selecting, filtering and sorting", [
      { prompt: 'Which selects one column called "City"?', options: ['df["City"]', "df.City()", 'df.select("City")', "df[City]"], answer: 0 },
      { prompt: "Which selects two columns?", options: ['df["City", "Sales"]', 'df[["City", "Sales"]]', 'df.columns("City", "Sales")', "df[City, Sales]"], answer: 1 },
      { prompt: 'Which keeps only rows where Sales is over 1000?', options: ['df[df["Sales"] > 1000]', 'df["Sales"] > 1000', "df.filter(Sales > 1000)", "df.where(1000)"], answer: 0 },
      { prompt: 'Which sorts by Sales, biggest first?', options: ['df.sort("Sales")', 'df.sort_values("Sales", ascending=False)', 'df.order("Sales")', 'df.sort_values("Sales")'], answer: 1 },
      { prompt: 'Which combines two conditions in a filter?', options: ['df[(df["A"] > 1) & (df["B"] < 5)]', 'df[df["A"] > 1 and df["B"] < 5]', 'df[A > 1 & B < 5]', "df.both()"], answer: 0 },
    ]),
    check("pandas-3", "Cleaning messy data", [
      { prompt: "Which method counts missing values in each column?", options: ["df.isnull().sum()", "df.count_missing()", "df.empty()", "df.nan()"], answer: 0 },
      { prompt: "Which method removes duplicate rows?", options: ["df.unique()", "df.drop_duplicates()", "df.remove()", "df.dedupe()"], answer: 1 },
      { prompt: 'Which fills missing ages with the average age?', options: ['df["Age"].fillna(df["Age"].mean())', 'df["Age"].mean()', 'df.dropna("Age")', 'df["Age"].replace()'], answer: 0 },
      { prompt: "Which converts a text column into real dates?", options: ["pd.to_datetime()", "pd.date()", "df.astype(date)", "str.date()"], answer: 0 },
      { prompt: 'Which renames the column "Ph" to "Phone"?', options: ['df.rename(columns={"Ph": "Phone"})', 'df.rename("Ph", "Phone")', 'df["Ph"] = "Phone"', 'df.columns("Phone")'], answer: 0 },
    ]),
    check("pandas-4", "Group, aggregate and reshape", [
      { prompt: 'df.groupby("Team")["Runs"].sum() gives…', options: ["Total runs for each team", "Number of teams", "Runs of the first player", "An error"], answer: 0 },
      { prompt: "Which gives several statistics at once after a groupby?", options: [".agg()", ".each()", ".many()", ".stats()"], answer: 0 },
      { prompt: "pd.melt() is used to…", options: ["Turn wide data (many columns) into long data (more rows)", "Delete columns", "Draw a chart", "Sort values"], answer: 0 },
      { prompt: "A pivot table in Pandas is made with…", options: ["df.pivot_table()", "df.pivot_chart()", "df.table()", "df.cross()"], answer: 0 },
      { prompt: "Values like 'NA' or '*' in a number column should first be…", options: ["Left as they are", "Turned into missing values (NaN), then handled", "Added up", "Plotted"], answer: 1 },
    ]),
    check("pandas-5", "End-to-end cleaning", [
      { prompt: "What should you do first with a new messy file?", options: ["Plot it", "Look at it: head(), info(), isnull().sum()", "Delete half the rows", "Email it"], answer: 1 },
      { prompt: 'Which removes extra spaces around text in a column?', options: ['df["Name"].str.strip()', 'df["Name"].trim()', 'df["Name"].clean()', 'df.strip("Name")'], answer: 0 },
      { prompt: 'Which makes all text in a column lower case?', options: ['df["City"].str.lower()', 'df["City"].lower()', "df.lower()", 'df["City"].small()'], answer: 0 },
      { prompt: "Which saves a cleaned DataFrame to a CSV file?", options: ['df.to_csv("clean.csv", index=False)', 'df.save("clean.csv")', 'pd.write("clean.csv")', 'df.export("clean")'], answer: 0 },
      { prompt: "Why keep the original raw file unchanged?", options: ["It takes less space", "So you can always redo the cleaning if something goes wrong", "Pandas requires it", "No reason"], answer: 1 },
    ]),
    check("matplotlib-1", "Line, bar and scatter", [
      { prompt: "What is the usual Matplotlib import?", options: ["import matplotlib.pyplot as plt", "import plot", "import matplotlib as plot", "from charts import plt"], answer: 0 },
      { prompt: "Which draws a line chart?", options: ["plt.plot()", "plt.bar()", "plt.scatter()", "plt.pie()"], answer: 0 },
      { prompt: "Which adds a chart title?", options: ['plt.title("Sales")', 'plt.name("Sales")', 'plt.header("Sales")', 'plt.label("Sales")'], answer: 0 },
      { prompt: 'Which makes the bars red?', options: ['plt.bar(x, y, color="red")', 'plt.bar(x, y, red)', 'plt.red(x, y)', 'plt.bar(x, y).red()'], answer: 0 },
      { prompt: "Which command shows the finished chart?", options: ["plt.show()", "plt.print()", "plt.open()", "plt.draw_all()"], answer: 0 },
    ]),
  ],

  "ai-tools": [
    check("ai-what-are-llms", "What are large language models?", [
      { prompt: "A large language model mostly works by…", options: ["Searching a fixed database", "Predicting likely next words from patterns it learned", "Copying Wikipedia", "Asking a human"], answer: 1 },
      { prompt: "An AI confidently giving a wrong fact is called a…", options: ["Bug report", "Hallucination", "Prompt", "Dataset"], answer: 1 },
      { prompt: "Which of these is a chat assistant built on a large language model?", options: ["Tableau", "Claude", "Google Sheets", "Colab"], answer: 1 },
      { prompt: "Why might an AI not know last week's cricket score?", options: ["It hates cricket", "Its training data stops at a certain date unless it can search", "Scores are secret", "It only knows maths"], answer: 1 },
      { prompt: "AI answers should be treated as…", options: ["Always correct", "A useful first draft you check", "Useless", "Legal advice"], answer: 1 },
    ]),
    check("ai-prompting-for-data", "Prompting for data work", [
      {
        prompt: "Which prompt will get the best formula?",
        options: ['"formula pls"', '"Column B has dates, C has sales. Write a Sheets formula for total sales in March."', '"Sheets help"', '"Make it work"'],
        answer: 1,
      },
      { prompt: "When asking AI to fix an error, you should include…", options: ["Only 'it broke'", "The code, the full error message and what you expected", "A screenshot of your desktop", "Nothing"], answer: 1 },
      { prompt: "Giving the column names and 3 sample rows helps because…", options: ["The AI understands the shape of your data", "It's polite", "It makes answers shorter", "It's required"], answer: 0 },
      { prompt: 'Adding "explain step by step" to a prompt helps you…', options: ["Learn and check its reasoning", "Get a shorter answer", "Hide mistakes", "Skip checking"], answer: 0 },
      { prompt: "If the first answer isn't right, the best next step is to…", options: ["Give up", "Tell it what's wrong and ask again with more detail", "Copy it anyway", "Restart your computer"], answer: 1 },
    ]),
    check("ai-in-colab-and-sheets", "AI in Colab and Sheets, checking its work", [
      { prompt: "AI writes Pandas code that runs without errors. Is the result definitely correct?", options: ["Yes", "No: check the output against what you expect", "Only on Tuesdays", "Only if it's short"], answer: 1 },
      { prompt: "A quick way to check an AI-computed average is to…", options: ["Trust it", "Recalculate it with =AVERAGE() or df.mean()", "Round it", "Ask a friend to guess"], answer: 1 },
      { prompt: "AI suggests deleting rows with missing values. You should first…", options: ["Do it straight away", "Check how many rows that removes and whether it changes the answer", "Delete the whole file", "Ignore missing values"], answer: 1 },
      { prompt: "Before you use an AI-written formula on all your data, test it…", options: ["On a few rows where you know the right answer", "Never", "Only after submitting", "On someone else's file"], answer: 0 },
      { prompt: "If AI and your own calculation disagree, you should…", options: ["Always pick the AI's", "Investigate which one is wrong", "Average the two", "Pick the bigger number"], answer: 1 },
    ]),
  ],
};
