import React, { useEffect, useState } from "react";
import { Container, Row, Table } from "react-bootstrap";
import * as express from "../axios/express";
import Loading from "./Loading";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const getLocalCurr = () => {
    return localStorage.getItem("currency");
  };

  const getLocalSymbol = () => {
    return localStorage.getItem("currency").substring(3, 4);
  };

  useEffect(() => {
    async function getLeaderboard() {
      try {
        let res = await express.client.get(
          `leaderboard/portfolio/${getLocalCurr()}`
        );
        res = res.data;

        setLeaderboard(res);

        setLoading(false);
      } catch (e) {
        console.error(e);
        express.errorHandler(e);
      }
    }
    getLeaderboard();
  }, []);

  if (loading) return <Loading />;

  return (
    <Container>
      <Row>
        <h1>Leaderboard ({getLocalCurr().substring(0, 3).toUpperCase()})</h1>
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
              <th>#</th>
              <th>Player</th>
              <th>P/L ({getLocalSymbol()})</th>
              <th>P/L (%)</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((score, i) => (
              <tr className="text-center" key={score.username}>
                <td>{i + 1}</td>
                <td>{score.username}</td>
                <td>
                  {getLocalSymbol()}
                  {score.PL.toFixed(2)}
                </td>
                <td
                  style={{
                    color: 100 * (score.PL / 100000) < 0 ? "red" : "green",
                  }}
                >
                  {(100 * (score.PL / 100000)).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
}

export default Leaderboard;
