const mysql = require("mysql");
const express = require("express");
var app = express();
const bodyparser = require("body-parser");

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "EmployeeDB",
  multipleStatements: true
});

mysqlConnection.connect(err => {
  if (!err) console.log("DB connection succeded.");
  else
    console.log(
      "DB connection failed \n Error : " + JSON.stringify(err, undefined, 2)
    );
});

app.listen(3002, () => console.log("Express server is running at port : 3002"));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Get all Employees
app.get("/employees", (req, res) => {
  mysqlConnection.query("SELECT * FROM Employee", (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else console.log(err);
  });
});

//Get an Employee
app.get("/employees/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM Employee WHERE EmpID = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

//Delete an Employee
app.delete("/employees/:id", (req, res) => {
  mysqlConnection.query(
    "DELETE FROM Employee WHERE EmpID = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send("Employee Deleted");
      else console.log(err);
    }
  );
});

//Insert an Employee
app.post("/employees", (req, res) => {
  let emp = req.body;
  var sql =
    "SET @EmpID = ?;SET @Name = ?;SET @salary = ?; \
    Call EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
  mysqlConnection.query(
    sql,
    [emp.EmpID, emp.EmpCode, emp.Salary],
    (err, rows, fields) => {
      if (!err)
        rows.forEach(element => {
          if (element.constructor == Array)
            res.send("New Employee Added, id : " + element[0].EmpID);
        });
      else console.log(err);
    }
  );
});

//Update an Employee
app.put("/employees", (req, res) => {
  let emp = req.body;
  var sql =
    "SET @EmpID = ?;SET @Name = ?;SET @EmpCode =?;SET @salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
  mysqlConnection.query(
    sql,
    [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],
    (err, rows, fields) => {
      if (!err) res.send("Updated Successfully");
      else console.log(err);
    }
  );
});
