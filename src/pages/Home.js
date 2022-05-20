import React, { useState } from "react";
import { Table } from "react-bootstrap";
const Home = () => {
  const [fileData, setFileData] = useState([]);
  const [abstructData, setAbstructData] = useState([]);

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    let uploadFile = e.target.files[0];
    if (uploadFile) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(uploadFile);
    }
  };

  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const rowData = csvRows.map((i) => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setFileData(rowData);
    handleFilter(rowData);
  };

  const groupBy = (list, keyGetter) => {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      if (key) {
        const collection = map.get(key);
        if (!collection) {
          map.set(key, [item]);
        } else {
          collection.push(item);
        }
      }
    });

    const arr = Array.from(map, ([key, value]) => {
      return { key: value };
    });
    return arr;
  };

  const handleFilter = (fileData) => {
    let grouped = groupBy(fileData, (employee) => employee.ProjectID);
    if (grouped && grouped.length > 0) {
      let finalArr = grouped.map((item) => {
        return {
          ...item,
          totalDay: abstractDates(item.key),
        };
      });

      let filterArr = finalArr.map((item) => {
        if (item.totalDay) {
          return {
            totalDay: item.totalDay,
            emp1: item.key[0].EmpID,
            emp2: item.key[1].EmpID,
            ProjectID: item.key[0].ProjectID,
          };
        }
      });
      let x = filterArr.indexOf(undefined);
      if (x > -1) {
        filterArr.splice(x, 1);
      }
      setAbstructData(filterArr);
    }
  };

  const abstractDates = (arr) => {
    let diffStart, diffEnd, days;
    if (arr && arr.length > 1) {
      let fromDate =
        arr[0].DateFrom === "null" ? new Date() : new Date(arr[0].DateFrom);
      let toDate =
        arr[0].DateTo === "null" ? new Date() : new Date(arr[0].DateTo);

      // secon index
      let fromDate2 =
        arr[1].DateFrom === "null" ? new Date() : new Date(arr[1].DateFrom);
      let toDate2 =
        arr[1].DateTo === "null" ? new Date() : new Date(arr[1].DateTo);

      // abstruct between fromDate for each employee on the same project
      if (fromDate > fromDate2) {
        diffStart = Math.abs(fromDate - fromDate2);
      } else {
        diffStart = Math.abs(fromDate2 - fromDate);
      }

      // abstruct between toDate for each employee on the same project
      if (toDate > toDate2) {
        diffEnd = Math.abs(toDate - toDate2);
      } else {
        diffEnd = Math.abs(toDate2 - toDate);
      }

      let final;
      if (diffStart > diffEnd) {
        final = Math.abs(diffStart - diffEnd);
      } else {
        final = Math.abs(diffEnd - diffStart);
      }

      console.group("final final: ", final);
      // convert to days
      days = (final / (1000 * 3600 * 24));
      days = Math.floor(days)
      console.log("daaaays: ", days);
    }

    return days;
  };

  return (
    <div className="container">
      <h2 className="company_title">Sirma Solution </h2>
      <form className="form_style">
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />

        <label htmlFor="file-upload" className="custom-file-upload">
          Upload CSV File
        </label>
      </form>
      <br />
      <Table size="sm">
        <thead>
          <tr key={"header"}>
            <th>Employee ID #1</th>
            <th>Employee ID #2</th>
            <th>Project ID</th>
            <th>Worked Dayes</th>
          </tr>
        </thead>
        <tbody>
          {abstructData.map((item, index) => (
            <tr key={index.toString()}>
              <td>{item.emp1}</td>
              <td>{item.emp2}</td>
              <td>{item.ProjectID}</td>
              <td>{item.totalDay}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Home;
