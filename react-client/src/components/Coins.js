import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { client, errorHandler } from "../axios/express";
import "./Coins.css";
import Loading from "./Loading";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Col, Container, Row, Dropdown } from "react-bootstrap";
import {
  BsFillArrowUpCircleFill,
  BsFillArrowDownCircleFill,
  BsTable,
  BsFillGrid3X3GapFill,
} from "react-icons/bs";
import { BiSortZA } from "react-icons/bi";
import { IoMdStar } from "react-icons/io";
import numeral from "numeral";
import { predictedCoins } from "../config";

function Coins() {
  const [coins, setCoins] = useState([]);
  const [tableView, setTableView] = useState(
    localStorage.getItem("dashboardView") || "g"
  );
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState("");
  const [order, setOrder] = useState("");
  const navigate = useNavigate();

  const getSymbol = () => {
    return localStorage.getItem("currency").substring(3, 4);
  };

  const getCurr = () => {
    return localStorage.getItem("currency").substring(0, 3);
  };

  //Convert large number such as 1,000,000 to 1M
  const numeralise = (num) => {
    const converted = numeral(num).format("0.0a");
    return converted.slice(0, -1) + converted.slice(-1).toUpperCase();
  };

  useEffect(() => {
    async function getData() {
      try {
        const res = await client.get(`coingecko/currentprices/${getCurr()}`);
        setCoins(res.data);
      } catch (e) {
        console.error(e);
        errorHandler(e);
      }
    }
    getData();
  }, []);

  //Switch from grid and table views
  const switchView = () => {
    setOrder("");
    if (tableView === "t") {
      setTableView("g");
    } else {
      setTableView("t");
    }
  };

  //Sort table columns by ASC or DESC
  const sortTable = (col, gridOrder) => {
    //Columns that contain numbers
    const columns = [
      "current_price",
      "price_change_percentage_24h",
      "market_cap",
      "circulating_supply",
    ];
    let currOrder;
    if (!gridOrder) {
      currOrder = sortCol === col && order === "ASC" ? "DSC" : "ASC";
      setSortCol(col);
      setOrder(currOrder);
    } else {
      currOrder = gridOrder;
    }
    if (currOrder === "ASC") {
      if (columns.includes(col)) {
        setCoins(
          [...coins].sort((a, b) =>
            parseFloat(a[col]) > parseFloat(b[col]) ? 1 : -1
          )
        );
      } else {
        setCoins(
          [...coins].sort((a, b) =>
            a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
          )
        );
      }
    }

    if (currOrder === "DSC") {
      if (columns.includes(col)) {
        setCoins(
          [...coins].sort((a, b) =>
            parseFloat(a[col]) > parseFloat(b[col]) ? -1 : 1
          )
        );
      } else {
        setCoins(
          [...coins].sort((a, b) =>
            a[col].toLowerCase() > b[col].toLowerCase() ? -1 : 1
          )
        );
      }
    }
  };

  const handleGridSort = (val) => {
    const selectedCol = val.substring(3);
    const selectedOrd = val.substring(0, 3);

    sortTable(selectedCol, selectedOrd);
  };

  if (coins.length === 0) return <Loading />;

  return (
    <Container>
      <Container>
        <h1>Coins</h1>
        <p>
          <IoMdStar /> Prediction Support
        </p>
      </Container>

      <Row>
        <Col className="d-flex justify-content-center">
          <input
            className="form-control w-50"
            placeholder="Search"
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </Col>
      </Row>

      {tableView === "t" ? (
        <Container>
          <Row>
            <Col className="d-flex justify-content-center">
              <Button variant="primary" onClick={switchView}>
                <BsFillGrid3X3GapFill />
              </Button>
            </Col>
          </Row>
          <Row className="round-box">
            <Table
              striped
              responsive
              className="coin-table"
              style={{ color: "white" }}
            >
              <thead>
                <tr className="text-center">
                  <th>Icon</th>
                  <th onClick={() => sortTable("name")}>
                    Name{" "}
                    {sortCol === "name" ? (
                      order === "ASC" ? (
                        <BsFillArrowUpCircleFill />
                      ) : (
                        <BsFillArrowDownCircleFill />
                      )
                    ) : (
                      ""
                    )}
                  </th>
                  <th onClick={() => sortTable("symbol")}>
                    Symbol{" "}
                    {sortCol === "symbol" ? (
                      order === "ASC" ? (
                        <BsFillArrowUpCircleFill />
                      ) : (
                        <BsFillArrowDownCircleFill />
                      )
                    ) : (
                      ""
                    )}
                  </th>
                  <th onClick={() => sortTable("current_price")}>
                    Price{" "}
                    {sortCol === "current_price" ? (
                      order === "ASC" ? (
                        <BsFillArrowUpCircleFill />
                      ) : (
                        <BsFillArrowDownCircleFill />
                      )
                    ) : (
                      ""
                    )}
                  </th>
                  <th onClick={() => sortTable("price_change_percentage_24h")}>
                    Change{" "}
                    {sortCol === "price_change_percentage_24h" ? (
                      order === "ASC" ? (
                        <BsFillArrowUpCircleFill />
                      ) : (
                        <BsFillArrowDownCircleFill />
                      )
                    ) : (
                      ""
                    )}
                  </th>
                  <th onClick={() => sortTable("market_cap")}>
                    Market Cap{" "}
                    {sortCol === "market_cap" ? (
                      order === "ASC" ? (
                        <BsFillArrowUpCircleFill />
                      ) : (
                        <BsFillArrowDownCircleFill />
                      )
                    ) : (
                      ""
                    )}
                  </th>
                  <th onClick={() => sortTable("circulating_supply")}>
                    Circulating Supply{" "}
                    {sortCol === "circulating_supply" ? (
                      order === "ASC" ? (
                        <BsFillArrowUpCircleFill />
                      ) : (
                        <BsFillArrowDownCircleFill />
                      )
                    ) : (
                      ""
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {coins
                  .filter((term) => {
                    if (search === "") {
                      return true;
                    } else if (
                      term.name.toLowerCase().includes(search.toLowerCase()) ||
                      term.symbol.toLowerCase().includes(search.toLowerCase())
                    ) {
                      return true;
                    }
                    return false;
                  })
                  .map((coin) => (
                    <tr
                      className="tableRow text-center"
                      key={`${coin.symbol}_${Date.now()}`}
                      onClick={() => navigate(`/${coin.id}`)}
                    >
                      <td>
                        <img
                          className="card-img"
                          src={coin.image}
                          alt="currency icon"
                        />
                      </td>
                      <td>
                        {predictedCoins.includes(coin.id) && <IoMdStar />}{" "}
                        {coin.name}
                      </td>
                      <td>{coin.symbol.toUpperCase()}</td>
                      <td>
                        {getSymbol()}
                        {coin.current_price.toLocaleString("en-GB", {
                          maximumFractionDigits: 20,
                        })}
                      </td>
                      <td
                        style={{
                          color:
                            coin.price_change_percentage_24h < 0
                              ? "red"
                              : "green",
                        }}
                      >
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </td>
                      <td>
                        {getSymbol()}
                        {numeralise(coin.market_cap)}
                      </td>
                      <td>{numeralise(coin.circulating_supply)}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Row>
        </Container>
      ) : (
        <Row>
          <Row>
            <Col className="d-flex justify-content-end">
              <Button variant="primary" className="w-20" onClick={switchView}>
                <BsTable />
              </Button>
            </Col>

            <Col className="d-flex justify-content-start">
              <Dropdown onSelect={handleGridSort}>
                <Dropdown.Toggle
                  variant="success"
                  className="w-20"
                  id="dropdown-basic"
                >
                  <BiSortZA />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item eventKey={"DSCcurrent_price"}>
                    Price (Highest)
                  </Dropdown.Item>
                  <Dropdown.Item eventKey={"ASCcurrent_price"}>
                    Price (Lowest)
                  </Dropdown.Item>
                  <Dropdown.Item eventKey={"ASCname"}>Name (A-Z)</Dropdown.Item>
                  <Dropdown.Item eventKey={"DSCname"}>Name (Z-A)</Dropdown.Item>
                  <Dropdown.Item eventKey={"ASCsymbol"}>
                    Symbol (A-Z)
                  </Dropdown.Item>
                  <Dropdown.Item eventKey={"DSCsymbol"}>
                    Symbol (Z-A)
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
          {coins
            .filter((term) => {
              if (search === "") {
                return true;
              } else if (
                term.name.toLowerCase().includes(search.toLowerCase()) ||
                term.symbol.toLowerCase().includes(search.toLowerCase())
              ) {
                return true;
              }
              return false;
            })
            .map((coin) => (
              <div className="card" key={`${coin.symbol}_${Date.now()}`}>
                {/*to ensure price refreshes on page refresh and not cache*/}
                <div className="card-body">
                  <img
                    className="card-img"
                    src={coin.image}
                    alt="currency icon"
                  />
                  <h5 className="card-title">
                    {predictedCoins.includes(coin.id) && <IoMdStar />}{" "}
                    {coin.name}
                  </h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {}
                    {coin.symbol.toUpperCase()}
                  </h6>
                  <p className="card-text price">
                    {getSymbol()}
                    {coin.current_price.toLocaleString("en-GB", {
                      maximumFractionDigits: 20,
                    })}
                  </p>
                  <Button
                    className="btn"
                    onClick={() => navigate(`/${coin.id}`)}
                  >
                    More
                  </Button>
                </div>
              </div>
            ))}
        </Row>
      )}
    </Container>
  );
}

export default Coins;
